// routesData.ts

// 🚨 FIX: Added 'address' to the core type definition
export type Coordinate = { 
    latitude: number; 
    longitude: number; 
    status?: 'red' | 'green'; 
    name?: string; 
    address?: string; // <--- The property needed for Geocoding Inversa
};

export type RouteData = {
  id: number;
  name: string;
  vehicle?: string;
  time: string;
  type: 'Entrada' | 'Salida';
  description?: string;
  students?: string[];
  stops: (Coordinate & { student?: string })[];

};


// Rutas cortas y cercanas (todas en un radio de ~1.5 km - Centro de CABA)
const conciseRoutes: RouteData[] = [
  {

    id: 1,
    name: 'Ruta 1 ',
    vehicle: 'Bus 101',
    time: '12 min',
    type: 'Entrada',
    description: 'Recorrido corto por Microcentro',
    students: ['Lucía Gómez', 'Mateo López', 'Sofía Martínez', 'Mateo L.'],
    stops: [
      // Origen
      { latitude: -34.60360, longitude: -58.38150, name: 'Recogida en curso', student: 'Lucía Gómez' }, 
      // Waypoint 1
      { latitude: -34.60250, longitude: -58.38080, name: 'Parada intermedia A',  student: 'Mateo López' },
      // Waypoint 2
      { latitude: -34.60180, longitude: -58.38040, name: 'Colegio NSR',  student: 'Sofía Martínez' },      
      // Destin
      { latitude: -34.59970, longitude: -58.38115, name: 'Destino Final',  student: 'Mateo L.' }, 
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.60420, longitude: -58.38230, status: 'red', name: 'Conductor' },
      { latitude: -34.60120, longitude: -58.38010, status: 'green', name: 'Punto de Interés' },
    ],
  },
  {
    id: 2,
    name: 'Ruta 2 ',
    vehicle: 'Bus 102',
    time: '10 min',
    type: 'Salida',
    description: 'Retiro → Puerto Madero',
    students: ['Valentina R.', 'Thiago S.', 'Benjamín C.'],
    stops: [
      // Origen
      { latitude: -34.59140, longitude: -58.37490, name: 'Origen Retiro' },
      // Waypoint 1
      { latitude: -34.59650, longitude: -58.37310, name: 'Parada Puerto' },
      // Destino
      { latitude: -34.60270, longitude: -58.36440, name: 'Destino Madero' },
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.59930, longitude: -58.36990, status: 'red', name: 'Conductor' },
      { latitude: -34.60190, longitude: -58.36680, status: 'green', name: 'Punto de Interés' },
    ],
  },
  {
    id: 3,
    name: 'Ruta 3 ',
    vehicle: 'Bus 103',
    time: '15 min',
    type: 'Entrada',
    description: 'Palermo → Facultad de Derecho',
    students: ['Isabella R.', 'Joaquín M.', 'Emma P.'],
    stops: [
      // Origen
      { latitude: -34.58805, longitude: -58.39060, name: 'Origen Palermo' },
      // Waypoint 1
      { latitude: -34.59240, longitude: -58.39150, name: 'Parada A' },
      // Waypoint 2
      { latitude: -34.59660, longitude: -58.39020, name: 'Parada B' },
      // Destino
      { latitude: -34.59895, longitude: -58.38730, name: 'Destino Derecho' },
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.59740, longitude: -58.38850, status: 'red', name: 'Conductor' },
      { latitude: -34.59840, longitude: -58.38650, status: 'green', name: 'Punto de Interés' },
    ],
  },
  {
    id: 4,
    name: 'Ruta 4 ',
    vehicle: 'Taxi',
    time: '5 min',
    type: 'Entrada',
    description: 'Ruta de prueba estable por Microcentro',
    students: ['Juan P.', 'Ana R.'],
    stops: [
      // Origen (Plaza de Mayo)
      { latitude: -34.60620, longitude: -58.37320, name: 'Plaza de Mayo' }, 
      // Waypoint (Diagonal Norte)
      { latitude: -34.60400, longitude: -58.37700, name: 'Diagonal Norte' }, 
      // Destino (Av. Corrientes)
      { latitude: -34.60100, longitude: -58.38000, name: 'Corrientes y Esmeralda' }, 
      
      // Puntos de Status (adicionales)
      { latitude: -34.60500, longitude: -58.37550, status: 'red', name: 'Conductor' },
      { latitude: -34.60300, longitude: -58.37850, status: 'green', name: 'Punto de Interés' },
    ],
  },
];

export default conciseRoutes;

// También puedes exportar así si prefieres nombrarlo "routes"
export { conciseRoutes as routes };