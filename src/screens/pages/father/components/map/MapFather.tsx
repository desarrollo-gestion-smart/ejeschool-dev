// src/components/map/SimpleRouteMap.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import MarkerOrigin from '../../../../../assets/marker-origin.svg';
import MarkerDestination from '../../../../../assets/marker-destination.svg'; // Asegúrate de tener este SVG

type Props = {
  pickup: { latitude: number; longitude: number; name?: string };
  dropoff: { latitude: number; longitude: number; name?: string };
  distance?: string;
  duration?: string;
};

const getMapsApiKey = () => {
  return (Config as any)?.GOOGLE_MAPS_API_KEY || '';
};

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
]

export default function MapFather({ pickup, dropoff, distance: _distance, duration: _duration }: Props) {
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: (pickup.latitude + dropoff.latitude) / 2,
    longitude: (pickup.longitude + dropoff.longitude) / 2,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitToCoordinates([pickup, dropoff], {
        edgePadding: { top: 180, left: 80, bottom: 280, right: 80 },
        animated: true,
      });
    }, 500);
  }, [pickup, dropoff]);

  const apiKey = getMapsApiKey();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        customMapStyle={uberLightMapStyle}
      >
        {/* Marcador de Recogida - Verde */}
        <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.pickupCircle}>
            <MarkerOrigin width={32} height={32} fill="#10B981" />
          </View>
        </Marker>

        {/* Marcador de Destino - Pin rojo clásico */}
        <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 1 }}>
          <MarkerDestination width={40} height={40} />
        </Marker>

        {/* Línea de ruta */}
        {apiKey ? (
          <MapViewDirections
            origin={pickup}
            destination={dropoff}
            apikey={apiKey}
            strokeWidth={5}
            strokeColor="#5d01bc"
            optimizeWaypoints={true}
            mode="DRIVING"
            onReady={(result) => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 180, left: 80, bottom: 280, right: 80 },
              });
            }}
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pickupCircle: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#10B981',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
