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

  const headerTitle = title;

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
  stopAvatarCol: {  alignItems: 'center', gap: 4 },
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

