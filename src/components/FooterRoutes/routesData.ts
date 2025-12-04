
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


type RouteEventName = 'route:setStatus';
type Listener = (payload: any) => void;
class SimpleEmitter {
  private listeners: Record<RouteEventName, Set<Listener>> = {
    'route:setStatus': new Set<Listener>(),
  };
  on(event: RouteEventName, handler: Listener) {
    this.listeners[event].add(handler);
  }
  off(event: RouteEventName, handler: Listener) {
    this.listeners[event].delete(handler);
  }
  emit(event: RouteEventName, payload: any) {
    this.listeners[event].forEach(h => h(payload));
  }
}
export const routeEvents = new SimpleEmitter();

// Rutas reorganizadas: máximo 4 alumnos por ruta y un conductor asignado
const conciseRoutes: RouteData[] = [
  {
    id: 1,
    name: 'Ruta 1',
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
      { latitude: -34.60360, longitude: -58.38150, Directions: 'Recogida en curso', student: 'Lucía Gómez' }, 
      { latitude: -34.601381, longitude: -58.379532, Directions: 'Recogida en curso',  student: 'Mateo López' },
      { latitude: -34.60180, longitude: -58.38040, Directions: 'Colegio NSR',  student: 'Sofía Martínez' },      
      { latitude: -34.601381, longitude: -58.379532, Directions: '',  student: 'Mateo L.' }, 
      { latitude: -34.60420, longitude: -58.38230, status: 'red', name: 'Monica Santa Alcina', nameRol: 'Conductor' },
    ],
  },
  {
    id: 2,
    name: 'Ruta 2',
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
      { latitude: -34.59140, longitude: -58.37490, name: 'Origen Retiro' },
      { latitude: -34.59650, longitude: -58.37310, name: 'Parada Puerto' },
      { latitude: -34.60270, longitude: -58.36440, name: 'Destino Madero' },
      { latitude: -34.59930, longitude: -58.36990, status: 'red', name: 'Carlos Méndez', nameRol: 'Conductor' },
    ],
  },
  {
    id: 3,
    name: 'Ruta 3',
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
      { latitude: -34.58805, longitude: -58.39060, name: 'Origen Palermo' },
      { latitude: -34.59895, longitude: -58.38730, name: 'Destino Derecho' },
      { latitude: -34.59740, longitude: -58.38850, status: 'red', name: 'Laura Fernández', nameRol: 'Conductor' },
    ],
  },
  {
    id: 4,
    name: 'Ruta 4',
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
      { latitude: -34.60620, longitude: -58.37320, name: 'Plaza de Mayo' }, 
      { latitude: -34.60400, longitude: -58.37700, name: 'Diagonal Norte' }, 
      { latitude: -34.60100, longitude: -58.38000, name: 'Corrientes y Esmeralda' }, 
      { latitude: -34.60500, longitude: -58.37550, status: 'red', name: 'Roberto Silva', nameRol: 'Conductor' },
    ],
  },
];

export default conciseRoutes;
export { conciseRoutes as routes };
