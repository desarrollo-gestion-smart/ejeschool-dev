// screens/EjeSchoolScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  BackHandler,
  Modal,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';

import MapComponent from '../../../components/map/MapComponent';
import TopBar from '../../../components/map/layout/TopBar';
import MenuRoutes from '../../../components/map/layout/MenuRoutes';
import RoutesMenu from '../../../components/FooterRoutes/RenderRoutes';
import DetailRoutes from '../../../components/FooterRoutes/DetailRoutes';
import { routes, RouteData } from '../../../components/FooterRoutes/routesData';
import api, { getAuthToken } from '../../../api/base';
import { logout } from '../../../api/auth';
import VehicleListModal from './components/VehicleListModal';
import { useNavigation } from '@react-navigation/native';

// Ruta del session.json (la misma que usas en auth.ts)
const SESSION_PATH = `${FileSystem.documentDirectory}session.json`;

type BottomArgs = {
  collapsed: boolean;
  toggle: () => void;
  onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void;
  onModeChange: (isDetails: boolean) => void;
};

function PageDriver() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isDetails, setIsDetails] = React.useState(false);
  const [selectedRoute, setSelectedRoute] = React.useState<RouteData | null>(null);

  // ESTADO DEL USUARIO (nombre + avatar)
  const [driverName, setDriverName] = React.useState<string>('Cargando...');
  const [driverAvatar, setDriverAvatar] = React.useState<string>('https://i.pravatar.cc/100?img=13');

  const fallback = React.useMemo<Region>(
    () => ({
      latitude: -34.6037,
      longitude: -58.3816,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    []
  );
  const [initialRegion, setInitialRegion] = React.useState<Region>(fallback);

  const [devices, setDevices] = React.useState<any[]>([]);
  const [selectedVehicleName, setSelectedVehicleName] = React.useState<string>('');
  const [selectedVehicleColor, setSelectedVehicleColor] = React.useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | number | undefined>();
  const [selectedDriverCoord, setSelectedDriverCoord] = React.useState<{ latitude: number; longitude: number } | undefined>();
  const [routesApi, setRoutesApi] = React.useState<RouteData[]>(routes);
  const [companyId, setCompanyId] = React.useState<number | undefined>(undefined);

  const [vehiclesOpen, setVehiclesOpen] = React.useState(false);
  const [exitOpen, setExitOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loadingDevices, setLoadingDevices] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const pageRef = React.useRef(page);
  const loadingRef = React.useRef(loadingDevices);
  React.useEffect(() => { pageRef.current = page; }, [page]);
  React.useEffect(() => { loadingRef.current = loadingDevices; }, [loadingDevices]);

  // CARGAR PERFIL DESDE session.json (el que guardas al hacer login)
  React.useEffect(() => {
    const loadUserFromSession = async () => {
      try {
        const info = await FileSystem.getInfoAsync(SESSION_PATH);
        if (!info.exists) {
          setDriverName('Sin sesión');
          return;
        }

        const raw = await FileSystem.readAsStringAsync(SESSION_PATH);
        const session = JSON.parse(raw || '{}');
        const user = session?.user || session;

        // Extraer nombre
        const fullName = user?.full_name || '';
        const firstName = user?.first_name || user?.nombre || '';
        const lastName = user?.last_name || user?.apellido || '';
        const name = fullName || `${firstName} ${lastName}`.trim() || 'Conductor';

        // Extraer avatar
        const avatar = user?.avatar || user?.photo || user?.image || '';

        setDriverName(name);
        if (avatar) setDriverAvatar(avatar);
        const cid = user?.company_id ?? user?.companyId ?? user?.company;
        if (cid != null) setCompanyId(Number(cid));
        
      } catch (err) {
        console.log('Error leyendo session.json:', err);
        setDriverName('Error de sesión');
      }
    };

    loadUserFromSession();
  }, []);

  React.useEffect(() => {
    const loadRoutes = async () => {
      try {
        const token = getAuthToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await api.get('/travels/v1/routes', { headers });
        const payload = res.data;
        const rawList = Array.isArray(payload) ? payload : (payload?.data || payload?.routes || []);
        const cid = companyId;
        const filteredRaw = (cid != null) ? (Array.isArray(rawList) ? rawList.filter((r: any) => Number(r?.company_id) === Number(cid)) : []) : (Array.isArray(rawList) ? rawList : []);
        const effectiveRaw = Array.isArray(filteredRaw) && filteredRaw.length > 0 ? filteredRaw : (Array.isArray(rawList) ? rawList : []);
        const mapped: RouteData[] = (Array.isArray(effectiveRaw) ? effectiveRaw : []).map((r: any) => {
          const secs = Number(r?.estimated_travel_time_seconds ?? r?.estimated_driving_time_seconds ?? 0);
          const mins = Math.max(1, Math.round(secs / 60));
          const stops = Array.isArray(r?.stops)
            ? r.stops.map((s: any) => ({ latitude: Number(s?.latitude), longitude: Number(s?.longitude), address: String(s?.address || '') }))
            : [];
          return {
            id: Number(r?.id),
            name: String(r?.name ?? r?.Name ?? ''),
            vehicle: String(r?.vehicle?.plate ?? r?.vehicle_plate ?? r?.plate ?? r?.vehicle_name ?? ''),
            time: `${mins} min`,
            type: 'Entrada',
            stops,
            companyId: r?.company_id != null ? Number(r?.company_id) : undefined,
          } as RouteData;
        });
        setRoutesApi(mapped.length > 0 ? mapped : routes);
      } catch {
        setRoutesApi(routes);
      }
    };
    loadRoutes();
  }, []);

  // Geolocalización
  React.useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      } else {
        Geolocation.requestAuthorization();
      }

      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setInitialRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    };
    init();
  }, [fallback]);

  // Back button
  React.useEffect(() => {
    const onBack = () => {
      setExitOpen(true);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, []);

  // Carga de dispositivos
  const loadDevices = React.useCallback(async (p?: number) => {
    if (loadingRef.current) return;
    try {
      setLoadingDevices(true);
      loadingRef.current = true;
      const pageToLoad = typeof p === 'number' ? p : pageRef.current;
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await api.get('/devices/v1/devices', { headers, params: { page: pageToLoad } });
      const list = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.devices || [];
      const arr = Array.isArray(list) ? list : [];

      setDevices(prev => (pageToLoad === 1 ? arr : [...prev, ...arr]));
      setHasMore(arr.length > 0);
      setPage(pageToLoad);

      if (pageToLoad === 1 && arr[0]?.name) {
        setSelectedVehicleName(String(arr[0].name));
        setSelectedVehicleColor(String(arr[0].icon_colors || arr[0].icon_color || arr[0]?.device_data?.icon_color || '#000'));
        setSelectedVehicleId(arr[0]?.device_id ?? arr[0]?.id);
      }
    } catch (e) {
      console.log('Error dispositivos:', e);
    } finally {
      setLoadingDevices(false);
      loadingRef.current = false;
    }
  }, []);

  React.useEffect(() => { loadDevices(1); }, [loadDevices]);
  React.useEffect(() => {
    if (vehiclesOpen && devices.length === 0 && !loadingDevices) loadDevices(1);
  }, [vehiclesOpen, devices.length, loadingDevices, loadDevices]);

  const BottomContent: React.FC<BottomArgs> = ({ collapsed, toggle, onRouteSelect, onModeChange }: BottomArgs) => (
    <MenuRoutes>
      {isDetails && selectedRoute ? (
        <DetailRoutes
          route={selectedRoute}
          onRouteSelect={(stops) => {
            onRouteSelect?.(stops);
          }}
          onModeChange={(v: boolean) => {
            setIsDetails(v);
            onModeChange?.(v);
          }}
          onClose={() => {
            setSelectedRoute(null);
          }}
        />
      ) : (
        <RoutesMenu
          key={`routes-${companyId ?? 'none'}`}
          routes={routesApi}
          collapsed={collapsed}
          onToggle={toggle}
          onRouteSelect={onRouteSelect}
          selectedRoute={selectedRoute}
          onSelectRoute={(route) => {
            setSelectedRoute(route);
            setIsDetails(true);
            onModeChange?.(true);
          }}
          onModeChange={(v: boolean) => {
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
        <View style={[styles.overlayCard, { top: insets.top + 90 }]}>
          <View style={styles.avatarCircle}>
            <Image source={{ uri: driverAvatar }} style={styles.avatarImg} />
          </View>

          <Text style={styles.nameText}>{driverName}</Text>
          <Text style={styles.subText}>Colegio NSR</Text>

          <TouchableOpacity style={styles.buttontop}>
            <Text style={styles.smallButtonText}>Seleccionar Colegio</Text>
          </TouchableOpacity>

          <View style={styles.plateBox}>
            <Text style={styles.plateText}>{selectedVehicleName || 'NZF-056'}</Text>
          </View>

          <TouchableOpacity style={styles.smallButton} onPress={() => setVehiclesOpen(true)}>
            <Text style={styles.smallButtonText}>Seleccionar Vehículo</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : null
  ), [isDetails, insets.top, selectedVehicleName, driverName, driverAvatar]);

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

      <Modal transparent visible={exitOpen} animationType="fade" onRequestClose={() => setExitOpen(false)}>
        <View style={styles.exitOverlay}>
          <View style={styles.exitCard}>
            <TouchableOpacity style={styles.exitClose} onPress={() => setExitOpen(false)}>
              <Text style={styles.exitCloseText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.exitTitle}>¿Qué deseas hacer?</Text>
            <TouchableOpacity style={styles.exitPrimary} onPress={async () => { await logout(); setExitOpen(false); navigation.reset({ index: 0, routes: [{ name: 'InitialLogins' }] }); }}>
              <Text style={styles.exitPrimaryText}>Cerrar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitSecondary} onPress={() => BackHandler.exitApp()}>
              <Text style={styles.exitSecondaryText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <VehicleListModal
        visible={vehiclesOpen}
        devices={devices}
        onClose={() => setVehiclesOpen(false)}
        onSelect={(item) => {
          setSelectedVehicleName(String(item?.name || ''));
          setSelectedVehicleColor(String(item?.icon_colors || item?.icon_color || item?.device_data?.icon_color || '#000'));
          setSelectedVehicleId(item?.device_id ?? item?.id);
          setSelectedDriverCoord(undefined);
          setVehiclesOpen(false);
        }}
        loading={loadingDevices}
        hasMore={hasMore}
        onLoadMore={() => hasMore && !loadingDevices && loadDevices(pageRef.current + 1)}
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
  subText: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 2 },
  smallButton: {
    alignSelf: 'center',
    backgroundColor: '#5E00BC',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  buttontop: {
    alignSelf: 'center',
    backgroundColor: '#4252FF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  plateBox: { marginTop: 8 },
  plateText: { fontSize: 22, fontWeight: '800', color: '#1F1F1F', letterSpacing: 1 },
  exitOverlay: { flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' },
  exitCard: { width: '86%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  exitClose: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  exitCloseText: { fontSize: 22, color: '#888' },
  exitTitle: { fontSize: 18, fontWeight: '700', color: '#1F1F1F', marginBottom: 16, paddingTop: 8 },
  exitPrimary: { backgroundColor: '#5d01bc', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  exitPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  exitSecondary: { backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  exitSecondaryText: { color: '#111827', fontSize: 16, fontWeight: '700' },
});
