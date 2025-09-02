// src/app/services/doctor.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,catchError, map, of, tap  } from 'rxjs';
import { Doctor, DoctorStats } from '../interfaces/doctor.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  public doctors$ = this.doctorsSubject.asObservable();
  constructor(private http: HttpClient) {this.loadDoctors(); }

  // Call this to fetch and fill the BehaviorSubject
  loadDoctors(): void {
    this.http.get<Doctor[]>(`${API_URL}doctor`).subscribe({
      next: (data) => {
        console.log('Fetched doctors:', data);
        this.doctorsSubject.next(data);
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.doctorsSubject.next([]); // fallback
      }
     });
    }
  getDoctors(): Observable<Doctor[]> {
    return this.doctors$;
  }

  addDoctor(doctor: Doctor): void {
    const currentDoctors = this.doctorsSubject.value;
    this.doctorsSubject.next([...currentDoctors, doctor]);
  }

  searchDoctors(searchTerm: string): Doctor[] {
    const allDoctors = this.doctorsSubject.value;
    if (!searchTerm.trim()) {
      return allDoctors;
    }

    const term = searchTerm.toLowerCase();
    return allDoctors.filter(doctor =>
      doctor.name.toLowerCase().includes(term) ||
      doctor.nickName.toLowerCase().includes(term) ||
      doctor.email.toLowerCase().includes(term) ||
      doctor.phone.includes(term) ||
      doctor.practice.toLowerCase().includes(term) ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(term))
    );
  }

  getDoctorStats(): DoctorStats {
    const doctors = this.doctorsSubject.value;
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.length;
    const totalPatients = doctors.reduce((total, doctor) => total + (doctor.patients ? doctor.patients.length : 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentWork = doctors.reduce((total, doctor) => {
      if (!doctor.patients) return total;
      return total + doctor.patients.filter(patient => {
        const lastWork = new Date(patient.lastWork);
        return lastWork >= thirtyDaysAgo;
      }).length;
    }, 0);

    return { totalDoctors, activeDoctors, totalPatients, recentWork };
  }

  generateDoctorId(): number {
    const doctors = this.doctorsSubject.value;
    return Math.max(...doctors.map(d => d.doctorID)) + 1;
  }

}