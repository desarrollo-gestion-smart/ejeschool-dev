export type DriverProfile = {
  nombre: string;
  email: string;
  identificacion: string;
  telefono: string;
  perfil: 'conductor';
  patente: string;
};

export const driverProfile: DriverProfile = {
  nombre: 'Larry Davis',
  email: 'larry.davis@example.com',
  identificacion: 'DNI-12345678',
  telefono: '+54 11 5555-1234',
  perfil: 'conductor',
  patente: 'SDF-5221',
};

export const fetchDriverProfile = async (): Promise<DriverProfile> => {
  await new Promise<void>(r => setTimeout(r, 250));
  return driverProfile;
};

export type StudentProfile = {
  nombre: string;
  email: string;
  identificacion: string;
  telefono: string;
  perfil: 'estudiante';
};

export const studentProfile: StudentProfile = {
  nombre: 'Sofia Davis',
  email: 'sofia.davis@example.com',
  identificacion: 'DNI-87654321',
  telefono: '+54 11 4321-5555',
  perfil: 'estudiante', 
};

export const fetchStudentProfile = async (): Promise<StudentProfile> => {
  await new Promise<void>(r => setTimeout(r, 250));
  return studentProfile;
};

