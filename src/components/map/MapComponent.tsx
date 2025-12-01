import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
// import AppLayout from './layout/AppLayout';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarkerOrigin from '../../assets/markers/marker-origin.svg';
import MarkerDestination from '../../assets/markers/makerr-destination-own.svg';
import type { Coordinate } from '../FooterRoutes/routesData';
import MarkerMe from '../../assets/markers/waypoint.svg';



type MarkerItem = {
  id: number;
  title: string;
  coordinate: Coordinate;
  type: 'origin' | 'destination' | 'waypoint';
  status?: 'red' | 'green' | 'conductor'; 
  nameRol?: string;
};

type Props = {
  markers?: MarkerItem[];
  initialRegion?: Region;
  renderTopBar?: React.ReactNode;
  bottomContent?: (args: {
    collapsed: boolean;
    toggle: () => void;
    onRouteSelect: (stops: Coordinate[]) => void;
    onModeChange: (isDetails: boolean) => void;
  }) => React.ReactNode;
  driver?: Coordinate;
  origin?: Coordinate;
  destination?: Coordinate;
  waypoints?: Coordinate[];
};

const getMapsApiKey = (): string => {
  return (Config as any)?.GOOGLE_MAPS_API_KEY || (Config as any)?.Maps_API_KEY || '';
};
// Esta función simulará la obtención de la dirección real a partir de las coordenadas
const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    const apiKey = getMapsApiKey();
    if (!apiKey) {
        console.warn("GOOGLE_MAPS_API_KEY is missing. Cannot perform geocoding.");
        return `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            // Devuelve la dirección formateada
            return data.results[0].formatted_address;
        } else {
            // Manejo de errores de la API o sin resultados
            return 'Dirección no encontrada';
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
        return 'Error de servicio de geocodificación';
    }
};
// -----------------------------------------------------------------------------


export default function MapComponent({
  markers = [],
  initialRegion,
  renderTopBar,
  bottomContent,
  origin,
  destination,
  driver,
  waypoints,
}: Props) {
  const uberLightMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#FAFAFA' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#F7F8FA' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#FAFAFA' }] },
    { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#F9FAFB' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#FAFAFA' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#F7F7F7' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#EEEEEE' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#BDBDBD' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#B8B8B8' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  ];
  const mapRef = React.useRef<MapView>(null);
  const [activeRoute, setActiveRoute] = React.useState<{
    origin?: Coordinate;
    destination?: Coordinate;
    driver?: Coordinate;
    waypoints?: Coordinate[];
  }>({});
  const [routeStopMarkers, setRouteStopMarkers] = React.useState<MarkerItem[]>([]);
  const [routeCoords, setRouteCoords] = React.useState<Coordinate[]>([]);
  // details mode not used currently
  const [collapsed, setCollapsed] = React.useState(true);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const waypointColors = ['#3B82F6', '#10B981', '#EF4444'];
  const googleApiKey = getMapsApiKey();
  // no defaultStops: map does not auto-initialize from routesData

  const fallback: Region = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [region] = React.useState<Region>(initialRegion ?? fallback);


  // Centra y ajusta el mapa para mostrar toda la ruta
  const fitToRoute = React.useCallback(() => {
    const allPoints = [
      ...(activeRoute.origin ? [activeRoute.origin] : origin ? [origin] : []),
      ...(activeRoute.waypoints || waypoints || []),
      ...(activeRoute.destination ? [activeRoute.destination] : destination ? [destination] : []),
    ].filter(Boolean) as Coordinate[];

    if (allPoints.length < 1) return;

    if (allPoints.length === 1) {
      mapRef.current?.animateToRegion({
        latitude: allPoints[0].latitude,
        longitude: allPoints[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 600);
      return;
    }

    mapRef.current?.fitToCoordinates(allPoints, {
      edgePadding: { top: 200, right: 200, bottom: 100, left: 110 },
      animated: true,
    });
  }, [activeRoute, origin, destination, waypoints]);


  // Ajustar vista cuando cambia la ruta o sus coordenadas
  React.useEffect(() => {
    if (routeCoords.length > 1) {
      setTimeout(() => fitToRoute(), 300);
    }
  }, [routeCoords, fitToRoute]);

  // MODIFICACIÓN CLAVE: Implementación de Geocodificación Inversa
  const applyRouteStops = React.useCallback(
    async (stops: Coordinate[]) => {
      const allStops = (stops || []).filter(Boolean);
      // Incluir puntos con status aquí para asegurar que también se geocodifiquen
      const routeStopsUniq = allStops.filter((s, idx, arr) => arr.findIndex(t => t.latitude === s.latitude && t.longitude === s.longitude) === idx);
      
      if (routeStopsUniq.length < 2) {
        setActiveRoute({});
        setRouteStopMarkers([]);
        setRouteCoords([]);
        return;
      }
      
      // 1. Obtener y enriquecer todas las paradas con su dirección
      const geocodingPromises = routeStopsUniq.map(async (c) => {
          // Si el punto ya tiene una dirección (por ejemplo, si se cachea en la capa superior), no la buscamos.
          // En este caso, siempre la buscamos para el ejemplo.
          const address = await getAddressFromCoordinates(c.latitude, c.longitude);
          return { ...c, address };
      });

      const enrichedStops = await Promise.all(geocodingPromises);
      
      // 2. Separar puntos de la ruta y puntos de status (para MapViewDirections vs Markers)
      const primaryRouteStops = enrichedStops.filter(s => !s.status);
      const extraStops = enrichedStops.filter(s => !!s.status);

      if (primaryRouteStops.length < 2) {
          // Esto puede ocurrir si todos los puntos tienen status, lo cual no es una ruta válida.
          setActiveRoute({});
          setRouteStopMarkers([]);
          setRouteCoords([]);
          return;
      }
      
      const originStop = primaryRouteStops[0];
      const destinationStop = primaryRouteStops[primaryRouteStops.length - 1];
      const wp = primaryRouteStops.slice(1, primaryRouteStops.length - 1);

      setActiveRoute({ origin: originStop, destination: destinationStop, waypoints: wp });

      const nextMarkers: MarkerItem[] = [
        { id: 1, title: originStop.name || originStop.address || 'Origen', coordinate: originStop, type: 'origin' },
        ...wp.map((c, i) => ({ id: 100 + i, title: c.name || c.address || `Punto ${i + 1}`, coordinate: c, type: 'waypoint' as const })),
        { id: 2, title: destinationStop.name || destinationStop.address || 'Destino', coordinate: destinationStop, type: 'destination' },
        // Incluir markers de status enriquecidos (si los hay)
        ...extraStops.map((c, i) => ({ id: 200 + i, title: c.name || c.address || (c.status === 'red' ? 'Conductor' : 'Punto'), coordinate: c, type: 'waypoint' as const })),
      ];
      setRouteStopMarkers(nextMarkers);
    },
    [],
  );

  React.useEffect(() => {
    const o = activeRoute.origin ?? origin;
    const d = activeRoute.destination ?? destination;
    const w = activeRoute.waypoints ?? waypoints;
    if (!o || !d) {
      setRouteCoords([]);
      return;
    }
    setRouteCoords([o, ...(w ?? []), d]);
  }, [activeRoute, origin, destination, waypoints]);

  return (
    <View style={styles.container}>
      {renderTopBar ? <View style={styles.topOverlay}>{renderTopBar}</View> : null}
           {' '}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        // onMapReady={() => {}}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        customMapStyle={uberLightMapStyle}
      >
               {' '}
        {markers.map(m => (
          <Marker key={m.id} coordinate={m.coordinate} title={m.title} />
        ))}
        {routeStopMarkers.map((marker, idx) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
            onPress={() => setCollapsed(false)}
          >
            {marker.type === 'origin' ? (
              <MarkerOrigin width={24} height={24} color="#2563EB" />
            ) : marker.type === 'destination' ? (
              <MarkerDestination  width={30} height={50} fill="#2563EB" color="#2563EB" />
            ) : marker.nameRol === 'conductor'  ?(
              <MarkerMe width={22} height={22} fill="#000" />
            )
            :(
              <MarkerOrigin
                width={22}
                height={22}
                color={
                  waypointColors[Math.max(0, (idx - 1) % waypointColors.length)]
                }
              />
            )}
          </Marker>
        ))}
        {(() => {
          const googleKey = googleApiKey || (Config as any).GOOGLE_MAPS_API_KEY;
          const o = activeRoute.origin ?? origin;
          const d = activeRoute.destination ?? destination;
          const w = activeRoute.waypoints ?? waypoints;
          if (!(o && d)) return null;
          if (!googleKey) {
            Alert.alert(
              'Ruta',
              'falla en la implementacion para trazar direcciones',
            );
            return null;
          }

          // queda pendiente revisar el porque no se estan uniendo las rutas de
          //  origin destinatoin con los waaypoint y por que no se puede ver el
          //  marker de conductor
          return (

            
            <MapViewDirections
              origin={o}
              destination={d}
              waypoints={w}
              apikey={googleKey as string}
              strokeWidth={5}
              strokeColor="#707070"
              optimizeWaypoints
              mode="DRIVING"
              onReady={result => {
                if (mapRef.current) {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    animated: true,
                  });
                }
              }}
              onError={_errorMessage => {
                Alert.alert(
                  'Ruta',
                  'No se pudo trazar la ruta con Google Directions',
                );
              }}
            />
          );
        })()}
             {' '}
      </MapView>
           
      <View style={styles.followButtonContainer}>
        <TouchableOpacity
          style={styles.followButton}
          onPress={async () => {
            if (isFollowing) {
              setIsFollowing(false);
            } else {
              // Placeholder follow behavior
              setIsFollowing(true);
            }
          }}
        >
                 {' '}
          <Image
            source={{
              uri: 'https://img.icons8.com/?size=100&id=zydjAKYE3RWr&format=png&color=000000',
            }}
            style={styles.aimstyles}
          />
        </TouchableOpacity>
        {bottomContent?.({
          collapsed,
          toggle: () => setCollapsed(v => !v),
          onRouteSelect: applyRouteStops,
          onModeChange: (_v: boolean) => {},
        })}
      </View>
         {' '}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 },
  mapFallback: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  mapFallbackText: { color: '#333', backgroundColor: '#FFFFFFEE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  
  followButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 7  ,
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 50,
  },
  followButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 8,
  },
  aimstyles: { width: 28, height: 28, tintColor: '#000' },
  reportsButtonContainer: { position: 'absolute', zIndex: 30 },
  reportsButton: { backgroundColor: '#6D28D9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  reportsButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
