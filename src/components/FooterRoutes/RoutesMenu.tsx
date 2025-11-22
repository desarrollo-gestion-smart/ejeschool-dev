import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useResponsive from '../../types/useResponsive';

export type RouteData = {
  id: number;
  name: string;
  vehicle?: string;
  distance?: string;
  time: string;
  type: 'Entrada' | 'Salida';
};
type Props = {
  title?: string;
  routes: RouteData[];
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function RoutesMenu({
  title = 'Rutas Activas',
  routes,
  collapsed: _collapsed,
  onToggle,
}: Props) {
  const { vh } = useResponsive();
  return (
    <View style={[styles.container, { maxHeight: vh(50) }]}>
      <TouchableOpacity onPress={onToggle}>
        <View style={styles.handleIcon} />
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={true}
      >
        {routes.map(r => (
          <View key={r.id} style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{r.name}</Text>
              {r.vehicle && <Text style={styles.itemSub}>{r.vehicle}</Text>}
              {r.distance && <Text style={styles.itemSub}>{r.distance}</Text>}
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTime}>{r.time}</Text>
              <Text style={styles.itemType}>{r.type}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    elevation: 10,
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
  itemLeft: { flex: 1 },
  itemRight: { alignItems: 'flex-end' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemSub: { fontSize: 14, color: '#999', marginTop: 2 },
  itemTime: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemType: { fontSize: 14, color: '#666', marginTop: 2 },
});
