import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapFather from './map/MapFather';
import ButtonContext from './map/ButtonContent';
import routesData from '../../../../components/FooterRoutes/routesData'; // Ajusta la ruta según tu proyecto

import MarkerOrigin from '../../../../assets/marker-origin.svg';
import VehicleSvg from '../../../../assets/vehicle.svg';

const CarIcon = () => <VehicleSvg width={90} height={90} />;

import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type RootParams = {
  DashboardFather: { studentName?: string; avatarUri?: string };
};

export default function CurrentTripDashboard() {
  const routeParam = useRoute<RouteProp<RootParams, 'DashboardFather'>>();
  const studentName = routeParam?.params?.studentName;
  const avatarUri = routeParam?.params?.avatarUri;
  const navigation = useNavigation<any>();

  // Tomamos la primera ruta como ejemplo (puedes pasarla por props o usar estado global)
  const route =
    (studentName
      ? routesData.find(r =>
          (r.stops || []).some(s => s.student === studentName),
        )
      : undefined) || routesData[0];

  // Solo usamos el primer y último punto como recogida y destino
  const pickup = (
    studentName
      ? route.stops.find(s => s.student === studentName)
      : route.stops[0]
  ) as any;
  const dropoff =
    (route.stops.find(s =>
      String(s.name || '')
        .toLowerCase()
        .includes('colegio nsr'),
    ) as any) || route.stops[route.stops.length - 1];

  // Simulamos distancia y tiempo (puedes calcularlo con MapViewDirections si quieres)
  const distance = '0.2 km';
  const duration = '2 min';

  return (
    <View style={styles.container}>
      <MapFather pickup={pickup} dropoff={dropoff} />

      <View style={styles.bottomPanel}>
        <View style={styles.rowCenter}>
          
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarSmall} />
          ) : null}
          <Text style={styles.pickupTitle}>
            {pickup?.student || 'Nombre del estudiante'}
          </Text>

          <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatSupport')}>
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.destinationRow}>
          <MarkerOrigin
            width={20}
            height={20}
            color="#10B981"
            style={styles.inlineIcon}
          />
          <Text style={styles.pickupAddress}>
            {pickup.name || 'recogida en curso'}
          </Text>
        </View>

        <View style={styles.destinationRow}>
          <MarkerOrigin
            width={20}
            height={20}
            color="#2563EB"
            style={styles.inlineIcon}
          />
          <Text style={styles.destinationText}>
            {dropoff.name || 'Colegio NSR'}
          </Text>
        </View>

        {/* Info de distancia y tiempo */}
        <View style={styles.infoRow}>
          <CarIcon />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>DISTANCIA</Text>
            <Text style={styles.infoValue}>{distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>TIEMPO</Text>
            <Text style={styles.infoValue}>{duration}</Text>
          </View>
        </View>

        <ButtonContext onPress={() => console.log('Ruta cancelada')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  bottomPanel: {
    position: 'absolute',
    marginHorizontal: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarSmall: {
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  pickupTitle: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  pickupAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  destinationText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  rowCenter: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inlineIcon: { marginRight: 10 },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  chatButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  infoValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
});
