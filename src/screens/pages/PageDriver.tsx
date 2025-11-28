// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapComponent from '../../components/map/MapComponent';
import TopBar from '../../components/map/layout/TopBar';
import RoutesMenu from '../../components/FooterRoutes/RoutesMenu';
import { routes } from '../../components/FooterRoutes/routesData';

 

// Esto es lo que se muestra en la parte inferior (el menú de rutas)
const renderBottom = ({ collapsed, toggle, onRouteSelect, onModeChange }: { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void; onModeChange: (isDetails: boolean) => void }) => (
  <RoutesMenu routes={routes} collapsed={collapsed} onToggle={toggle} onRouteSelect={onRouteSelect} onModeChange={onModeChange} />
);

function PageDriver() {
  const insets = useSafeAreaInsets();

  const TopBarWithCard = (
    <>
      <TopBar title="Eje School" />
      <View style={[styles.overlayCard, { top: insets.top + 24 }]}>
        <View style={styles.avatarCircle}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.avatarImg} />
        </View>
        <Text style={styles.nameText}>Gregory Smith</Text>
        <Text style={styles.subText}>Colegio NSR</Text>
        <TouchableOpacity style={styles.smallButton}><Text style={styles.smallButtonText}>Seleccionar Colegio</Text></TouchableOpacity>
        <View style={styles.plateBox}><Text style={styles.plateText}>NZF-056</Text></View>
        <TouchableOpacity style={styles.smallButton}><Text style={styles.smallButtonText}>Seleccionar Vehículo</Text></TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapComponent
        renderTopBar={TopBarWithCard}
        bottomContent={renderBottom}
      />
    </View>
  );
}


export default PageDriver;

const styles = StyleSheet.create({
  overlayCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6A11CB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: 8,
  },
  avatarImg: { width: 56, height: 56, borderRadius: 28 },
  nameText: { fontSize: 18, fontWeight: '700', color: '#1F1F1F' },
  subText: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 10 },
  smallButton: {
    alignSelf: 'center',
    backgroundColor: '#6D28D9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  plateBox: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
  },
  plateText: { fontSize: 22, fontWeight: '800', color: '#1F1F1F', letterSpacing: 1 },
});
