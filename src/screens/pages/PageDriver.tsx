// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapComponent from '../../components/map/MapComponent';
import AppLayout from '../../components/map/layout/AppLayout';
import TopBar from '../../components/map/layout/TopBar';
import RoutesMenu from '../../components/FooterRoutes/RoutesMenu';
import { routes } from '../../components/FooterRoutes/routesData';

 

// Esto es lo que se muestra en la parte inferior (el menú de rutas)
const renderBottom = ({ collapsed, toggle, onRouteSelect }: { collapsed: boolean; toggle: () => void; onRouteSelect: (stops: { latitude: number; longitude: number }[]) => void }) => (
  <RoutesMenu routes={routes} collapsed={collapsed} onToggle={toggle} onRouteSelect={onRouteSelect} />
);

function PageDriver() {

  return (
    <AppLayout renderTopBar={<TopBar title="Eje School" />}>
      <View style={StyleSheet.absoluteFill}  >
        <MapComponent
          bottomContent={renderBottom} />
      </View>

    </AppLayout>
  );
}


export default PageDriver;
