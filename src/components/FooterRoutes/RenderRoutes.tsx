import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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

import VehicleIcon from '../../assets/vehicle.svg';
import MarkerOrigin from '../../assets/markers/marker-origin-own.svg';
import MarkerDestination from '../../assets/markers/marker-destination.svg';

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

  React.useEffect(() => {
    if (!selected && _collapsed) onToggle?.();
    onModeChange?.(!!selected);
  }, [_collapsed, selected, onToggle, onModeChange]);

  const parseMinutes = (time: string): number => {
    const m = String(time).match(/(\d+(?:\.\d+)?)\s*min/i);
    return m ? Math.round(Number(m[1])) : 0;
  };

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
    <ScrollView
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={true}
    >
      <View>
        {routes.map(r => (
          <TouchableOpacity
            key={r.id}
            style={styles.item}
            onPress={() => {
              setSelected(r);
              onModeChange?.(true);
              const base = (r.stops || []).filter(s => !s.status);
              const reds = (r.stops || [])
                .filter(s => s.status === 'red')
                .slice(0, 2);
              const greens = (r.stops || [])
                .filter(s => s.status === 'green')
                .slice(0, 2);
              const ordered =
                base.length >= 2
                  ? [base[0], ...reds, ...greens, base[base.length - 1]]
                  : base;
              onRouteSelect?.(ordered);
              if (_collapsed) onToggle?.();
            }}
          >
            <View style={styles.itemLeft}>
              <View style={styles.nameRow}>
                <VehicleIcon
                  width={0}
                  height={18}
                  fill="#6D28D9"
                  style={styles.vehicleIcon}
                />
                <Text style={styles.itemName}>{r.name}</Text>
              </View>
              {r.vehicle && <Text style={styles.itemSub}>{r.vehicle}</Text>}
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTime}>{r.time}</Text>
              <Text style={styles.itemType}>{r.type}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderDetails = () => {
  if (!selected) return null;
  const totalMin = parseMinutes(selected.time);
  const base = selected.stops.filter(s => !s.status);
  const reds = selected.stops.filter(s => s.status === 'red').slice(0, 2);
  const greens = selected.stops.filter(s => s.status === 'green').slice(0, 2);
  const routeStops = base.length >= 2 ? [base[0], ...reds, ...greens, base[base.length - 1]] : base;
  const perLeg = computePerLegMinutes(routeStops, totalMin);

  let remaining = totalMin;

  return (
    <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
      <>
        {routeStops.map((c, routeIdx) => {
          const isFirst = routeIdx === 0;
          const isLast = routeIdx === routeStops.length - 1;
          const stopTitle = isFirst
            ? (selected.students?.[routeIdx] || `Punto ${routeIdx + 1}`)
            : isLast
              ? (c.name || 'Destino')
              : (c.name || `Punto ${routeIdx + 1}`);
          const legMin = routeIdx < perLeg.length ? perLeg[routeIdx] : 0;
          remaining = !isLast ? Math.max(0, remaining - legMin) : remaining;

          return (
            <View key={`${selected.id}-${routeIdx}`} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={styles.stopIconCol}>
                  {!isFirst && <View style={styles.connectorTop} />}
                  {isFirst ? (
                    <MarkerOrigin width={22} height={22} fill="#2563EB" stroke="#fff" strokeWidth={2.5} />
                  ) : isLast ? (
                    <MarkerDestination width={23} height={23} fill="#2563EB" color="#2563EB" />
                  ) : c.status === 'red' ? (
                    <MarkerOrigin width={22} height={22} fill="#EF4444" stroke="#fff" strokeWidth={2.5} />
                  ) : c.status === 'green' ? (
                    <MarkerOrigin width={22} height={22} fill="#10B981" stroke="#fff" strokeWidth={2.5} />
                  ) : (
                    <MarkerOrigin width={22} height={22} fill="#000" stroke="#fff" strokeWidth={2.5} />
                  )}
                  {!isLast && <View style={styles.connectorBottom} />}
                </View>
                <View style={styles.stopTextCol}>
                  <Text style={styles.stopCoord}>
                    {c.address || `${c.latitude.toFixed(3)}, ${c.longitude.toFixed(3)}`}
                    
                  </Text>
                  <Text style={styles.stopTitle}>{stopTitle}</Text>

                </View>
              </View>
                <View>
                  </View>    





            </View>
          );
        })}

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
      </>
    </ScrollView>
  );
};

  const headerTitle = selected ? null : title;

  return (
    <View style={styles.container}>
      <View style={styles.contentFrame}>
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
    minHeight: 120,
    backgroundColor: 'transparent',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  list: {},
  detailsContent: {flex: 1,},
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
  stopIconCol: { width: 24, alignItems: 'center', position: 'relative' },
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
    marginTop: 5,
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
