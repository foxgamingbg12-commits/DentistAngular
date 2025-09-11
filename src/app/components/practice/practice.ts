import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Practice, PracticeStats } from '../../interfaces/practice.interface';
import { PracticeService } from '../../services/practice.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-practices-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'practice.html',
  styleUrls: ['practice.css']
})
export class PracticesListComponent implements OnInit, OnDestroy {
  practices: Practice[] = [];
  displayedPractices: Practice[] = [];
  stats: PracticeStats = {
    totalPractices: 0,
    activePractices: 0,
    totalDoctors: 0,
    recentWork: 0
  };
  
  searchTerm: string = '';
  showModal: boolean = false;
  modalSuccessMessage: string = '';
  modalErrorMessage: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  newPracticeForm: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(
    private practiceService: PracticeService,
    private fb: FormBuilder
  ) {
    this.newPracticeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPractices();
    this.updateStats();
    // console.log(this.practices);
    // console.log(this.displayedPractices);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(1024)]],
      companyName: ['', [Validators.required, Validators.maxLength(1024)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.maxLength(1024)]],
      taxId: ['', [Validators.maxLength(1024)]],
      openingHours: ['', [Validators.maxLength(100)]],
      deliveryMethod: ['', [Validators.maxLength(200)]]
    });
  }

  private loadPractices(): void {
    this.practiceService.getPractices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(practices => {
        this.practices = practices;
        this.displayedPractices = [...practices];
      });
  }

  private updateStats(): void {
    this.stats = this.practiceService.getStats();
  }

  onSearch(): void {
    this.displayedPractices = this.practiceService.searchPractices(this.searchTerm);
  }

  openModal(): void {
    this.showModal = true;
    this.hideModalMessages();
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    if (this.hasFormData() && 
        !confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
      return;
    }
    this.showModal = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
  }

  private hasFormData(): boolean {
    const formValues = this.newPracticeForm.value;
    return Object.values(formValues).some(value => 
      typeof value === 'string' && value.trim() !== ''
    );
  }

  resetForm(): void {
    this.newPracticeForm.reset();
    this.hideModalMessages();
  }

  private hideModalMessages(): void {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  }

  private showModalSuccess(message: string): void {
    this.hideModalMessages();
    this.modalSuccessMessage = message;
    this.showSuccessMessage = true;
  }

  private showModalError(message: string): void {
    this.hideModalMessages();
    this.modalErrorMessage = message;
    this.showErrorMessage = true;
  }

  onPhoneInput(event: any): void {
    const formatted = this.practiceService.formatPhoneNumber(event.target.value);
    this.newPracticeForm.patchValue({ phone: formatted });
  }

  onSubmit(): void {
    if (!this.newPracticeForm.valid) {
      this.showModalError('⚠ Please check the form for errors and try again.');
      return;
    }

    const formData = this.newPracticeForm.value;

    // Email validation (if provided)
    if (formData.email && !this.practiceService.isValidEmail(formData.email)) {
      this.showModalError('⚠ Please enter a valid email address.');
      return;
    }

    // Phone validation
    if (!this.practiceService.isValidPhone(formData.phone)) {
      this.showModalError('⚠ Please enter a valid phone number.');
      return;
    }

    this.showModalSuccess('✅ Registering practice...');

    // Simulate API call
    setTimeout(() => {
      const newPractice = {
        ...formData,
        PartnerSince: new Date().toISOString().split('T')[0],
        Status: 'Active',
        Doctors: 0,
        RecentCases: 0
      };

      this.practiceService.addPractice(newPractice);
      this.updateStats();
      
      this.showModalSuccess(`✅ ${newPractice.name} has been successfully registered!`);
      
      // Close modal after success
      setTimeout(() => {
        this.closeModal();
      }, 2000);
      
    }, 1500);
  }

  viewPracticeDetails(practice: Practice): void {
    const details = `🏥 Practice Profile: ${practice.Name}\n\n` +
                   `Full Details:\n` +
                   `• Company: ${practice.CompanyName}\n` +
                   `• Email: ${practice.Email || 'Not provided'}\n` +
                   `• Phone: ${practice.Phone}\n` +
                   `• Address: ${practice.Address}\n` +
                   `• Tax ID: ${practice.TaxID || 'Not provided'}\n` +
                   `• Partner Since: ${this.practiceService.formatDate(practice.PartnerSince)}\n` +
                   `• Total Doctors: ${practice.Doctors}\n` +
                   `• Recent Cases: ${practice.RecentCases}`;
    
    alert(details);
  }

  goBack(): void {
    alert('🏠 Returning to main dashboard...');
  }

  getInitials(name: string): string {
    return this.practiceService.getInitials(name);
  }

  formatDate(dateString: string): string {
    return this.practiceService.formatDate(dateString);
  }
}