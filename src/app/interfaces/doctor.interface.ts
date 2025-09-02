// src/app/interfaces/doctor.interface.ts
export interface Patient {
  name: string;
  cases: number;
  lastWork: string;
  type: string;
}

export interface Doctor {
  doctorID: number;
  name: string;
  nickName: string;
  email: string;
  phone: string;
  practice: string;
  startDate: string;
  specialty?: string;
  patients: Patient[];
}
export interface DoctorStats {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  recentWork: number;
}