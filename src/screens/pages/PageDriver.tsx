// screens/EjeSchoolScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SchoolMap from '../../components/map/MapComponent';

interface RouteData {
  id: number;
  name: string;
  vehicle?: string;
  distance?: string;
  time: string;
  type: 'Entrada' | 'Salida';
}

const activeRoutes: RouteData[] = [
  {
    id: 1,
    name: 'Ruta 5',
    vehicle: 'ADF345',
    time: '09:00 PM',
    type: 'Entrada',
  },
  {
    id: 2,
    name: 'Ruta 27',
    distance: '0.67 km',
    time: '6:00 AM',
    type: 'Salida',
  },
];

const RouteCard: React.FC<RouteData> = ({
  name,
  vehicle,
  distance,
  time,
  type,
}) => (
  <View style={styles.routeCard}>
    <Icon name="bus" size={24} color="#6A0DAD" style={styles.routeIcon} />
    <View style={styles.routeDetails}>
      <Text style={styles.routeName}>{name}</Text>
      {vehicle && <Text style={styles.routeVehicle}>{vehicle}</Text>}
      {distance && <Text style={styles.routeVehicle}>{distance}</Text>}
    </View>
    <View style={styles.routeTimeContainer}>
      <Text style={styles.routeTime}>{time}</Text>
      <Text style={styles.routeType}>{type}</Text>
    </View>
  </View>
);

const EjeSchoolScreen: React.FC = () => {
  const markers = [
    {
      id: 1,
      title: 'Colegio NSR',
      coordinate: { latitude: -34.6037, longitude: -58.3816 },
    },
    {
      id: 2,
      title: 'Parada Ruta 5',
      coordinate: { latitude: -34.61, longitude: -58.39 },
    },
  ];

  return (
    <View style={styles.container}>
       <View style={styles.mapContainer}>
        <View style={styles.mapStyle}>
          <SchoolMap markers={markers} />
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Eje School</Text>
      </View>

      <View style={styles.profileCardWrapper}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.nameText}>Gregory Smith</Text>
          <Text style={styles.schoolText}>Colegio NSR</Text>
          <TouchableOpacity style={styles.selectButtonBlue}>
            <Text style={styles.buttonText}>Seleccionar Colegio</Text>
          </TouchableOpacity>
          <Text style={styles.vehicleCode}>NZF-056</Text>
          <TouchableOpacity style={styles.selectButtonPurple}>
            <Text style={styles.buttonText}>Seleccionar Vehículo</Text>
          </TouchableOpacity>
        </View>
      </View>

     

      <View style={styles.routesSection}>
        <Text style={styles.routesTitle}>Rutas Activas</Text>
        <ScrollView contentContainerStyle={styles.routesList}>
          {activeRoutes.map(route => (
            <RouteCard key={route.id} {...route} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    zIndex:1,
    backgroundColor: '#6A0DAD',
    paddingTop: 100,
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    marginLeft: 10,
  },
  profileCardWrapper: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    paddingHorizontal: 20,
    top: '19%',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImageContainer: {
    position: 'absolute',
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ccc',
    zIndex: 11,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 40 },
  nameText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 5 },
  schoolText: { fontSize: 16, color: '#666', marginBottom: 10 },
  vehicleCode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  selectButtonBlue: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  selectButtonPurple: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  routesSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 5,
  },
  routesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  routesList: { paddingBottom: 20 },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeIcon: { marginRight: 15 },
  routeDetails: { flex: 1 },
  routeName: { fontSize: 16, fontWeight: '600', color: '#333' },
  routeVehicle: { fontSize: 14, color: '#999', marginTop: 2 },
  routeTimeContainer: { alignItems: 'flex-end' },
  routeTime: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  routeType: { fontSize: 14, color: '#666', marginTop: 2 },
  mapContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  mapStyle: {
    flex: 1,
    minHeight: '100%',
  },
});

export default EjeSchoolScreen;
