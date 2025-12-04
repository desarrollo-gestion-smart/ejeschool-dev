import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
<<<<<<< HEAD
import MarkerOrigin from '../../assets/markers/marker-origin-own.svg';
import MarkerDestination from '../../assets/markers/marker-destination.svg';
import AvatarBadge from '../AvatarBadge';
=======
>>>>>>> dev

type Props = {
  title?: string;
  routes: RouteData[];
  collapsed?: boolean;
  onRouteSelect?: (stops: Coordinate[]) => void;
  onToggle?: () => void;
  onModeChange?: (isDetails: boolean) => void;
  selectedRoute?: RouteData | null;
  onSelectRoute?: (route: RouteData | null) => void;
};
export default function RoutesMenu({
  title = 'Rutas Activas',
  routes,
  collapsed: _collapsed,
  onToggle: _onToggle,
  onRouteSelect: _onRouteSelect,
  onModeChange: _onModeChange,
  selectedRoute: _selectedRoute,
  onSelectRoute,
}: Props) {

  


  const renderList = () => (

    <ScrollView style={styles.detailsScroll}
    contentContainerStyle={{ paddingBottom:10 }}
    showsVerticalScrollIndicator={true}>
        {routes.map((r, idx) => (
          <TouchableOpacity
            key={r.id}
            style={styles.item}
            onPress={() => {
              console.log('RoutesMenu onPress', { id: r.id, collapsed: _collapsed });
              _onRouteSelect?.(r?.stops || []);
              onSelectRoute?.(r);
              _onModeChange?.(true);
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
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTime}>{r.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

    </ScrollView>
  );

  // Details are rendered by DetailRoutes component

<<<<<<< HEAD
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
=======
  const headerTitle = title;
>>>>>>> dev

  return (
    <View style={styles.container}>
      <View style={[styles.contentFrame, { flex: 1 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{headerTitle}{!_selectedRoute && routes ? ` (${routes.length})` : ''}</Text>
      </View>


      {renderList()}

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
  loadingBox: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, color: '#444', marginTop: 8 },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
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
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
  errorText: { color: '#B91C1C', fontSize: 13 },
  retryButton: { marginTop: 6, backgroundColor: '#5d01bc', paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  retryText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  contentFrame: {
    alignSelf: 'center',
    width: '100%',
  },
  emptyBox: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#666' },
  
  summaryBox: { paddingVertical: 6, paddingHorizontal: 12 },
  summaryText: { fontSize: 12, color: '#374151' },
});

