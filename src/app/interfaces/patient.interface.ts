export interface Case {
  type: string;
  tooth: string;
  status: 'completed' | 'in-progress' | 'urgent' | 'new';
  date: string;
}

export interface Patient {
  patientID: number;
  name: string;
  birthDate?: Date;
  phone?: string;
  email?: string;
  shadeID?:number;
  healthInsuranceNumber?: string;
  cases: Case[] | null | undefined;
}

export interface NewPatient 
{
  name: string;
  birthDate?: string;
  shadeID?: number;
  healthInsuranceNumber?: string;
  phone?: string;
  email?: string;
}

export interface Statistics {
  totalPatients: number;

}