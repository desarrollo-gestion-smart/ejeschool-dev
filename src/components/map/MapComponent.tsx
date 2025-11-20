/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Map/SchoolMap.tsx
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// Add env read (optional, helpful to detect missing key at runtime)
import Config from 'react-native-config';

interface SchoolMapProps {
  markers?: Array<{
    id: number;
    title: string;
    coordinate: { latitude: number; longitude: number };
  }>;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const SchoolMap: React.FC<SchoolMapProps> = ({
  markers = [],
  initialRegion = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
}) => {
  const googleMapsApiKey = Config.GOOGLE_MAPS_API_KEY;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        // Ensure Google provider on Android
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});

export default SchoolMap;
