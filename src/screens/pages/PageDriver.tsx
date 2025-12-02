// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, PermissionsAndroid, ScrollView } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapComponent from '../../components/map/MapComponent';
import TopBar from '../../components/map/layout/TopBar';
import MenuRoutes from '../../components/map/layout/MenuRoutes';
import RoutesMenu from '../../components/FooterRoutes/RenderRoutes';
import { routes } from '../../components/FooterRoutes/routesData';
import api from '../../api/base';

 

// Esto es lo que se muestra en la parte inferior (el menú de rutas)
const renderBottomFactory = (setIsDetails: (v: boolean) => void) =>
  ({ collapsed, toggle, onRouteSelect, onModeChange }: { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void; onModeChange: (isDetails: boolean) => void }) => (
    <MenuRoutes>
      <RoutesMenu
        routes={routes}
        collapsed={collapsed}
        onToggle={toggle}
        onRouteSelect={onRouteSelect}
        onModeChange={(v: boolean) => {
          setIsDetails(v);
          onModeChange?.(v);
        }}
      />
    </MenuRoutes>
  );

function PageDriver() {
  const insets = useSafeAreaInsets();
  const [isDetails, setIsDetails] = React.useState(false);
  const [initialRegion, setInitialRegion] = React.useState<Region | undefined>(undefined);
  const fallback = React.useMemo<Region>(() => ({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }), []);
  const [devices, setDevices] = React.useState<Array<{ id?: string | number; name?: string }>>([]);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState<string>('');
  const [vehiclesOpen, setVehiclesOpen] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setInitialRegion(fallback);
          return;
        }
      } else {
        Geolocation.requestAuthorization();
      }
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setInitialRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        },
        _err => {
          setInitialRegion(fallback);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    init();
  }, [fallback]);

  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get('/devices/v1/devices');
        const data = res?.data;
        const list = Array.isArray(data) ? data : (data?.data || data?.devices || []);
        const arr = Array.isArray(list) ? list : [];
        setDevices(arr as any);
        const first = (arr[0] && (arr[0] as any).name) || '';
        if (first) setSelectedVehicleName(String(first));
      } catch {}
    };
    run();
  }, []);

  const TopBarWithCard = (
    !isDetails ? (
      <>
        <TopBar title="Eje School" />
        <View style={[styles.overlayCard, { top: insets.top + 90 }]}>
          <View style={styles.avatarCircle}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.avatarImg} />
          </View>
          <Text style={styles.nameText}>Gregory Smith</Text>
          <Text style={styles.subText}>Colegio NSR</Text>
          <TouchableOpacity style={styles.buttontop}><Text style={styles.smallButtonText}>Seleccionar Colegio</Text></TouchableOpacity>
          <View style={styles.plateBox}><Text style={styles.plateText}>{selectedVehicleName || 'NZF-056'}</Text></View>
          <TouchableOpacity style={styles.smallButton} onPress={() => setVehiclesOpen(v => !v)}><Text style={styles.smallButtonText}>Seleccionar Vehículo</Text></TouchableOpacity>
          {vehiclesOpen && (
            <View style={styles.dropdown}>
              <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={true}>
                {devices.slice(1).map((d, i) => (
                  <TouchableOpacity
                    key={String(d.id ?? i)}
                    style={styles.dropdownItem}
                    onPress={() => {
                      const n = d?.name ? String(d.name) : '';
                      if (n) setSelectedVehicleName(n);
                      setVehiclesOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{d?.name || ''}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </>
    ) : null
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      {initialRegion ? (
        <MapComponent
          initialRegion={initialRegion}
          renderTopBar={TopBarWithCard}
          bottomContent={renderBottomFactory(setIsDetails)}
        />
      ) : null}
    </View>
  );
}


export default PageDriver;

const styles = StyleSheet.create({
  overlayCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: 8,
  },
  avatarImg: { width: 58, height: 65, borderRadius: 28 },
  nameText: { fontSize: 18, fontWeight: '700', color: '#1F1F1F' },
  subText: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 10 },
  smallButton: {
    alignSelf: 'center',
    backgroundColor: '#5E00BC',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  buttontop:{
    alignSelf: 'center',
    backgroundColor: '#4252FF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  plateBox: {
    marginTop: 8,
  },
  plateText: { fontSize: 22, fontWeight: '800', color: '#1F1F1F', letterSpacing: 1 },
  dropdown: {
    marginTop: 8,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownScroll: { maxHeight: 180 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  dropdownItemText: { fontSize: 16, color: '#222' },
});
