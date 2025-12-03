// src/components/map/SimpleRouteMap.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../types/Navigation';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';


//mapas
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';


//iconos
import MarkerDestination from '../../../../../assets/markers/marker-destination.svg'; // Asegúrate de tener este SVG
import MarkerOrigin from '../../../../../assets/markers/marker-origin.svg';
import ProfileDrawer from '../ProfileDrawer';
import { logout } from '../../../../../api/auth';
import Lessthen from '../../../../../assets/icons/lessthen.svg';
import CloseIcon from '../../../../../assets/icons/close.svg';

type Props = {
  pickup: { latitude: number; longitude: number; name?: string };
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

export default function MapFather({ pickup, dropoff, previous, driver, distance: _distance, duration: _duration }: Props) {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'PageFather'>>();
  const onPress = () => navigation.navigate('PageFather');
  const [profileOpen, setProfileOpen] = React.useState(false);

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
      mapRef.current?.fitToCoordinates(pts, {
        edgePadding: { top: 180, left: 80, bottom: 280, right: 80 },
        animated: true,
      });
    }, 500);
  }, [pickup, dropoff, previous, driver]);

  const apiKey = getMapsApiKey();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onPress}>
        <CloseIcon width={24} height={24} fill={'#fbfbfbff'} />
      </TouchableOpacity>
       <TouchableOpacity style={styles.profileButton} onPress={() => setProfileOpen(true)}>
             <Lessthen width={24} height={24} fill={'#98989B'} /> 
              </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        customMapStyle={uberLightMapStyle}
      >
        <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.pickupCircle}>
            <MarkerOrigin width={32} height={32} fill="#10B981" />
          </View>
        </Marker>

        {previous ? (
          <Marker coordinate={previous} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pickupCircle}>
              <MarkerOrigin width={32} height={32} fill="#EF4444" />
            </View>
          </Marker>
        ) : null}

        {driver ? (
          <Marker coordinate={driver} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pickupCircle}>
              <MarkerOrigin width={32} height={32} fill="#5d01bc" />
            </View>
          </Marker>
        ) : null}

        {/* Marcador de Destino - Pin rojo clásico */}  
        <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 1 }}>
          <MarkerDestination width={40} height={40} fill="#2641dcff" />
        </Marker>

        {apiKey ? (
          <MapViewDirections
            origin={driver || pickup}
            destination={dropoff}
            waypoints={(previous ? [previous] : []).concat([pickup])}
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
  profileButtonText: { color: '#98989B', fontSize: 24, fontWeight: '600', lineHeight: 24 },
});
