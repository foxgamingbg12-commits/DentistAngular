import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Practice, PracticeStats } from '../interfaces/practice.interface';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private practicesSubject = new BehaviorSubject<Practice[]>([
    {
      PracticeID: 1,
      Name: "Sunshine Dental Care",
      CompanyName: "Sunshine Medical Group LLC",
      Address: "123 Healthcare Plaza, Suite 200, Medical District, CA 90210",
      Phone: "(555) 123-4567",
      Email: "contact@sunshinedental.com",
      TaxID: "12-3456789",
      OpeningHours: "Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM, Sunday: Closed",
      DeliveryMethod: "Courier service (daily pickup/delivery), Emergency pickup available 24/7",
      PartnerSince: "2019-03-15",
      Status: "Active",
      Doctors: 4,
      RecentCases: 12
    },
    {
      PracticeID: 2,
      Name: "Downtown Dental Clinic",
      CompanyName: "Downtown Dental Services Inc.",
      Address: "456 Main Street, Downtown, CA 90211",
      Phone: "(555) 234-5678",
      Email: "info@downtowndental.com",
      TaxID: "23-4567890",
      OpeningHours: "Monday - Friday: 7:30 AM - 7:00 PM, Saturday: 8:00 AM - 4:00 PM",
      DeliveryMethod: "Pickup and delivery service, Same-day rush available",
      PartnerSince: "2020-01-20",
      Status: "Active",
      Doctors: 6,
      RecentCases: 18
    },
    {
      PracticeID: 3,
      Name: "Elite Smile Center",
      CompanyName: "Elite Dental Group LLC",
      Address: "789 Professional Blvd, Suite 100, Westside, CA 90212",
      Phone: "(555) 345-6789",
      Email: "contact@elitesmile.com",
      TaxID: "34-5678901",
      OpeningHours: "Monday - Thursday: 8:00 AM - 5:00 PM, Friday: 8:00 AM - 3:00 PM",
      DeliveryMethod: "Weekly scheduled pickup, Express service available",
      PartnerSince: "2021-06-10",
      Status: "Active",
      Doctors: 3,
      RecentCases: 8
    },
    {
      PracticeID: 4,
      Name: "Perfect Teeth Practice",
      CompanyName: "Perfect Dental Solutions Inc.",
      Address: "321 Dental Way, Suite 300, Eastside, CA 90213",
      Phone: "(555) 456-7890",
      Email: "admin@perfectteeth.com",
      TaxID: "45-6789012",
      OpeningHours: "Monday - Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM",
      DeliveryMethod: "Bi-weekly pickup service, Emergency delivery available",
      PartnerSince: "2022-02-14",
      Status: "Active",
      Doctors: 5,
      RecentCases: 15
    },
    {
      PracticeID: 5,
      Name: "Advanced Dental Care",
      CompanyName: "Advanced Dental Specialists LLC",
      Address: "654 Innovation Drive, Tech Park, CA 90214",
      Phone: "(555) 567-8901",
      Email: "info@advancedcare.com",
      TaxID: "56-7890123",
      OpeningHours: "Monday - Friday: 8:00 AM - 6:00 PM",
      DeliveryMethod: "Daily courier service, Digital workflow integration",
      PartnerSince: "2021-11-30",
      Status: "Active",
      Doctors: 4,
      RecentCases: 10
    },
    {
      PracticeID: 6,
      Name: "Family Care Dental",
      CompanyName: "Family Dental Services Corp.",
      Address: "987 Family Circle, Suburb Heights, CA 90215",
      Phone: "(555) 678-9012",
      Email: "contact@familycare.com",
      TaxID: "67-8901234",
      OpeningHours: "Monday - Saturday: 8:00 AM - 5:00 PM",
      DeliveryMethod: "Three times weekly pickup, Family-friendly scheduling",
      PartnerSince: "2020-08-05",
      Status: "Active",
      Doctors: 2,
      RecentCases: 6
    }
  ]);

  public practices$ = this.practicesSubject.asObservable();

  constructor() {}

  getPractices(): Observable<Practice[]> {
    return this.practices$;
  }

  addPractice(practice: Omit<Practice, 'PracticeID'>): void {
    const currentPractices = this.practicesSubject.value;
    const newId = Math.max(...currentPractices.map(p => p.PracticeID)) + 1;
    
    const newPractice: Practice = {
      ...practice,
      PracticeID: newId
    };

    this.practicesSubject.next([...currentPractices, newPractice]);
  }

  searchPractices(searchTerm: string): Practice[] {
    const allPractices = this.practicesSubject.value;
    
    if (!searchTerm.trim()) {
      return allPractices;
    }

    const term = searchTerm.toLowerCase();
    return allPractices.filter(practice => 
      practice.Name.toLowerCase().includes(term) ||
      practice.CompanyName.toLowerCase().includes(term) ||
      (practice.Email && practice.Email.toLowerCase().includes(term)) ||
      practice.Phone.includes(term) ||
      practice.Address.toLowerCase().includes(term)
    );
  }

  getStats(): PracticeStats {
    const practices = this.practicesSubject.value;
    
    return {
      totalPractices: practices.length,
      activePractices: practices.filter(p => p.Status === 'Active').length,
      totalDoctors: practices.reduce((total, practice) => total + practice.Doctors, 0),
      recentWork: practices.reduce((total, practice) => total + practice.RecentCases, 0)
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