// src/components/map/SimpleRouteMap.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../types/Navigation';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Config from 'react-native-config';

//mapas
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

//iconos
import MarkerDestination from '../../../../../assets/markers/marker-destination.svg'; // Asegúrate de tener este SVG
import MarkerOrigin from '../../../../../assets/markers/marker-origin.svg';
import ProfileDrawer from '../ProfileDrawer';
import { logout } from '../../../../../api/auth';
import Lessthen from '../../../../../assets/icons/lessthen.svg';
import CloseIcon from '../../../../../assets/icons/close.svg';
import useTripStatus from '../../../../../components/map/MapComponent';

type Props = {
  pickup: {
    latitude: number;
    longitude: number;
    name?: string;
    status?: 'red' | 'green';
  };
  dropoff: { latitude: number; longitude: number; name?: string };
  previous?: { latitude: number; longitude: number; name?: string };
  driver?: { latitude: number; longitude: number; name?: string };
  distance?: string;
  duration?: string;
};

const getMapsApiKey = () => {
  return (Config as any)?.GOOGLE_MAPS_API_KEY || '';
};
const uberLightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#FAFAFA' }] },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#F7F8FA' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#FAFAFA' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#F9FAFB' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#FAFAFA' }],
  },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#F7F7F7' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#EEEEEE' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#BDBDBD' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#B8B8B8' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
];

export default function MapFather({
  pickup,
  dropoff,
  previous,
  driver,
  distance: _distance,
  duration: _duration,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PageFather'>>();
  const onPress = () => navigation.navigate('PageFather');
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const initialRegion: Region = {
    latitude: (pickup.latitude + dropoff.latitude) / 2,
    longitude: (pickup.longitude + dropoff.longitude) / 2,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  useEffect(() => {
    setTimeout(() => {
      const pts = [pickup, dropoff];
      if (previous) pts.push(previous);
      if (driver) pts.push(driver);
      if (userLocation) pts.push(userLocation);
      mapRef.current?.fitToCoordinates(pts, {
        edgePadding: { top: 180, left: 80, bottom: 280, right: 80 },
        animated: true,
      });
    }, 500);
  }, [pickup, dropoff, previous, driver, userLocation]);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (res !== PermissionsAndroid.RESULTS.GRANTED) return;
      } else {
        Geolocation.requestAuthorization();
      }
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
      );
    };
    init();
  }, []);

  const apiKey = getMapsApiKey();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onPress}>
        <CloseIcon width={24} height={24} fill={'#fbfbfbff'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setProfileOpen(true)}
      >
        <Lessthen width={24} height={24} fill={'#98989B'} />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        customMapStyle={uberLightMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {previous ? (
          <Marker coordinate={previous} anchor={{ x: 0.5, y: 1 }}>
            <MarkerOrigin
              width={32}
              height={32}
              fill={pickup?.status === 'green' ? '#10B981' : '#EF4444'}
            />
          </Marker>
        ) : null}

        {/* Marcador de Destino - Pin rojo clásico */}
        <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 1 }}>
          <MarkerDestination width={40} height={40} fill="#2641dcff" />
        </Marker>

        {apiKey ? (
          <MapViewDirections
            resetOnChange={false} // opcional, pero recomendado
            mode="DRIVING"
            origin={userLocation  || pickup}
            destination={dropoff}
            waypoints={(previous ? [previous] : []).concat([pickup])}
            apikey={apiKey}
            strokeWidth={5}
            strokeColor="#707070"
            precision="high"
            onReady={result => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 180, left: 80, bottom: 280, right: 80 },
                animated: true,
              });
            }}
          />
        ) : null}
      </MapView>
      {profileOpen && (
        <ProfileDrawer
          visible={profileOpen}
          onClose={() => setProfileOpen(false)}
          onLogout={async () => {
            try {
              await logout();
            } catch {}
            navigation.reset({ index: 0, routes: [{ name: 'InitialLogins' }] });
          }}
          userName="Larry Davis"
          vehiclePlate="SDF-5221"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pickupCircle: {},
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    zIndex: 100,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: { color: '#98989B', fontSize: 18, fontWeight: '600' },
  profileButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 8,
    elevation: 6,
  },
  profileButtonText: {
    color: '#98989B',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
  },
});
