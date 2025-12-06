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
import DetailRoutes from '../../components/FooterRoutes/DetailRoutes';
import type { RouteData } from '../../components/FooterRoutes/routesData';
import api, { getAuthToken, getCompanyId } from '../../api/base';
import Config from 'react-native-config';
import VehicleListModal from './driver/components/VehicleListModal';
import routesFallback from '../../components/FooterRoutes/routesData';

 

// Render prop para el menú inferior (memoizado)
type BottomArgs = { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void; onModeChange: (isDetails: boolean) => void };

function PageDriver() {
  const insets = useSafeAreaInsets();
  const [isDetails, setIsDetails] = React.useState(false);
  const [selectedRoute, setSelectedRoute] = React.useState<RouteData | null>(null);
  const [initialRegion, setInitialRegion] = React.useState<Region | undefined>(undefined);
  const [devices, setDevices] = React.useState<Array<{ id?: string | number; device_id?: string | number; name?: string; icon_color?: string; icon_colors?: string; device_data?: { icon_color?: string } }>>([]);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState<string>('');
  const [selectedVehicleColor, setSelectedVehicleColor] = React.useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | number | undefined>(undefined);
  const [selectedDriverCoord, setSelectedDriverCoord] = React.useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [vehiclesOpen, setVehiclesOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loadingDevices, setLoadingDevices] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [routesApi, setRoutesApi] = React.useState<RouteData[]>([]);
  const pageRef = React.useRef(page);
  const loadingRef = React.useRef(loadingDevices);
  React.useEffect(() => { pageRef.current = page; }, [page]);
  React.useEffect(() => { loadingRef.current = loadingDevices; }, [loadingDevices]);

  React.useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setInitialRegion({ latitude: -34.6037, longitude: -58.3816, latitudeDelta: 0.02, longitudeDelta: 0.02 });
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
        _err => { console.log('PageDriver initialRegion error', _err); setInitialRegion({ latitude: -34.6037, longitude: -58.3816, latitudeDelta: 0.02, longitudeDelta: 0.02 }); },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    };
    init();
  }, []);

  React.useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await api.get('/travels/v1/routes');
        const payload = res.data;
        console.log('PageDriver routes raw payload type', typeof payload);
        const rawList = Array.isArray(payload) ? payload : (payload?.data || payload?.routes || []);
        const cid = getCompanyId();
        console.log('PageDriver routes companyId used', cid);
        const filteredRaw = (cid != null) ? (Array.isArray(rawList) ? rawList.filter((r: any) => Number(r?.company_id) === Number(cid)) : []) : (Array.isArray(rawList) ? rawList : []);
        const effectiveRaw = Array.isArray(filteredRaw) && filteredRaw.length > 0 ? filteredRaw : (Array.isArray(rawList) ? rawList : []);

        const deg2rad = (deg: number) => deg * (Math.PI / 180);
        const haversineKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number => {
          const R = 6371;
          const dLat = deg2rad(b.latitude - a.latitude);
          const dLon = deg2rad(b.longitude - a.longitude);
          const s1 = Math.sin(dLat / 2);
          const s2 = Math.sin(dLon / 2);
          const c = 2 * Math.asin(Math.sqrt(s1 * s1 + Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) * s2 * s2));
          return R * c;
        };

        const mapped: RouteData[] = (Array.isArray(effectiveRaw) ? effectiveRaw : []).map((r: any) => {
          const secs = Number(r?.estimated_travel_time_seconds ?? r?.estimated_driving_time_seconds ?? 0);
          const mins = Math.max(1, Math.round(secs / 60));
          const stops = Array.isArray(r?.stops) ? r.stops.map((s: any) => ({ latitude: Number(s?.latitude), longitude: Number(s?.longitude), address: String(s?.address || '') })) : [];
          let distanceKm = 0;
          for (let i = 1; i < stops.length; i++) {
            const a = stops[i - 1];
            const b = stops[i];
            if (typeof a?.latitude === 'number' && typeof a?.longitude === 'number' && typeof b?.latitude === 'number' && typeof b?.longitude === 'number') {
              distanceKm += haversineKm(a, b);
            }
          }
          const item: RouteData = {
            id: Number(r?.id),
            name: String(r?.name ?? r?.Name ?? ''),
            vehicle: String(r?.vehicle?.plate ?? r?.vehicle_plate ?? r?.plate ?? r?.vehicle_name ?? ''),
            time: `${mins} min`,
            type: (() => {
              const raw = String(r?.type ?? r?.route_type ?? r?.Direction ?? r?.direction ?? '').toLowerCase();
              return raw.includes('sal') ? 'Salida' : 'Entrada';
            })(),
            stops,
            distanceKm: distanceKm > 0 ? distanceKm : undefined,
          } as RouteData;
          console.log('PageDriver route item', { id: item.id, name: item.name, time: item.time, stops: item.stops?.length || 0 });
          return item;
        });
        const finalList = mapped.length > 0 ? mapped : (routesFallback as RouteData[]);
        setRoutesApi(finalList);
        console.log('PageDriver routes final mapped count', finalList.length);
      } catch (e) {
        console.log('PageDriver loadRoutes error', e);
        try {
          const fallback = routesFallback as RouteData[];
          setRoutesApi(fallback);
          console.log('PageDriver routes fallback applied', fallback.length);
        } catch {}
      }
    };
    loadRoutes();
  }, []);

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
    if (vehiclesOpen && devices.length === 0 && !loadingDevices) {
      loadDevices(1);
    }
  }, [vehiclesOpen, devices.length, loadingDevices, loadDevices]);

  const BottomContent: React.FC<BottomArgs> = ({ collapsed, toggle, onRouteSelect, onModeChange }: BottomArgs) => (
    <MenuRoutes collapsed={collapsed}>
      {isDetails && selectedRoute ? (
        <DetailRoutes
          route={selectedRoute}
          onRouteSelect={(stops) => {
            console.log('PageDriver DetailRoutes onRouteSelect:', stops?.length || 0);
            onRouteSelect?.(stops);
          }}
          onModeChange={(v: boolean) => {
            console.log('PageDriver DetailRoutes onModeChange:', v);
            setIsDetails(v);
            onModeChange?.(v);
          }}
          onClose={() => {
            setSelectedRoute(null);
          }}
        />
      ) : (
        <RoutesMenu
          routes={routesApi}
          collapsed={collapsed}
          onToggle={toggle}
          onRouteSelect={(stops) => {
            console.log('PageDriver onRouteSelect called with stops:', stops?.length || 0);
            onRouteSelect?.(stops);
          }}
          selectedRoute={selectedRoute}
          onSelectRoute={(route) => {
            console.log('PageDriver onSelectRoute called:', route?.id, route?.name);
            setSelectedRoute(route);
            setIsDetails(true);
            onModeChange?.(true);
          }}
          onModeChange={(v: boolean) => {
            console.log('PageDriver onModeChange:', v);
            setIsDetails(v);
            onModeChange?.(v);
          }}
        />
      )}
    </MenuRoutes>
  );

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
        initialRegion={initialRegion}
        renderTopBar={TopBarWithCard}
        bottomContent={BottomContent}
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
