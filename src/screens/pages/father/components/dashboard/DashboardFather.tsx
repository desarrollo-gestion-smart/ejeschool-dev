import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapFather from '../map/MapFather';
import ButtonContext from '../map/ButtonContent';
import routesData from '../../../../../components/FooterRoutes/routesData'; // Ajusta la ruta según tu proyecto

import MarkerOrigin from '../../../../../assets/markers/marker-origin.svg';
import VehicleSvg from '../../../../../assets/vehicle.svg';

const CarIcon = () => <VehicleSvg width={60} height={90} />;

import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import { fetchDriverProfile, fetchStudentProfile } from '../../../../../api/driver';

type RootParams = {
  DashboardFather: { studentName?: string; avatarUri?: string };
};

type Variant = 'parent' | 'driver';

export default function CurrentTripDashboard({ variant = 'parent' }: { variant?: Variant } = {}) {
  const routeParam = useRoute<RouteProp<RootParams, 'DashboardFather'>>();
  const studentName = routeParam?.params?.studentName;
  const avatarUri = routeParam?.params?.avatarUri;
  const navigation = useNavigation<any>();
  const [driverName, setDriverName] = React.useState('');
  const [driverPhoto, setDriverPhoto] = React.useState<string | undefined>(undefined);
  const [parentPhone, setParentPhone] = React.useState('');
  const [pickupStreet, setPickupStreet] = React.useState('');
  const [aboard, setAboard] = React.useState(false);

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

  const pickupIdx = route.stops.findIndex(s => s.student === (pickup?.student as string));
  const previous = pickupIdx > 0 ? (route.stops[pickupIdx - 1] as any) : undefined;
  const driverPos = previous
    ? { latitude: previous.latitude + 0.00012, longitude: previous.longitude + 0.00012 }
    : { latitude: pickup.latitude + 0.00012, longitude: pickup.longitude + 0.00012 };

  // Simulamos distancia y tiempo (puedes calcularlo con MapViewDirections si quieres)
  const distance = '0.2 km';
  const duration = '2 min';
  const getMapsApiKey = (): string => {
    return (Config as any)?.GOOGLE_MAPS_API_KEY || (Config as any)?.Maps_API_KEY || '';
  };
  const getStreetName = React.useCallback(async (lat: number, lng: number): Promise<string> => {
    const key = getMapsApiKey();
    if (!key) return '';
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`);
      const data = await resp.json();
      if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
        const comps = Array.isArray(data.results[0].address_components) ? data.results[0].address_components : [];
        const routeName = String((comps.find((c: any) => (c.types || []).includes('route'))?.long_name) || '').trim();
        const number = String((comps.find((c: any) => (c.types || []).includes('street_number'))?.long_name) || '').trim();
        return `${routeName}${routeName && number ? ' ' : ''}${number}`.trim();
      }
      return '';
    } catch {
      return '';
    }
  }, []);

  React.useEffect(() => {
    const run = async () => {
      if (variant === 'driver') {
        try {
          const driver = await fetchDriverProfile();
          setDriverName(driver.nombre);
          setDriverPhoto(avatarUri);
        } catch {}
        try {
          const student = await fetchStudentProfile();
          setParentPhone(student.telefono);
        } catch {}
        try {
          if (pickup?.latitude && pickup?.longitude) {
            const street = await getStreetName(pickup.latitude, pickup.longitude);
            setPickupStreet(street || String(pickup?.Directions || '').trim());
          }
        } catch {}
      }
    };
    run();
  }, [avatarUri, pickup, getStreetName, variant]);
  

  return (
    <View style={styles.container}>
      <MapFather pickup={pickup} dropoff={dropoff} previous={previous} driver={driverPos} />

      <View style={styles.bottomPanel}>
       
        <View style={styles.rowCenter}>
          {variant === 'driver' ? (
            driverPhoto ? <Image source={{ uri: driverPhoto }} style={styles.avatarSmall} /> : null
          ) : (
            avatarUri ? <Image source={{ uri: avatarUri }} style={styles.avatarSmall} /> : null
          )}
          <Text style={styles.pickupTitle}>
            {variant === 'driver' ? (driverName || 'Conductor') : (pickup?.student || 'Nombre del estudiante')}
          </Text>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate('ChatSupport', {
                userRole: variant === 'driver' ? 'conductor' : 'padre',
                recipientName:
                  variant === 'driver'
                    ? `Padre de ${pickup?.student || 'estudiante'}`
                    : (driverName || 'Conductor'),
                recipientAvatar:
                  variant === 'driver'
                    ? undefined
                    : (driverPhoto || undefined),
              })
            }
          >
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {variant === 'driver' ? (
          <View style={styles.destinationRow}>
            <MarkerOrigin
              width={20}
              height={20}
              color="#10B981"
              style={styles.inlineIcon}
            />
            <Text style={styles.pickupAddress}>
              {pickupStreet || 'Calle de la parada'}
            </Text>
          </View>
        ) : (
          <View style={styles.destinationRow}>
            <MarkerOrigin
              width={20}
              height={20}
              color="#10B981"
              style={styles.inlineIcon}
            />
            <Text style={styles.pickupAddress}>
              {pickup?.Directions || 'recogida en curso'}
            </Text>
          </View>
        )}

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

        {variant === 'driver' ? (
          <View style={styles.destinationRow}>
            <MarkerOrigin
              width={20}
              height={20}
              color="#10B981"
              style={styles.inlineIcon}
            />
            <Text style={styles.destinationText}>{parentPhone || '+54 11 0000-0000'}</Text>
          </View>
        ) : null}

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

        {variant === 'driver' ? (
          <ButtonContext
            status={aboard ? 'boarded' : 'not_boarded'}
            onPress={() => {
              setAboard(v => {
                const next = !v;
                try {
                  const idx = (route?.stops || []).findIndex(
                    s => s.latitude === pickup?.latitude && s.longitude === pickup?.longitude,
                  );
                  if (idx >= 0) {
                    (route.stops[idx] as any).status = next ? 'green' : 'red';
                  }
                } catch {}
                return next;
              });
            }}
          />
        ) : (
          <ButtonContext onPress={() => console.log('Ruta cancelada')} />
        )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  bottomPanel: {
    position: 'absolute',
    marginHorizontal: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
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
    width: 50,
    height: 50,
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
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  destinationText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  rowCenter: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginTop: 5,
    marginBottom:17,
    borderRadius: 12,
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
    fontSize: 10,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
});
