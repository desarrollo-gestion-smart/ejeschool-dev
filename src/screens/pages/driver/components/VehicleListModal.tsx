import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';

type Device = { id?: string | number; device_id?: string | number; name?: string; icon_color?: string; icon_colors?: string; device_data?: { icon_color?: string } };

type Props = {
  visible: boolean;
  devices: Device[];
  onClose: () => void;
  onSelect: (item: Device) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export default function VehicleListModal({ visible, devices, onClose, onSelect, loading, hasMore, onLoadMore }: Props) {
  const MAX_H = Math.round(Dimensions.get('window').height * 0.60) + 15;
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.card, styles.cardTop26, { maxHeight: MAX_H }]}>
        <Text style={styles.title}>Seleccionar Vehículo</Text>
        <FlatList
          data={devices}
          keyExtractor={(d, i) => String(d?.id ?? i)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelect(item);
              }}
            >
              <Text style={styles.itemText}>{item?.name || ''}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator
        />
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.loadMoreBtn, styles.actionBtn, (!hasMore || loading) ? styles.loadMoreBtnDisabled : null]}
            disabled={!hasMore || !!loading}
            onPress={onLoadMore}
          >
            <Text style={styles.loadMoreText}>{loading ? 'Cargando...' : (hasMore ? 'Cargar más' : 'No hay más')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '34%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    maxHeight: '60%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop26: { top: '26%' },
  title: { fontSize: 18, fontWeight: '700', color: '#1F1F1F', marginBottom: 8, textAlign: 'center' },
  list: { flexGrow: 1 },
  listContent: { paddingBottom: 6 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, color: '#222' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 6 },
  loadMoreBtn: { marginTop: 8, backgroundColor: '#5E00BC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  actionBtn: {},
  loadMoreBtnDisabled: { backgroundColor: '#aaa' },
  loadMoreText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
