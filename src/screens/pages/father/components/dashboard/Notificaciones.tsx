import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LessIcon from '../../../../../assets/icons/lessthen.svg';
import TaskIcon from '../../../../../assets/icons/task.svg';


export default function Notifications () {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <LessIcon width={24} height={24} fill={'#FFFFFF'} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Notificaciones</Text>

            <View style={styles.headerAvatar}>
              <TaskIcon width={22} height={22} fill={'#FFFFFF'} />
            </View>
          </View>
        </View>
      </View>
           <View style={styles.itemRow}>
          <View style={styles.bulletOuter}>
            <View style={styles.bulletInnerRed}>
              <Text style={styles.bulletSymbol}>×</Text>
            </View>
          </View>
          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>Ruta 1</Text>
            <Text style={styles.itemSubtitle}>José Remires No asiste</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.bulletOuter}>
            <View style={styles.bulletInnerRed}>
              <Text style={styles.bulletSymbol}>×</Text>
            </View>
          </View>
          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>Ruta 2</Text>
            <Text style={styles.itemSubtitle}>Alberto Rojas No asiste</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.bulletOuter}>
            <View style={styles.bulletInnerRed}>
              <Text style={styles.bulletSymbol}>×</Text>
            </View>
          </View>
          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>Ruta 1</Text>
            <Text style={styles.itemSubtitle}>Angela Lopez No asiste</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.bulletOuter}>
            <View style={styles.bulletInnerGreen}>
              <Text style={styles.bulletSymbol}>✓</Text>
            </View>
          </View>
          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>Sistema</Text>
            <Text style={styles.itemSubtitle}>Actualización de estudiantes</Text>
          </View>
        </View>

      <View style={styles.content} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    backgroundColor: '#5d01bc',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerContent: {
    alignContent: 'flex-end',
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'space-around',
    paddingBottom: 7,
  },
  headerBar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 18,
  },
  headerTitle: {

    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 40, lineHeight: 28 },
  sectionrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
   headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4B0096', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, backgroundColor: '#FFFFFF' },
  itemRow: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  bulletOuter: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bulletInnerRed: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  bulletInnerGreen: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' },
  bulletSymbol: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  itemTextBox: { flex: 1 },
  itemTitle: { color: '#1F2937', fontSize: 16, fontWeight: '700' },
  itemSubtitle: { color: '#6B7280', fontSize: 14 },

});
