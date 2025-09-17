import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Patient, NewPatient, Statistics } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']


})
 export class PatientListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  // Data properties
  patients: Patient[] = [];
  displayedPatients: Patient[] = [];
  statistics: Statistics = {
    totalPatients: 0,

  };
  doctors: string[] = [];
  practices: string[] = [];

  // Filter properties
  searchTerm = '';
  selectedDoctor = '';
  selectedPractice = '';
  selectedStatus = '';

  // Modal properties
  showAddPatientModal = false;
  showSuccessAlert = false;
  showInfoAlert = true;
  newPatientForm: FormGroup;
  progressPercentage = 0;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {
    this.newPatientForm = this.createNewPatientForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFormProgressTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.patientService.getPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.patients = patients;
        this.displayedPatients = [...patients];
        this.statistics = this.patientService.getStatistics();
        this.animateStats();
      });
  }

  private createNewPatientForm(): FormGroup {
    return this.formBuilder.group({
      Name: ['', Validators.required],
      BirthDate: [''],
      ShadeID: ['', Validators.maxLength(10)],
      HealthInsiranceNumber: ['', Validators.maxLength(20)],
      Phone: [''],
      Email: ['', Validators.email],
    });
  }

  private setupFormProgressTracking(): void {
    this.newPatientForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateProgress();
      });
  }

  // Filtering methods
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filterPatients();
  }

  onDoctorFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDoctor = target.value;
    this.filterPatients();
  }

  onPracticeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPractice = target.value;
    this.filterPatients();
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.filterPatients();
  }

  private filterPatients(): void {
    this.displayedPatients = this.patients.filter(patient => {
      const matchesSearch = !this.searchTerm ||
        patient.name.toLowerCase().includes(this.searchTerm) ||
        patient.phone?.includes(this.searchTerm) ||
        patient.email?.toLowerCase().includes(this.searchTerm) ||
        patient.cases?.some(case_ =>
          case_.type.toLowerCase().includes(this.searchTerm) ||
          case_.status.toLowerCase().includes(this.searchTerm)
        );

      const matchesStatus = !this.selectedStatus || patient.cases?.some(case_ => case_.status === this.selectedStatus);

      return matchesSearch && matchesStatus;
    });
  }

  // Utility methods
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

  getShortPracticeName(practiceName: string): string {
    return practiceName
      .replace(' Clinic', '')
      .replace(' Center', '')
      .replace(' Practice', '')
      .replace(' Care', '');
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Patient actions
  viewPatientDetails(patientId: number): void {
    const patient = this.patients.find(p => p.patientID === patientId);
    if (patient) {
      const casesList = patient.cases?.map(case_ =>
        `• ${case_.type} (${case_.tooth}) - ${case_.status.toUpperCase()} - Due: ${this.formatDate(case_.date)}`
      ).join('\n');

      alert(`👤 Patient Details: ${patient.name}\n\nBirth date: ${patient.birthDate
      }\nPhone: ${patient.phone}\nEmail: ${patient.email}\n\nCases:\n${casesList}\n\nThis would open the detailed patient profile with complete case history, photos, and notes.`);
    }
  }

  viewPatientProfile(event: Event, patientId: number): void {
    event.stopPropagation();
    const patient = this.patients.find(p => p.patientID === patientId);
    if (patient) {
      alert(`👤 Opening full profile for ${patient.name}\n\n\nThis would show:\n• Complete patient information\n• Medical and dental history\n• All cases and treatments\n• Contact and insurance details\n• Treatment timeline\n• Photos and documentation\n• Communication history\n\nRedirecting to patient profile page...`);
    }
  }

  addNewCase(event: Event, patientId: number): void {
    event.stopPropagation();
    const patient = this.patients.find(p => p.patientID === patientId);
    if (patient) {
      alert(`➕ Adding new case for ${patient.name}\n\n\nThis would open the case creation form with:\n• Case type selection\n• Tooth/area specification\n• Material preferences\n• Timeline and priority\n• Special instructions\n• Photos and impressions`);
    }
  }

  // Modal methods
  openAddPatientModal(): void {
    this.showAddPatientModal = true;
    this.showSuccessAlert = false;
    this.showInfoAlert = true;
    setTimeout(() => {
      const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
      firstNameInput?.focus();
    }, 100);
  }

  closeModal(): void {
    if (this.newPatientForm.dirty) {
      if (confirm('Are you sure you want to close? Any entered information will be lost.')) {
        this.showAddPatientModal = false;
        this.resetForm();
      }
    } else {
      this.showAddPatientModal = false;
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newPatientForm.reset();
    this.updateProgress();
    this.showSuccessAlert = false;
    this.showInfoAlert = true;
  }

  onSubmit(): void {
    if (this.newPatientForm.valid) {
      const newPatient: NewPatient = this.newPatientForm.value;
      this.patientService.addPatient(newPatient);
      
      this.showInfoAlert = false;
      this.showSuccessAlert = true;
      
      setTimeout(() => {
        if (confirm('Patient created successfully! 🎉\n\nWould you like to add another patient?')) {
          this.resetForm();
        } else {
          this.closeModal();
        }
      }, 2000);
    }
  }

  private updateProgress(): void {
    const formValue = this.newPatientForm.value;
    const requiredFields = ['firstName', 'lastName'];
    const optionalFields = ['dateOfBirth', 'gender', 'toothShade', 'insurance', 'phone', 'email', 'notes'];
    const allFields = [...requiredFields, ...optionalFields];
    
    let filledFields = 0;
    allFields.forEach(fieldName => {
      const value = formValue[fieldName];
      if (value && value.toString().trim() !== '') {
        filledFields++;
      }
    });
    
    this.progressPercentage = (filledFields / allFields.length) * 100;
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    input.value = value;
    this.newPatientForm.patchValue({ phone: value });
  }

  getCharacterCount(fieldName: string): string {
    const control = this.newPatientForm.get(fieldName);
    const value = control?.value || '';
    const maxLength = fieldName === 'insurance' ? 20 : fieldName === 'notes' ? 2048 : 10;
    return `${value.length}/${maxLength}`;
  }

  getCharacterCountColor(fieldName: string): string {
    const control = this.newPatientForm.get(fieldName);
    const value = control?.value || '';
    const maxLength = fieldName === 'insurance' ? 20 : fieldName === 'notes' ? 2048 : 10;
    const percentage = value.length / maxLength;
    
    if (percentage > 0.9) return '#dc3545';
    if (percentage > 0.7) return '#856404';
    return '#197CAE';
  }

  goHome(): void {
    alert('🔙 Returning to dashboard...');
  }

  private animateStats(): void {
    // This would be implemented with animations in a real Angular app
    // For now, just set the values directly
  }
}