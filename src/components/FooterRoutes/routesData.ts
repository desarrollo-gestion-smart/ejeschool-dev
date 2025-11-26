import { Coordinate } from '../map/MapComponent';

export type RouteData = {
  id: number;
  name: string;
  vehicle?: string;
  distance?: string;
  time: string;
  type: 'Entrada' | 'Salida';
  description?: string;
  NombreStudent?: string[];
  stops: Coordinate[];
};

export const routes: RouteData[] = [
  {
    id: 1,
    name: 'Ruta 1 ',
    vehicle: 'Bus 101',
    distance: '15 km',
    time: '45 min',
    type: 'Entrada',
    description: 'Recorrido por la zona norte con tres paradas principales.',
    NombreStudent: [
      'Juan Hernandes Perez',
      'Roberto alter orlando',
      'Sergio Alvarez Ramirez',
    ],
    stops: [
      { latitude: -34.585, longitude: -58.42 }, 
      { latitude: -34.595, longitude: -58.41 }, 
      { latitude: -34.605, longitude: -58.4 },  
      { latitude: -34.615, longitude: -58.39 }, 
      { latitude: -34.625, longitude: -58.38 }, 
      { latitude: -34.605, longitude: -58.4 }, 
    ],
  },
  {
    id: 2,
    name: 'Ruta 2',
    vehicle: 'Bus 102',
    distance: '12 km',
    time: '35 min',
    type: 'Salida',
    description: 'Ruta hacia el sur con dos paradas intermedias.',
    NombreStudent: [
      'Punto de partida en la estación sur',
      'Parada intermedia en avenida principal',
      'Llegada al punto de encuentro',
    ],
    stops: [
      { latitude: -34.61, longitude: -58.37 },
      { latitude: -34.62, longitude: -58.38 },
      { latitude: -34.63, longitude: -58.39 },
    ],
  },
  {
    id: 5,
    name: 'Ruta 5 ',
    vehicle: 'Bus 105',
    distance: '20 km',
    time: '60 min',
    type: 'Entrada',
    description: 'Trayecto extendido por el oeste con cuatro paradas.',
    NombreStudent: [
       'Juan Hernandes Perez',
      'Roberto alter orlando',
      'Sergio Alvarez Ramirez',
    ],
    stops: [
      { latitude: -34.57, longitude: -58.44 },
      { latitude: -34.58, longitude: -58.45 },
      { latitude: -34.59, longitude: -58.46 },
      { latitude: -34.6, longitude: -58.47 },
    ],
  },
];
