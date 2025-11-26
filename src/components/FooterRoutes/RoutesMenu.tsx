import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import useResponsive from '../../types/useResponsive';
import { RouteData } from '../FooterRoutes/routesData';
import { Coordinate } from '../map/MapComponent';
import VehicleIcon from '../../assets/vehicle.svg';
import MarkerOrigin from '../../assets/marker-origin.svg';
import MarkerDestination from '../../assets/marker-destination.svg';

type Props = {
  title?: string;
  routes: RouteData[];
  collapsed?: boolean;
  onRouteSelect?: (stops: Coordinate[]) => void;
  onToggle?: () => void;
};

export default function RoutesMenu({
  title = 'Rutas Activas',
  routes,
  collapsed: _collapsed,
  onToggle,
  onRouteSelect,
}: Props) {
  const { vh } = useResponsive();
  const [selected, setSelected] = React.useState<RouteData | null>(null);

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
    const c = 2 * Math.asin(Math.sqrt(s1 * s1 + Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) * s2 * s2));
    return R * c;
  };

  const computePerLegMinutes = (stops: Coordinate[], totalMinutes: number): number[] => {
    if (!stops || stops.length < 2 || totalMinutes <= 0) return [];
    const legs = stops.length - 1;
    const distances = Array.from({ length: legs }, (_, i) => haversineKm(stops[i], stops[i + 1]));
    const totalKm = distances.reduce((sum, d) => sum + d, 0);
    if (totalKm <= 0) return Array(legs).fill(Math.round(totalMinutes / legs));
    return distances.map(d => Math.max(1, Math.round((d / totalKm) * totalMinutes)));
  };

  const renderList = () => (
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={true}>
      {routes.map(r => (
        <TouchableOpacity
          key={r.id}
          style={styles.item}
          onPress={() => {
            setSelected(r);
            onRouteSelect?.(r.stops);
          }}
        >
          <View style={styles.itemLeft}>
            <View style={styles.nameRow}>
              <VehicleIcon width={50} height={18} fill="#6D28D9" style={styles.vehicleIcon}/>
              <Text style={styles.itemName}>{r.name}</Text>
            </View>
            {r.vehicle && <Text style={styles.itemSub}>{r.vehicle}</Text>}
            {r.distance && <Text style={styles.itemSub}>{r.distance}</Text>}
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.itemTime}>{r.time}</Text>
            <Text style={styles.itemType}>{r.type}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDetails = () => {
    if (!selected) return null;
    const totalMin = parseMinutes(selected.time);
    const perLeg = computePerLegMinutes(selected.stops, totalMin);
    let remaining = totalMin;
    const waypointColors = ['#6D28D9', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF6B6B', '#7B7B7B'];
    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <View style={styles.detailsHeaderRow}>
          <Text style={styles.detailsTitle}>{selected.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryType}>{selected.type}</Text>
        </View>
        {selected.stops.map((c, i) => {
          const isFirst = i === 0;
          const isLast = i === selected.stops.length - 1;
          const stopTitle = isFirst ? 'Origen' : isLast ? 'Destino' : `Parada ${i}`;
          const legMin = i < perLeg.length ? perLeg[i] : 0;
          const nextLabel = !isLast ? `${legMin} min hacia siguiente` : '—';
          remaining = !isLast ? Math.max(0, remaining - legMin) : 0;
          const remainingLabel = !isLast ? `${remaining} min restantes` : '0 min restantes';
          return (
            <View key={`${selected.id}-${i}`} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={styles.stopIconCol}>
                  {!isFirst && <View style={styles.connectorTop} />}
                  {isFirst ? (
                    <MarkerOrigin width={20} height={20} color="#00BFFF" />
                  ) : isLast ? (
                    <MarkerDestination width={20} height={20} color="#FF3B30" />
                  ) : (
                    <MarkerOrigin width={20} height={20} color={waypointColors[(i - 1) % waypointColors.length]} />
                  )}
                  {!isLast && <View style={styles.connectorBottom} />}
                </View>
                <View style={styles.stopTextCol}>
                  <Text style={styles.stopTitle}>{stopTitle}</Text>
                  <Text style={styles.stopCoord}>{`${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`}</Text>
                </View>
              </View>
              <View style={styles.stopRight}>
                {!isLast && <Text style={styles.stopNext}>{nextLabel}</Text>}
                {!isLast && <Text style={styles.stopRemaining}>{remainingLabel}</Text>}
              </View>
            </View>
          );
        })}
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={() => {
            onRouteSelect?.([]);
            setSelected(null);
          }}
        >
          <Text style={styles.finalizeButtonText}>Finalizar ruta</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const headerTitle = selected ? 'Detalle de ruta' : title;

  return (
    <View style={[styles.container, { maxHeight: vh(55) }]}> 
      <TouchableOpacity onPress={onToggle}>
        <View style={styles.handleIcon} />
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{headerTitle}</Text>
      </View>
      {selected ? renderDetails() : renderList()}
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 12,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  handleIcon: {
    width: '50%',
    alignSelf: 'center',
    height: 8,
    resizeMode: 'contain',
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: '#C6C6C8',
  },
  list: { paddingBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  vehicleIcon: { width: 20, height: 18, marginRight: 8 },
  itemLeft: { flex: 1 },
  itemRight: { alignItems: 'flex-end', justifyContent: 'center'},
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemDesc: { fontSize: 13, color: '#555', marginTop: 4 },
  itemSub: { fontSize: 14, color: '#999', marginTop: 2 },
  itemTime: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemType: { fontSize: 14, color: '#666', marginTop: 2 },
  detailsContainer:  { padding: 18 },
  detailsHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  detailsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButtonText: { color: '#333', fontWeight: '600' },
  routeDesc: { fontSize: 14, color: '#555', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#333' },
  summaryType: { fontSize: 14, color: '#666' },
  stopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#efefef' },
  stopLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stopIconCol: { width: 26, alignItems: 'center', justifyContent: 'center', marginRight: 8, position: 'relative' },
  connectorTop: { position: 'absolute', top: -12, height: 12, width: 0, borderLeftWidth: 2, borderLeftColor: '#C6C6C8', borderStyle: 'dashed' },
  connectorBottom: { position: 'absolute', bottom: -12, height: 12, width: 0, borderLeftWidth: 2, borderLeftColor: '#C6C6C8', borderStyle: 'dashed' },
  stopTextCol: { flexDirection: 'column', flex: 1 },
  stopTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  stopDesc: { fontSize: 15, color: '#555', marginTop: 4 },
  stopCoord: { fontSize: 12, color: '#999', marginTop: 2 },
  stopRight: { alignItems: 'flex-end' },
  stopEmoji: { fontSize: 20, fontWeight: '600', color: '#333' },
  stopNext: { fontSize: 13, color: '#333' },
  stopRemaining: { fontSize: 12, color: '#666', marginTop: 2 },
  finalizeButton: { marginTop: 12, backgroundColor: '#6D28D9', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  finalizeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
