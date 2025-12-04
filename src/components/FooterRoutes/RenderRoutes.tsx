import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
// Importamos los tipos actualizados de routesData.ts (simulando que Coordinate tiene 'address')
// Nota: 'Coordinate' debe ser exportado desde '../FooterRoutes/routesData'
import { RouteData } from './routesData';
// Definición de Coordinate con 'address' (asumiendo que viene de MapComponent)
export type Coordinate = {
  latitude: number;
  longitude: number;
  status?: 'red' | 'green';
  name?: string;
  address?: string; // <- CLAVE: Permite recibir la dirección
};

import VehicleIcon from '../../assets/icons/car-black.svg';
import MarkerOrigin from '../../assets/markers/marker-origin-own.svg';
import MarkerDestination from '../../assets/markers/marker-destination.svg';
import AvatarBadge from '../AvatarBadge';

type Props = {
  title?: string;
  routes: RouteData[];
  collapsed?: boolean;
  onRouteSelect?: (stops: Coordinate[]) => void;
  onToggle?: () => void;
  onModeChange?: (isDetails: boolean) => void;
};
export default function RoutesMenu({
  title = 'Rutas Activas',
  routes,
  collapsed: _collapsed,
  onToggle,
  onRouteSelect,
  onModeChange,
}: Props) {
  const [selected, setSelected] = React.useState<RouteData | null>(null);
  const [addressMap, setAddressMap] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!selected && _collapsed) onToggle?.();
    onModeChange?.(!!selected);
  }, [_collapsed, selected, onToggle, onModeChange]);

  const parseMinutes = (time: string): number => {
    const m = String(time).match(/(\d+(?:\.\d+)?)\s*min/i);
    return m ? Math.round(Number(m[1])) : 0;
  };

  const getMapsApiKey = (): string => {
    return (Config as any)?.GOOGLE_MAPS_API_KEY || (Config as any)?.Maps_API_KEY || '';
  };

  const getAddressFromCoordinates = React.useCallback(async (latitude: number, longitude: number): Promise<string> => {
    const apiKey = getMapsApiKey();
    if (!apiKey) return '';
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      const data = await resp.json();
      if (data.status === 'OK' && data.results?.length > 0) {
        const comps = Array.isArray(data.results[0].address_components) ? data.results[0].address_components : [];
        const route = String((comps.find((c: any) => (c.types || []).includes('route'))?.long_name) || '').trim();
        const number = String((comps.find((c: any) => (c.types || []).includes('street_number'))?.long_name) || '').trim();
        const out = `${route}${route && number ? ' ' : ''}${number}`.trim();
        return out;
      }
      return '';
    } catch {
      return '';
    }
  }, []);

  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const haversineKm = (a: Coordinate, b: Coordinate): number => {
    const R = 6371;
    const dLat = deg2rad(b.latitude - a.latitude);
    const dLon = deg2rad(b.longitude - a.longitude);
    const s1 = Math.sin(dLat / 2);
    const s2 = Math.sin(dLon / 2);
    const c =
      2 *
      Math.asin(
        Math.sqrt(
          s1 * s1 +
            Math.cos(deg2rad(a.latitude)) *
              Math.cos(deg2rad(b.latitude)) *
              s2 *
              s2,
        ),
      );
    return R * c;
  };

  const computePerLegMinutes = (
    stops: Coordinate[],
    totalMinutes: number,
  ): number[] => {
    if (!stops || stops.length < 2 || totalMinutes <= 0) return [];
    const legs = stops.length - 1;
    const distances = Array.from({ length: legs }, (_, i) =>
      haversineKm(stops[i], stops[i + 1]),
    );
    const totalKm = distances.reduce((sum, d) => sum + d, 0);
    if (totalKm <= 0) return Array(legs).fill(Math.round(totalMinutes / legs));
    return distances.map(d =>
      Math.max(1, Math.round((d / totalKm) * totalMinutes)),
    );
  };

  const renderList = () => (
    <ScrollView style={styles.detailsScroll}
    contentContainerStyle={{ paddingBottom:10 }}
    showsVerticalScrollIndicator={true}>
        {routes.map((r, idx) => (
          <TouchableOpacity
            key={r.id}
            style={styles.item}
            onPress={() => {
              setSelected(r);
              onModeChange?.(true);
              onRouteSelect?.(r.stops || []);
              if (_collapsed) onToggle?.();
            }}
          >
            <View style={styles.itemLeft}>
              <View style={styles.nameRow}>
                <VehicleIcon
                  width={52}
                  height={18}
                  fill="#6D28D9"
                  style={styles.vehicleIcon}
                />
                <Text style={styles.itemName}>{String((r as any).name ?? (r as any).Name ?? '').trim() || `Ruta ${idx + 1}`}</Text>
              </View>
              {r.vehicle && <Text style={styles.itemSub}>{r.vehicle}</Text>}
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTime}>{r.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );

  const orderedStops = React.useMemo(() => {
    if (!selected) return [] as Coordinate[];
    return selected.stops;
  }, [selected]);

  React.useEffect(() => {
    const run = async () => {
      if (!selected || orderedStops.length === 0) return;
      const pairs = await Promise.all(
        orderedStops.map(async (c, idx) => {
          const addr = await getAddressFromCoordinates(c.latitude, c.longitude);
          const fallback = c.address ? String(c.address).split(',')[0].trim() : '';
          return [`${selected.id}-${idx}`, addr || fallback];
        })
      );
      const next: Record<string, string> = {};
      for (const [k, v] of pairs) {
        if (v) next[k as string] = v as string;
      }
      setAddressMap(prev => ({ ...prev, ...next }));
    };
    run();
  }, [selected, orderedStops, getAddressFromCoordinates]);

  const renderDetails = () => {
  if (!selected) return null;
  const totalMin = parseMinutes(selected.time);
  const perLeg = computePerLegMinutes(orderedStops, totalMin);

  let remaining = totalMin;

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      style={styles.detailsScroll}
    >
        {orderedStops.map((c, routeIdx) => {
          const isFirst = routeIdx === 0;
          const isLast = routeIdx === orderedStops.length - 1;
          const stopTitle = isFirst
            ? (selected.students?.[routeIdx] || `Punto ${routeIdx + 1}`)
            : isLast
              ? (c.name || 'Destino')
              : (c.name || `Punto ${routeIdx + 1}`);
          const legMin = routeIdx < perLeg.length ? perLeg[routeIdx] : 0;
          remaining = !isLast ? Math.max(0, remaining - legMin) : remaining;

          const displayName = (selected.students?.[routeIdx] || c.name || stopTitle || '').trim();
          const initials = displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(w => w[0]?.toUpperCase() || '')
            .join('') || '·';
          const avatarColor = isFirst
            ? '#2563EB'
            : isLast
              ? '#2563EB'
              : (c.status === 'green' ? '#10B981' : '#EF4444');

          return (
            <View key={`${selected.id}-${routeIdx}`} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={styles.stopAvatarCol}>
                  <AvatarBadge size={26} backgroundColor={avatarColor} text={initials} textColor="#FFFFFF" />
                </View>
                <View style={styles.stopIconCol}>
                  {!isFirst && <View style={styles.connectorTop} />}
                  {isFirst ? (
                    <MarkerOrigin width={22} height={22} fill="#2563EB" stroke="#fff" strokeWidth={2.5} />
                  ) : isLast ? (
                    <MarkerDestination width={23} height={23} fill="#2563EB" color="#2563EB" />
                  ) : c.status === 'green' ? (
                    <MarkerOrigin width={22} height={22} fill="#10B981" stroke="#fff" strokeWidth={2.5} />
                  ) : (
                    <MarkerOrigin width={22} height={22} fill="#EF4444" stroke="#fff" strokeWidth={2.5} />
                  )}
                  {!isLast && <View style={styles.connectorBottom} />}
                </View>
                <View style={styles.stopTextCol}>
                  <Text style={styles.stopCoord}>
                    {addressMap[`${selected.id}-${routeIdx}`] || c.address || ''}
                  </Text>
                  <Text style={styles.stopTitle}>{stopTitle}</Text>

                </View>
              </View>





            </View>
          );
        })}
        <View style={styles.detailsHeader}>
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={() => {
            onRouteSelect?.([]);
            setSelected(null);
            onModeChange?.(false);
          }}
        >
          <Text style={styles.finalizeButtonText}>Finalizar ruta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

  const headerTitle = selected ? null : title;

  return (
    <View style={styles.container}>
      <View style={[styles.contentFrame, { flex: 1 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{headerTitle}</Text>
      </View>

      {selected ? renderDetails() : renderList()}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  scroll: { 
    flex: 1,

   },
  headerRow: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  list: { flex: 1 },
  detailsScroll: { flex: 1 },
  detailsHeader: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#F0F0F0',
  },
  vehicleIcon: { marginRight: 10 },
  itemLeft: { flex: 1 },
  itemRight: { alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#222' },
  itemSub: { fontSize: 13, color: '#666', marginTop: 2 },
  itemTime: { fontSize: 15, fontWeight: '600', color: '#222' },
  itemType: { fontSize: 13, color: '#888', marginTop: 2 },

  stopRow: {
    flexDirection: 'row',
    borderBottomColor: '#F0F0F0',
  },
  stopLeft: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  stopAvatarCol: { width: 28, alignItems: 'center' },
  stopIconCol: { width: 24, alignItems: 'center', },
  connectorTop: {
    position: 'absolute',
    top: -12,
    height: 12,
    width: 1,
    backgroundColor: '#DCDBDF',
  },
  connectorBottom: {
    position: 'absolute',
    bottom: -12,
    height: 12,
    width: 1,
    backgroundColor: '#DCDBDF',
  },
  stopTextCol: { marginLeft: 12, flex: 1 },
  stopTitle: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4, paddingBottom: 5 },
  stopCoord: { fontSize: 11, color: '#888',  },

  finalizeButton: {
    backgroundColor: '#5d01bc',
    marginTop: 0,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentFrame: {
    alignSelf: 'center',
    width: '100%',
  },
});
