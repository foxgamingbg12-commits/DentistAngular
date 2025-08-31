// src/app/interfaces/doctor.interface.ts
export interface Patient {
  name: string;
  cases: number;
  lastWork: string;
  type: string;
}

export interface Doctor {
  DoctorID: number;
  Name: string;
  NickName: string;
  Email: string;
  Phone: string;
  practice: string;
  joinDate: string;
  specialty: string;
  patients: Patient[];
}

export interface DoctorStats {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  recentWork: number;
}