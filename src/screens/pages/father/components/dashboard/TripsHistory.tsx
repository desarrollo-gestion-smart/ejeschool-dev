import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LessIcon from '../../../../../assets/icons/lessthen.svg';
import LowArrowIcon from '../../../../../assets/icons/lowarrow.svg';
import MarkerOrigin from '../../../../../assets/markers/marker-origin.svg';
import MarkerDestination from '../../../../../assets/markers/marker-destination.svg';
import CashIcon from '../../../../../assets/icons/cashIcon.svg';

type HistoryItem = {
  id: string;
  from: string;
  to: string;
      status: 'Confirmado' | 'Completado' | 'Cancelado';
};

export default function Historias() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const data: HistoryItem[] = useMemo(
    () => [
      {
        id: '1',
        from: '7958 Swift Village',
        to: '105 William St, Chicago, US',
        status: 'Confirmado',
      },
      {
        id: '2',
        from: '026 Mitchell Burg Apt. 574',
        to: '324 Lottie Views Suite 426',
        status: 'Completado',
      },
      {
        id: '3',
        from: '89 Stacy Falls Suite 953',
        to: '080 Joaquin Isle Suite 865',
        status: 'Completado',
      },
      {
        id: '4',
        from: '89 Stacy Falls Suite 953',
        to: '080 Joaquin Isle Suite 865',
        status: 'Cancelado',
      },
      {
        id: '5',
        from: '89 Stacy Falls Suite 953',
        to: '080 Joaquin Isle Suite 865',
        status: 'Completado',
      },
    ],
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header morado */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <LessIcon width={28} height={28} fill="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity style={styles.datePicker}>
            <Text style={styles.dateText}>Oct 15, 2018 </Text>
            <Text>
              <LowArrowIcon width={24} height={24} fill="#f9f9f9" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.background} />

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.firstCard]}>
            <View style={styles.topRow}>
              {/* primer row */}
              <View style={styles.route}>
                <MarkerOrigin
                  width={24}
                  height={24}
                  fill={'#10B981'}
                  style={{
                    borderRadius: 6,
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />
                  <Text style={styles.from} numberOfLines={1}>
                    {item.from}
                  </Text>
              </View>
                    {/* segundo row */}
               <View style={styles.route}>

              <MarkerDestination width={24} height={24} fill={'#F52D56'}
              style={{
                    borderRadius: 6,
                    marginRight: 12,
                    marginTop: 4,
                  }} />
              <Text style={styles.to} numberOfLines={1}>
                {item.to}
              </Text>
            </View>
            </View>

            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
               
              <Text
                style={[
                  styles.statusButton,
                  item.status === 'Completado' && styles.statusCompleted,
                  item.status === 'Confirmado' && styles.statusConfirm,
                ]}
              >
                {item.status === 'Confirmado'
                  ? 'Confirmado'
                  : item.status === 'Completado'
                  ? 'Completado'
                  : 'Cancelado'}
                <LessIcon
                  style={{ marginLeft: 14, transform: [{ rotate: '180deg' }] }}
                  width={14}
                  height={14}
                  fill="#D5D4DA"
                />
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5d01bc' },

  header: { paddingHorizontal: 10, paddingBottom: 20 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: { fontSize: 36, fontWeight: '900', color: '#FFFFFF' },
  datePicker: {
    backgroundColor: '#5900B2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },

  background: {
    ...StyleSheet.absoluteFill,
    top: 250,
    backgroundColor: '#F8F9FA',
  },

  list: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  firstCard: {
    marginTop: -10, // hace que la primera card suba y toque el header
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18, // espacio cómodo entre cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },

  topRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  route: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 20,
    marginBottom: 12,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginRight: 12,
    marginTop: 4,
  },
  addresses: { flex: 1 },
  from: { fontSize: 15.5, color: '#1F2937', fontWeight: '600', marginTop: 2 },
  to: { fontSize: 15.5, color: '#1F2937', marginTop: 2 },

  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 5,
  },

  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 30,
    color: '#C8C7CC',
  },
  statusCompleted: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  statusConfirm: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
