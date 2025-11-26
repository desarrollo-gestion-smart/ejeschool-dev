import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import MapViewDirections from 'react-native-maps-directions';
import BottomBar from './layout/BottomBar';
import MarkerOrigin from '../../assets/marker-origin.svg';
import MarkerDestination from '../../assets/marker-destination.svg';
import useResponsive from '../../types/useResponsive';

// --- TIPOS ---

export type Coordinate = { latitude: number; longitude: number };

type MarkerItem = {
  id: number;
  title: string;
  coordinate: Coordinate;
  type: 'origin' | 'destination' | 'waypoint';
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  markers?: MarkerItem[];
  initialRegion?: Region;
  bottomContent?: (args: {
    collapsed: boolean;
    toggle: () => void;
    onRouteSelect: (stops: Coordinate[]) => void;
  }) => React.ReactNode;
  googleApiKey?: string;
  origin?: Coordinate;
  destination?: Coordinate;
  waypoints?: Coordinate[];
};

// --- COMPONENTE ---

export default function MapComponent({
  markers = [],
  initialRegion,
  bottomContent,
  googleApiKey,
  origin,
  destination,
  waypoints,
}: Props) {
  const mapRef = React.useRef<MapView>(null);
  const watchIdRef = React.useRef<number | null>(null);
  const {} = useResponsive();
  const [activeRoute, setActiveRoute] = React.useState<{
    origin?: Coordinate;
    destination?: Coordinate;
    waypoints?: Coordinate[];
  }>({});
  const [routeStopMarkers, setRouteStopMarkers] = React.useState<MarkerItem[]>(
    [],
  );
  const [collapsed, setCollapsed] = React.useState(true);
  const waypointColors = [
    '#6D28D9',
    '#4ECDC4',
    '#FFE66D',
    '#95E1D3',
    '#FF6B6B',
    '#7B7B7B',
  ];
  const fallback: Region = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [region, setRegion] = React.useState<Region>(initialRegion ?? fallback);
  const [isFollowing, setIsFollowing] = React.useState(false);

  const ensureLocationPermission =
    React.useCallback(async (): Promise<boolean> => {
      if (Platform.OS !== 'android') return true;
      const fine = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const coarse = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      if (fine || coarse) return true;
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      const granted =
        results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
      const never =
        results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
      if (never) {
        Alert.alert(
          'Ubicación',
          'Permiso deshabilitado. Actívalo en Ajustes del sistema.',
        );
      }
      return granted;
    }, []);

  const centerMap = React.useCallback((newRegion: Region, animate = true) => {
    setRegion(newRegion);
    if (animate) {
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  }, []);

  const centerMapOnCurrentLocation = React.useCallback(async () => {
    const ok = await ensureLocationPermission();
    if (!ok) return;

    Geolocation.getCurrentPosition(
      position => {
        const next: Region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        centerMap(next);
        setIsFollowing(true);
      },
      error => {
        if ((error as any)?.code === 1) {
          Alert.alert('Ubicación', 'Permiso de ubicación denegado');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, [centerMap, ensureLocationPermission]);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const ok = await ensureLocationPermission();
        if (!ok) {
          if (mounted)
            Alert.alert('Ubicación', 'Permiso de ubicación denegado.');
          return;
        }
        Geolocation.getCurrentPosition(
          position => {
            const next: Region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            if (mounted && initialRegion === undefined) {
              setRegion(next);
            }
          },
          _error => {
            console.log('Error al obtener ubicación inicial');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } catch {
        Alert.alert('Ubicación', 'No se pudo obtener la ubicación actual');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [ensureLocationPermission, initialRegion]);

  React.useEffect(() => {
    const stopWatch = () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        console.log('Parando el seguimiento (watchPosition)');
      }
    };

    if (isFollowing) {
      (async () => {
        const ok = await ensureLocationPermission();
        if (!ok) {
          setIsFollowing(false);

          return;
        }

        const id = Geolocation.watchPosition(
          position => {
            if (isFollowing) {
              const newRegion: Region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              centerMap(newRegion);
            }
          },
          error => {
            if ((error as any)?.code === 1) {
              Alert.alert('Ubicación', 'Permiso de ubicación denegado');
            }
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 2000,
          },
        );
        watchIdRef.current = id;
        console.log('Iniciando el seguimiento (watchPosition)');
      })();
    } else {
      stopWatch();
    }

    return stopWatch;
  }, [isFollowing, ensureLocationPermission, centerMap]);

  const applyRouteStops = React.useCallback(
    (stops: Coordinate[]) => {
      if (!stops || stops.length < 2) {
        setActiveRoute({});
        setRouteStopMarkers([]);
        setCollapsed(false);
        return;
      }
      setCollapsed(false);
      const originStop = stops[0];
      const destinationStop = stops[stops.length - 1];
      const wp = stops.slice(1, stops.length - 1);
      setActiveRoute({
        origin: originStop,
        destination: destinationStop,
        waypoints: wp,
      });
      const nextMarkers: MarkerItem[] = [
        { id: 1, title: 'Origen', coordinate: originStop, type: 'origin' },
        ...wp.map((c, i) => ({
          id: i + 2,
          title: `Parada ${i + 1}`,
          coordinate: c,
          type: 'waypoint' as const,
        })),
        {
          id: wp.length + 2,
          title: 'Destino',
          coordinate: destinationStop,
          type: 'destination',
        },
      ];
      setRouteStopMarkers(nextMarkers);
      const regionToCenter: Region = {
        latitude: originStop.latitude,
        longitude: originStop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      centerMap(regionToCenter);
    },
    [centerMap],
  );

  return (
    <View style={styles.container}>
           {' '}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={() => {
          if (isFollowing) {
            setIsFollowing(false);
          }
        }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
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
              <MarkerOrigin width={24} height={24} color="#00BFFF" />
            ) : marker.type === 'destination' ? (
              <MarkerDestination width={26} height={26} color="#FF3B30" />
            ) : (
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
          const googleKey =
            googleApiKey ??
            (Config.GOOGLE_API_KEY || (Config as any).GOOGLE_MAPS_API_KEY);
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
          return (
            <MapViewDirections
              origin={o}
              destination={d}
              waypoints={w}
              apikey={googleKey as string}
              strokeWidth={5}
              strokeColor="#000"
              optimizeWaypoints={true}
              mode="DRIVING"
              onReady={result => {
                if (mapRef.current) {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
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
          style={[
            styles.followButton,
            isFollowing && styles.followButtonActive,
          ]}
          onPress={async () => {
            if (isFollowing) {
              setIsFollowing(false);
            } else {
              await centerMapOnCurrentLocation();
            }
          }}
        >
                 {' '}
          <Image
            source={{
              uri: 'https://img.icons8.com/?size=100&id=zydjAKYE3RWr&format=png&color=000000',
            }}
            style={[styles.aimstyles, isFollowing && styles.aimstylesActive]}
          />
               {' '}
        </TouchableOpacity>
        <BottomBar collapsed={collapsed}>
          {bottomContent?.({
            collapsed,
            toggle: () => setCollapsed(v => !v),
            onRouteSelect: applyRouteStops,
          })}
        </BottomBar>
      </View>
         {' '}
    </View>
  );
}

// --- ESTILOS ---

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  followButtonContainer: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    bottom: 0,
    paddingHorizontal: 10,
  },
  followButton: {
    marginRight: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 30,
    padding: 5,
    elevation: 4,
    zIndex: 1000,
    shadowColor: '#6f6f6fa5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  followButtonActive: {
    backgroundColor: '#ddd',
  },
  aimstyles: {
    resizeMode: 'contain',
    width: 28,
    height: 24,
    tintColor: '#000',
  },
  aimstylesActive: {
    tintColor: '#1E90FF',
    resizeMode: 'contain',
  },
  stopMarkerBase: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#007AFF',
  },
  stopMarkerLarge: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
