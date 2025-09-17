import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Practice, PracticeStats } from '../interfaces/practice.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private practicesSubject = new BehaviorSubject<Practice[]>([]);
  public practices$ = this.practicesSubject.asObservable();
  constructor(private http: HttpClient) {this.loadPractices(); }

  loadPractices(): void {
      this.http.get<Practice[]>(`${API_URL}practice/practiceInfo`).subscribe({
        next: (data) => {
          console.log('Fetched practices:', data);
          this.practicesSubject.next(data);
        },
        error: (err) => {
          console.error('Failed to load practices:', err);
          this.practicesSubject.next([]); // fallback
        }
       });
      }

  getPractices(): Observable<Practice[]> {
    return this.practices$;
  }

  addPractice(practice: Omit<Practice, 'PracticeID'>): void {
      const currentPractices = this.practicesSubject.value;

    this.practicesSubject.next([...currentPractices, practice]);
  }

  searchPractices(searchTerm: string): Practice[] {
    const allPractices = this.practicesSubject.value;
    
    if (!searchTerm.trim()) {
      return allPractices;
    }

    const term = searchTerm.toLowerCase();
    return allPractices.filter(practice => 
      practice.name.toLowerCase().includes(term) ||
      practice.companyName.toLowerCase().includes(term) ||
      (practice.email && practice.email.toLowerCase().includes(term)) ||
      practice.phone.includes(term) ||
      practice.adress.toLowerCase().includes(term)
    );
  }

  getStats(): PracticeStats {
    const practices = this.practicesSubject.value;
    
    return {
      totalPractices: practices.length,
      totalDoctors: practices.reduce((total, practice) => total + practice.doctorCount, 0),
      recentWork: practices.reduce((total, practice) => total + practice.caseCount, 0)
    };
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''));
  }

  formatPhoneNumber(phone: string): string {
    let value = phone.replace(/\D/g, '');
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    return value;
  }

  getInitials(name: string): string {
    return name.split(' ')
              .map(word => word.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}