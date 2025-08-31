// src/app/services/doctor.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor, DoctorStats } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsSubject = new BehaviorSubject<Doctor[]>(this.getInitialDoctors());
  public doctors$ = this.doctorsSubject.asObservable();

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
      doctor.Name.toLowerCase().includes(term) ||
      doctor.NickName.toLowerCase().includes(term) ||
      doctor.Email.toLowerCase().includes(term) ||
      doctor.Phone.includes(term) ||
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
    return Math.max(...doctors.map(d => d.DoctorID)) + 1;
  }

  private getInitialDoctors(): Doctor[] {
    return [
      {
        DoctorID: 1,
        Name: "Dr. Sarah Johnson",
        NickName: "Dr. Sarah",
        Email: "sarah.johnson@dentalclinic.com",
        Phone: "(555) 123-4567",
        practice: "Downtown Dental Clinic",
        joinDate: "2022-03-15",
        specialty: "General Dentistry",
        patients: [
          { name: "Maria Rodriguez", cases: 2, lastWork: "2025-07-30", type: "Crown & Bridge" },
          { name: "Emily Johnson", cases: 2, lastWork: "2025-07-30", type: "Crown & Temporary" },
          { name: "Patricia Williams", cases: 3, lastWork: "2025-07-28", type: "Veneers & Crowns" },
          { name: "Michael Thompson", cases: 1, lastWork: "2025-07-25", type: "Implant Crown" }
        ]
      },
      {
        DoctorID: 2,
        Name: "Dr. Michael Martinez",
        NickName: "Dr. Mike",
        Email: "m.martinez@elitesmile.com",
        Phone: "(555) 234-5678",
        practice: "Elite Smile Center",
        joinDate: "2023-01-20",
        specialty: "Orthodontics",
        patients: [
          { name: "James Thompson", cases: 3, lastWork: "2025-07-29", type: "Implant & Veneers & Night Guard" },
          { name: "Michael Brown", cases: 2, lastWork: "2025-08-08", type: "Full Denture & Reline" },
          { name: "Jennifer Davis", cases: 1, lastWork: "2025-07-22", type: "Bridge (4-unit)" },
          { name: "Robert Wilson", cases: 2, lastWork: "2025-07-20", type: "Partial Denture" }
        ]
      },
      {
        DoctorID: 3,
        Name: "Dr. Lisa Williams",
        NickName: "Dr. Lisa",
        Email: "lisa.williams@perfectteeth.com",
        Phone: "(555) 345-6789",
        practice: "Perfect Teeth Practice",
        joinDate: "2022-08-10",
        specialty: "Pediatric Dentistry",
        patients: [
          { name: "Sarah Kim", cases: 2, lastWork: "2025-07-25", type: "Retainer & Whitening Trays" },
          { name: "Lisa Wang", cases: 2, lastWork: "2025-07-22", type: "Veneers & Composite" },
          { name: "Amanda Miller", cases: 1, lastWork: "2025-07-18", type: "Clear Aligners" },
          { name: "Kevin Martinez", cases: 3, lastWork: "2025-07-15", type: "Orthodontic Appliances" }
        ]
      },
      {
        DoctorID: 4,
        Name: "Dr. David Chen",
        NickName: "Dr. David",
        Email: "d.chen@advancedcare.com",
        Phone: "(555) 456-7890",
        practice: "Advanced Dental Care",
        joinDate: "2023-06-05",
        specialty: "Endodontics",
        patients: [
          { name: "Robert Davis", cases: 3, lastWork: "2025-07-28", type: "Partial Denture & Crown & Inlay" },
          { name: "David Martinez", cases: 2, lastWork: "2025-07-25", type: "Maryland Bridge & Post & Core" },
          { name: "Thomas Anderson", cases: 1, lastWork: "2025-07-20", type: "Implant Crown" }
        ]
      },
      {
        DoctorID: 5,
        Name: "Dr. Jennifer Taylor",
        NickName: "Dr. Jen",
        Email: "jennifer.taylor@familycare.com",
        Phone: "(555) 567-8901",
        practice: "Family Care Dental",
        joinDate: "2022-11-30",
        specialty: "General Dentistry",
        patients: [
          { name: "Emma Johnson", cases: 2, lastWork: "2025-06-15", type: "Space Maintainers" },
          { name: "Noah Williams", cases: 1, lastWork: "2025-06-10", type: "Pediatric Crown" },
          { name: "Olivia Davis", cases: 1, lastWork: "2025-06-05", type: "Fluoride Appliance" }
        ]
      },
      {
        DoctorID: 6,
        Name: "Dr. Robert Anderson",
        NickName: "Dr. Bob",
        Email: "robert.anderson@modernsmile.com",
        Phone: "(555) 678-9012",
        practice: "Modern Smile Studio",
        joinDate: "2023-02-14",
        specialty: "Prosthodontics",
        patients: [
          { name: "Sophia Martinez", cases: 4, lastWork: "2025-05-20", type: "Veneers & Whitening" },
          { name: "Isabella Garcia", cases: 2, lastWork: "2025-05-15", type: "Cosmetic Crowns" },
          { name: "Mason Rodriguez", cases: 1, lastWork: "2025-05-10", type: "Smile Makeover" }
        ]
      },
      {
        DoctorID: 7,
        Name: "Dr. Amanda White",
        NickName: "Dr. Amanda",
        Email: "amanda.white@precisiondental.com",
        Phone: "(555) 789-0123",
        practice: "Precision Dental Group",
        joinDate: "2023-04-22",
        specialty: "Oral Surgery",
        patients: [
          { name: "Ethan Thompson", cases: 2, lastWork: "2025-07-26", type: "Post & Core & Crown" },
          { name: "Ava Wilson", cases: 1, lastWork: "2025-07-20", type: "Endodontic Crown" },
          { name: "Liam Brown", cases: 1, lastWork: "2025-07-15", type: "Root Canal Crown" }
        ]
      },
      {
        DoctorID: 8,
        Name: "Dr. Christopher Lee",
        NickName: "Dr. Chris",
        Email: "chris.lee@summitdental.com",
        Phone: "(555) 890-1234",
        practice: "Summit Dental Care",
        joinDate: "2022-12-08",
        specialty: "Periodontics",
        patients: [
          { name: "Charlotte Davis", cases: 2, lastWork: "2025-07-25", type: "Gum Graft & Crown" },
          { name: "Benjamin Miller", cases: 1, lastWork: "2025-07-18", type: "Perio Maintenance" },
          { name: "Amelia Garcia", cases: 3, lastWork: "2025-07-12", type: "Deep Cleaning & Crowns" }
        ]
      }
    ];
  }
}