// src/screens/PaymentMethodScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Tus SVGs (ajústalos a tus rutas reales)
import CashIcon from '../../../../../assets/icons/cashIcon.svg';
import VisaIcon from '../../../../../assets/icons/visa.svg';
import MastercardIcon from '../../../../../assets/icons/mastercard.svg';
import PaypalIcon from '../../../../../assets/icons/paypal.svg';
import Lessthen from '../../../../../assets/icons/lessthen.svg';

export default function PaymentMethodScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [defaultMethod, setDefaultMethod] = useState<'cash' | 'paypal'>(
    'paypal',
  );

  return (
    <View style={styles.container}>
      {/* Header morado */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Lessthen width={28} height={28} fill="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <TouchableOpacity>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentArea}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.panel}>
            <TouchableOpacity
              style={[styles.methodRow, styles.defaultMethod]}
              onPress={() => setDefaultMethod('cash')}
            >
              <View style={styles.iconCircle}>
                <CashIcon width={30} height={30} fill="#10B981" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Cash</Text>
                <Text style={styles.defaultLabel}>Default Payment Method</Text>
              </View>
              {defaultMethod === 'cash' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}> {'✓'}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.separator} />
            <View style={styles.cardsSection}>
              <Text style={styles.sectionTitle}>CREDIT CARD</Text>

              <TouchableOpacity style={styles.methodRow}>
                <VisaIcon width={40} height={26} />
                <Text style={styles.cardNumber}>•••• •••• •••• 5967</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodRow, styles.defaultMethod]}
                onPress={() => setDefaultMethod('paypal')}
              >
                <PaypalIcon width={40} height={26} />
                <View style={styles.methodInfo}>
                  <Text style={styles.email}>wilson.casper@bernice.info</Text>
                </View>
                {defaultMethod === 'paypal' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}> {'✓'}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.methodRow}>
                <MastercardIcon width={40} height={26} />
                <Text style={styles.cardNumber}>•••• •••• •••• 3461</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.addButton, { paddingBottom: insets.bottom }]}>
              <Text style={styles.plus}>+</Text>
              <Text style={styles.addText}>Agregar Tarjeta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5d01bc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  doneText: { fontSize: 17, color: '#fff', fontWeight: '600' },

  scroll: { flex: 1 },
  contentArea: { flex: 1, backgroundColor: '#F3F4F6' },
  panel: {
    marginTop: -24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardsSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    paddingHorizontal: 20,
  },

  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  defaultMethod: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
  },

  iconCircle: {
    width: 53,
    height: 53,
    borderRadius: 28,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginLeft: 12,
  },

  methodInfo: { flex: 1,   },
  methodTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },
  defaultLabel: { fontSize: 14, color: '#C8C7CC', marginTop: 4 },
  email: { fontSize: 16, color: '#111827' },

  cardNumber: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 1.2,
    marginLeft: 12,
    flex: 1,
  },

  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 20,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5d01bc',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  plus: { fontSize: 24, color: '#FFFFFF', marginRight: 10 },
  addText: { fontSize: 17, color: '#FFFFFF', fontWeight: '700' },
});
