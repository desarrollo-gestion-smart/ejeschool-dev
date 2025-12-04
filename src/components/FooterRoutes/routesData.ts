// routesData.ts

// 🚨 FIX: Added 'address' to the core type definition
export type Coordinate = { 
    latitude: number; 
    longitude: number; 
    status?: 'red' | 'green' ;
    name?: string; 
    address?: string; 
    nameRol?: string;
};

export type StudentInfo = {
  nombre: string;
  apellido: string;
  email: string;
  identificacion: string;
  telefono: string;
  rol: 'estudiante';
};

export type RouteData = {
  id: number;
  name: string;
  vehicle?: string;
  time: string;
  hour?: string;
  type: 'Entrada' | 'Salida';
  description?: string;
  students?: string[];
  stops: (Coordinate & { student?: string } & { Directions?: string })[];
  info?: StudentInfo[];
  distanceKm?: number;
  companyId?: number;
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
    info: [
      { nombre: 'Lucía', apellido: 'Gómez', email: 'lucia.gomez@example.com', identificacion: 'DNI-30111222', telefono: '+54 11 5555-0001', rol: 'estudiante' },
      { nombre: 'Mateo', apellido: 'López', email: 'mateo.lopez@example.com', identificacion: 'DNI-30222333', telefono: '+54 11 5555-0002', rol: 'estudiante' },
      { nombre: 'Sofía', apellido: 'Martínez', email: 'sofia.martinez@example.com', identificacion: 'DNI-30333444', telefono: '+54 11 5555-0003', rol: 'estudiante' },
      { nombre: 'Mateo', apellido: 'L.', email: 'mateo.l@example.com', identificacion: 'DNI-30444555', telefono: '+54 11 5555-0004', rol: 'estudiante' }
    ],
    stops: [
      // Origen
      { latitude: -34.60360, longitude: -58.38150, Directions: 'Recogida en curso', student: 'Lucía Gómez' }, 
      // Waypoint 1
      { latitude: -34.60250, longitude: -58.38080, Directions: 'Recogida en curso',  student: 'Mateo López' },
      // Waypoint 2
      { latitude: -34.60180, longitude: -58.38040, Directions: 'Colegio NSR',  student: 'Sofía Martínez' },      
      // Destino
      { latitude: -34.59970, longitude: -58.38115, Directions: 'Destino Final',  student: 'Mateo L.' }, 
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.60420, longitude: -58.38230, status: 'red', name: 'Monica Santa Alcina', nameRol: 'Conductor' },
      { latitude: -34.60120, longitude: -58.38010, status: 'green', name: 'Juan hernandes de la cruz', nameRol: 'Estudiante' },
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
    info: [
      { nombre: 'Valentina', apellido: 'R.', email: 'valentina.r@example.com', identificacion: 'DNI-31111222', telefono: '+54 11 5555-0011', rol: 'estudiante' },
      { nombre: 'Thiago', apellido: 'S.', email: 'thiago.s@example.com', identificacion: 'DNI-32222333', telefono: '+54 11 5555-0012', rol: 'estudiante' },
      { nombre: 'Benjamín', apellido: 'C.', email: 'benjamin.c@example.com', identificacion: 'DNI-33333444', telefono: '+54 11 5555-0013', rol: 'estudiante' }
    ],
    stops: [
      // Origen
      { latitude: -34.59140, longitude: -58.37490, name: 'Origen Retiro' },
      // Waypoint 1
      { latitude: -34.59650, longitude: -58.37310, name: 'Parada Puerto' },
      // Destino
      { latitude: -34.60270, longitude: -58.36440, name: 'Destino Madero' },
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.59930, longitude: -58.36990, status: 'red', name: 'Monica Santa Alcina', nameRol: 'Conductor' },
      { latitude: -34.60190, longitude: -58.36680, status: 'green', name: 'Juan hernandes de la cruz', nameRol: 'Estudiante' },
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
    info: [
      { nombre: 'Isabella', apellido: 'R.', email: 'isabella.r@example.com', identificacion: 'DNI-34111222', telefono: '+54 11 5555-0021', rol: 'estudiante' },
      { nombre: 'Joaquín', apellido: 'M.', email: 'joaquin.m@example.com', identificacion: 'DNI-35222333', telefono: '+54 11 5555-0022', rol: 'estudiante' },
      { nombre: 'Emma', apellido: 'P.', email: 'emma.p@example.com', identificacion: 'DNI-36333444', telefono: '+54 11 5555-0023', rol: 'estudiante' }
    ],
    stops: [
      // Origen
      { latitude: -34.58805, longitude: -58.39060, name: 'Origen Palermo' },
      // Destino
      { latitude: -34.59895, longitude: -58.38730, name: 'Destino Derecho' },
      // Puntos de Status (adicionales, no forzan la ruta)
      { latitude: -34.59740, longitude: -58.38850, status: 'red', name: 'Monica Santa Alcina', nameRol: 'Conductor' },
      { latitude: -34.59840, longitude: -58.38650, status: 'green', name: 'Juan hernandes de la cruz', nameRol: 'Estudiante' },
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
    info: [
      { nombre: 'Juan', apellido: 'P.', email: 'juan.p@example.com', identificacion: 'DNI-37111222', telefono: '+54 11 5555-0031', rol: 'estudiante' },
      { nombre: 'Ana', apellido: 'R.', email: 'ana.r@example.com', identificacion: 'DNI-38222333', telefono: '+54 11 5555-0032', rol: 'estudiante' }
    ],
    stops: [
      // Origen (Plaza de Mayo)
      { latitude: -34.60620, longitude: -58.37320, name: 'Plaza de Mayo' }, 
      // Waypoint (Diagonal Norte)
      { latitude: -34.60400, longitude: -58.37700, name: 'Diagonal Norte' }, 
      // Destino (Av. Corrientes)
      { latitude: -34.60100, longitude: -58.38000, name: 'Corrientes y Esmeralda' }, 
      
      // Puntos de Status (adicionales)
      { latitude: -34.60500, longitude: -58.37550, status: 'red', name: 'Monica Santa Alcina', nameRol: 'Conductor' },
      { latitude: -34.60300, longitude: -58.37850, status: 'green', name: 'Juan hernandes de la cruz', nameRol: 'Estudiante' },
    ],
  },
];

export default conciseRoutes;

// También puedes exportar así si prefieres nombrarlo "routes"
export { conciseRoutes as routes };
