// screens/EjeSchoolScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SchoolMap from '../../components/map/MapComponent';
import AppLayout from '../../components/layout/AppLayout';
import TopBar from '../../components/layout/TopBar';
import RoutesMenu from '../../components/FooterRoutes/RoutesMenu';

interface RouteData {
  id: number;
  name: string;
  vehicle?: string;
  distance?: string;
  time: string;
  type: 'Entrada' | 'Salida';
}

const activeRoutes: RouteData[] = [
  {
    id: 1,
    name: 'Ruta 5',
    vehicle: 'ADF345',
    time: '09:00 PM',
    type: 'Entrada',
  },
  {
    id: 2,
    name: 'Ruta 27',
    distance: '0.67 km',
    time: '6:00 AM',
    type: 'Salida',
  },
];

// Esto es lo que se muestra en la parte inferior (el menú de rutas)
const renderBottom = ({ collapsed, toggle }: { collapsed: boolean; toggle: () => void }) => (
  <RoutesMenu routes={activeRoutes} collapsed={collapsed} onToggle={toggle} />
);

function PageDriver() {
  return (
    <AppLayout renderTopBar={<TopBar title="Eje School" />} bottomContent={renderBottom}>
      {/* El mapa ocupa TODO el fondo */}
      <View style={StyleSheet.absoluteFillObject}>
        <SchoolMap />
      </View>

      {/* Overlay futuro: contenido encima del mapa */}
    </AppLayout>
  );
}


export default PageDriver;