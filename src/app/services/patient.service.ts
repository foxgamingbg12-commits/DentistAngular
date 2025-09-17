import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient, NewPatient, Statistics } from '../interfaces/patient.interface';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiURL;
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();
  constructor(private http: HttpClient) {this.loadPractices(); }

  loadPractices(): void {
      this.http.get<Patient[]>(`${API_URL}patient`).subscribe({
        next: (data) => {
          console.log('Fetched practices:', data);
          this.patientsSubject.next(data);
        },
        error: (err) => {
          console.error('Failed to load practices:', err);
          this.patientsSubject.next([]); // fallback
        }
       });
      }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  addPatient(newPatient: NewPatient): void {
    const patients = this.patientsSubject.value;
    const PatientID: Patient = {
      patientID: Math.max(...patients.map(p => p.patientID)) + 1,
      name: `${newPatient.name}`,
      birthDate: newPatient.birthDate ? new Date(newPatient.birthDate) : undefined,
      phone: newPatient.phone || '',
      email: newPatient.email || '',
      cases: []
    };
    
    this.patientsSubject.next([...patients, PatientID]);
  }

  getPatientById(id: number): Patient | undefined {
    return this.patientsSubject.value.find(p => p.patientID === id);
  }

  getStatistics(): Statistics {
    const patients = this.patientsSubject.value;
    const allCases = patients.flatMap(p => p.cases);
    
    return {
      totalPatients: patients.length,

};
  }


  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }


}