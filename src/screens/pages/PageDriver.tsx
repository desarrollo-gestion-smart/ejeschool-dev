// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapComponent from '../../components/map/MapComponent';
import TopBar from '../../components/map/layout/TopBar';
import MenuRoutes from '../../components/map/layout/MenuRoutes';
import RoutesMenu from '../../components/FooterRoutes/RenderRoutes';
import { routes } from '../../components/FooterRoutes/routesData';

 

// Esto es lo que se muestra en la parte inferior (el menú de rutas)
const renderBottomFactory = (setIsDetails: (v: boolean) => void) =>
  ({ collapsed, toggle, onRouteSelect, onModeChange }: { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void; onModeChange: (isDetails: boolean) => void }) => (
    <MenuRoutes>
      <RoutesMenu
        routes={routes}
        collapsed={collapsed}
        onToggle={toggle}
        onRouteSelect={onRouteSelect}
        onModeChange={(v: boolean) => {
          setIsDetails(v);
          onModeChange?.(v);
        }}
      />
    </MenuRoutes>
  );

function PageDriver() {
  const insets = useSafeAreaInsets();
  const [isDetails, setIsDetails] = React.useState(false);

  React.useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Salir',
        '¿Deseas salir de la aplicación?',
        [
          { text: 'Quedarme', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  const TopBarWithCard = (
    !isDetails ? (
      <>
        <TopBar title="Eje School" />
        <View style={[styles.overlayCard, { top: insets.top + 90 }]}>
          <View style={styles.avatarCircle}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.avatarImg} />
          </View>
          <Text style={styles.nameText}>Gregory Smith</Text>
          <Text style={styles.subText}>Colegio NSR</Text>
          <TouchableOpacity style={styles.buttontop}><Text style={styles.smallButtonText}>Seleccionar Colegio</Text></TouchableOpacity>
          <View style={styles.plateBox}><Text style={styles.plateText}>NZF-056</Text></View>
          <TouchableOpacity style={styles.smallButton}><Text style={styles.smallButtonText}>Seleccionar Vehículo</Text></TouchableOpacity>
        </View>
      </>
    ) : null
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapComponent
        renderTopBar={TopBarWithCard}
        bottomContent={renderBottomFactory(setIsDetails)}
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
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: 8,
  },
  avatarImg: { width: 58, height: 65, borderRadius: 28 },
  nameText: { fontSize: 18, fontWeight: '700', color: '#1F1F1F' },
  subText: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 10 },
  smallButton: {
    alignSelf: 'center',
    backgroundColor: '#5E00BC',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  buttontop:{
    alignSelf: 'center',
    backgroundColor: '#4252FF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  plateBox: {
    marginTop: 8,
  },
  plateText: { fontSize: 22, fontWeight: '800', color: '#1F1F1F', letterSpacing: 1 },
});
