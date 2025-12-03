// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapComponent from '../../components/map/MapComponent';
import TopBar from '../../components/map/layout/TopBar';
import MenuRoutes from '../../components/map/layout/MenuRoutes';
import RoutesMenu from '../../components/FooterRoutes/RenderRoutes';
import { routes } from '../../components/FooterRoutes/routesData';
import api, { getAuthToken } from '../../api/base';
import VehicleListModal from './driver/components/VehicleListModal';

 

// Render prop para el menú inferior (memoizado)
type BottomArgs = { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void; onModeChange: (isDetails: boolean) => void };

function PageDriver() {
  const insets = useSafeAreaInsets();
  const [isDetails, setIsDetails] = React.useState(false);
  const fallback = React.useMemo<Region>(() => ({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }), []);
  const [initialRegion, setInitialRegion] = React.useState<Region>(fallback);
  const [devices, setDevices] = React.useState<Array<{ id?: string | number; device_id?: string | number; name?: string; icon_color?: string; icon_colors?: string; device_data?: { icon_color?: string } }>>([]);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState<string>('');
  const [selectedVehicleColor, setSelectedVehicleColor] = React.useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | number | undefined>(undefined);
  const [selectedDriverCoord, setSelectedDriverCoord] = React.useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [vehiclesOpen, setVehiclesOpen] = React.useState(false);
  const [mapKey, setMapKey] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [loadingDevices, setLoadingDevices] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const pageRef = React.useRef(page);
  const loadingRef = React.useRef(loadingDevices);
  React.useEffect(() => { pageRef.current = page; }, [page]);
  React.useEffect(() => { loadingRef.current = loadingDevices; }, [loadingDevices]);

  React.useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      } else {
        Geolocation.requestAuthorization();
      }
      Geolocation.getCurrentPosition(
        pos => {
          console.log('PageDriver initialRegion', pos?.coords);
          const { latitude, longitude } = pos.coords;
          setInitialRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        },
        _err => { console.log('PageDriver initialRegion error', _err); },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    };
    init();
  }, [fallback]);

  const loadDevices = React.useCallback(async (p?: number) => {
    try {
      if (loadingRef.current) return;
      setLoadingDevices(true); loadingRef.current = true;
      const pageToLoad = typeof p === 'number' ? p : pageRef.current;
      const token = getAuthToken();
      const masked = token ? `${String(token).slice(0, 6)}...${String(token).slice(-4)}` : null;
      const url = '/devices/v1/devices';
      const baseURL = (api.defaults as any)?.baseURL;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      console.log('PageDriver devices GET', { baseURL, url, params: { page: pageToLoad }, headers: headers ? { Authorization: `Bearer ${masked}` } : null });
      const res = await api.get(url, { headers, params: { page: pageToLoad } } as any);
      console.log('PageDriver devices response', { status: res.status, hasArray: Array.isArray(res?.data), keys: Object.keys(res?.data || {}) });
      const data = res?.data;
      const list = Array.isArray(data) ? data : (data?.data || data?.devices || []);
      const arr = Array.isArray(list) ? list : [];
      console.log('PageDriver devices parsed', { count: arr.length, first: arr[0]?.name, page: pageToLoad });
      setDevices(prev => (pageToLoad === 1 ? (arr as any) : ([...prev, ...arr] as any)));
      setHasMore(arr.length > 0);
      setPage(pageToLoad); pageRef.current = pageToLoad;
      const first = arr[0] as any;
      if (pageToLoad === 1 && first?.name) {
        setSelectedVehicleName(String(first.name));
        setSelectedVehicleColor(String(first.icon_colors || first.icon_color || first?.device_data?.icon_color || '#000'));
        setSelectedVehicleId(first?.device_id ?? first?.id);
      }
    } catch (e: any) {
      console.log('PageDriver devices error', e?.response?.status, e?.response?.data || e?.message || e);
      try {
        const token = getAuthToken();
        const urlFull = `${(api.defaults as any)?.baseURL || ''}/devices/v1/devices?page=${typeof p === 'number' ? p : pageRef.current}`;
        const res2 = await fetch(urlFull, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const text = await res2.text();
        console.log('PageDriver devices fetch fallback', { status: res2.status, ok: res2.ok, body: text.slice(0, 200) });
      } catch (e2: any) {
        console.log('PageDriver devices fetch fallback error', e2?.message || e2);
      }
    } finally {
      setLoadingDevices(false); loadingRef.current = false;
    }
  }, []);

  React.useEffect(() => {
    loadDevices(1);
  }, [loadDevices]);

  React.useEffect(() => {
    setMapKey(k => k + 1);
  }, [isDetails]);

  React.useEffect(() => {
    if (vehiclesOpen && devices.length === 0 && !loadingDevices) {
      loadDevices(1);
    }
  }, [vehiclesOpen, devices.length, loadingDevices, loadDevices]);

  const bottomContent = React.useCallback(({ collapsed, toggle, onRouteSelect, onModeChange }: BottomArgs) => (
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
  ), [setIsDetails]);

  const TopBarWithCard = React.useMemo(() => (
    !isDetails ? (
      <>
        <TopBar title="Eje School" />
        <View style={[styles.overlayCard, { top: insets.top + 90 }] }>
          <View style={styles.avatarCircle}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.avatarImg} />
          </View>
          <Text style={styles.nameText}>Gregory Smith</Text>
          <Text style={styles.subText}>Colegio NSR</Text>
          <TouchableOpacity style={styles.buttontop}><Text style={styles.smallButtonText}>Seleccionar Colegio</Text></TouchableOpacity>
          <View style={styles.plateBox}><Text style={styles.plateText}>{selectedVehicleName || 'NZF-056'}</Text></View>
          <TouchableOpacity style={styles.smallButton} onPress={() => setVehiclesOpen(v => !v)}><Text style={styles.smallButtonText}>Seleccionar Vehículo</Text></TouchableOpacity>
        </View>
      </>
    ) : null
  ), [isDetails, insets.top, selectedVehicleName]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapComponent
        key={mapKey}
        initialRegion={initialRegion}
        renderTopBar={TopBarWithCard}
        bottomContent={bottomContent}
        driver={selectedDriverCoord}
        driverIconColor={selectedVehicleColor}
        driverDeviceId={selectedVehicleId}
      />
      <VehicleListModal
        visible={vehiclesOpen}
        devices={devices}
        onClose={() => setVehiclesOpen(false)}
        onSelect={(item) => {
          setSelectedVehicleName(String(item?.name || ''));
          setSelectedVehicleColor(String((item as any)?.icon_colors || (item as any)?.icon_color || (item as any)?.device_data?.icon_color || '#000'));
          setSelectedVehicleId((item as any)?.device_id ?? item?.id);
          setSelectedDriverCoord(undefined);
          setMapKey(k => k + 1);
          setVehiclesOpen(false);
        }}
        loading={loadingDevices}
        hasMore={hasMore}
        onLoadMore={() => (hasMore && !loadingDevices ? loadDevices(pageRef.current + 1) : undefined)}
      />
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
  dropdownOutside: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listModalBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' },
  listModalContent: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownScroll: { maxHeight: 180 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  dropdownItemText: { fontSize: 16, color: '#222' },
});
