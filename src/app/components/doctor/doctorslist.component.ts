// src/app/components/doctors-list/doctors-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Doctor, DoctorStats } from '../../interfaces/doctor.interface';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctorslist.component.html',
  styleUrls: ['./doctorslist.component.css']
})
export class DoctorsListComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  displayedDoctors: Doctor[] = [];
  stats: DoctorStats = { totalDoctors: 0, activeDoctors: 0, totalPatients: 0, recentWork: 0 };
  searchTerm: string = '';
  showAddModal: boolean = false;
  
  // Form data
  newDoctor = {
    fullName: '',
    username: '',
    email: '',
    phone: ''
  };
  
  // Modal state
  modalSuccess: boolean = false;
  modalError: boolean = false;
  modalMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(doctors => {
        this.doctors = doctors;
        this.displayedDoctors = [...doctors];
        this.updateStats();
      });
  }

  updateStats(): void {
    this.stats = this.doctorService.getDoctorStats();
  }

  searchDoctors(): void {
    this.displayedDoctors = this.doctorService.searchDoctors(this.searchTerm);
  }

  getInitials(name: string): string {
    return name.split(' ')
              .map(word => word.charAt(0))
              .join('')
              .toUpperCase()
              .slice(1, 3);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    this.newDoctor.phone = value;
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.hideModalMessages();
  }

  closeAddModal(): void {
    if (this.hasFormData() && 
        !confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
      return;
    }
    this.showAddModal = false;
    this.resetForm();
  }

  hasFormData(): boolean {
    return !!(this.newDoctor.fullName.trim() || 
             this.newDoctor.username.trim() || 
             this.newDoctor.email.trim() || 
             this.newDoctor.phone.trim());
  }

  resetForm(): void {
    this.newDoctor = {
      fullName: '',
      username: '',
      email: '',
      phone: ''
    };
    this.hideModalMessages();
  }

  hideModalMessages(): void {
    this.modalSuccess = false;
    this.modalError = false;
    this.modalMessage = '';
  }

  showModalSuccess(message: string): void {
    this.hideModalMessages();
    this.modalSuccess = true;
    this.modalMessage = message;
  }

  showModalError(message: string): void {
    this.hideModalMessages();
    this.modalError = true;
    this.modalMessage = message;
  }

  onSubmit(): void {
    // Basic validation
    const requiredFields = ['fullName', 'username', 'email', 'phone'];
    const missingField = requiredFields.find(field => !this.newDoctor[field as keyof typeof this.newDoctor]?.trim());
    
    if (missingField) {
      this.showModalError(`Please fill in the required field: ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newDoctor.email)) {
      this.showModalError('Please enter a valid email address.');
      return;
    }

    // Username validation
    if (!/^[a-zA-Z0-9._-]+$/.test(this.newDoctor.username)) {
      this.showModalError('Username can only contain letters, numbers, dots, hyphens, and underscores.');
      return;
    }

    this.showModalSuccess('Creating doctor profile...');

    // Simulate API call
    setTimeout(() => {
      const doctor: Doctor = {
        doctorID: this.doctorService.generateDoctorId(),
        name: this.newDoctor.fullName,
        nickName: this.newDoctor.username,
        email: this.newDoctor.email,
        phone: this.newDoctor.phone,
        practice: "To Be Assigned",
        specialty: "General Dentistry",
        startDate: new Date().toISOString().split('T')[0],
        patients: []
      };

      this.doctorService.addDoctor(doctor);
      this.showModalSuccess(`${doctor.name} has been successfully added to the network!`);

      setTimeout(() => {
        this.closeAddModal();
      }, 2000);
    }, 1500);
  }

  viewDoctorDetails(doctor: Doctor): void {
    alert(`👨‍⚕️ Doctor Profile: ${doctor.name}\n\nFull Details:\n• Nickname: "${doctor.nickName}"\n• Email: ${doctor.email}\n• Phone: ${doctor.phone}\n• Practice: ${doctor.practice}\n• Specialty: ${doctor.specialty || 'General Dentistry'}\n• Partner Since: ${this.formatDate(doctor.startDate)}\n• Total Patients: ${doctor.patients ? doctor.patients.length : 0}`);
  }

  goBack(): void {
    alert('🏠 Returning to main dashboard...');
  }
}