import React from 'react';
import { StyleSheet, View, Platform, Alert, PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';


type MarkerItem = {
  id: number;
  title?: string;
  coordinate: { latitude: number; longitude: number };
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
};

export default function SchoolMap({ markers = [], initialRegion }: Props) {
  const fallback: Region = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [region, setRegion] = React.useState<Region>(initialRegion ?? fallback);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'App needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
        }
        Geolocation.getCurrentPosition(
          (position) => {
            const next: Region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            if (mounted) setRegion(next);
          },
          (_error) => {
            Alert.alert('Ubicación', 'No se pudo obtener la ubicación actual');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch {
        Alert.alert('Ubicación', 'No se pudo obtener la ubicación actual');
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map(m => (
          <Marker key={m.id} coordinate={m.coordinate} title={m.title} />
        ))}
        <Marker coordinate={region} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});