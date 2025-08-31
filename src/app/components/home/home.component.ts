import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // User data
  userName = 'Стефан Герански';
  userRole = 'Dental Technician - Precision Dental Lab';
  userStatus = 'Active';

  // Stats data
  stats = [
    { number: 80, label: 'Active Lab Orders' },
    { number: 120, label: 'New Messages' },
    { number: 50, label: 'Completed Today' },
    { number: 230, label: 'This Month' }
  ];

  // Dashboard sections
  dashboardSections = [
    { icon: '📋', title: 'Cases', description: 'View and manage laboratory cases', section: 'cases' },
    { icon: '💬', title: 'Messages', description: 'Communicate with dentists', section: 'messages' },
    { icon: '🩺', title: 'Doctors', description: 'View doctors you work with', section: 'doctors' },
    { icon: '👤', title: 'Patients', description: 'Patient case information', section: 'patients' },
    { icon: '🏥', title: 'Practices', description: 'Dental practice partnerships', section: 'practices' },
    { icon: '📊', title: 'Lab Reports', description: 'Production analytics & insights', section: 'reports' }
  ];

  // Recent activity data
  recentActivities = [
    {
      title: 'New lab order received',
      time: '2 hours ago',
      description: 'Crown restoration from Dr. Johnson - Rush order'
    },
    {
      title: 'Message from Dr. Martinez',
      time: '4 hours ago',
      description: 'Question about bridge shade specifications'
    },
    {
      title: 'Lab work completed',
      time: '1 day ago',
      description: 'Orthodontic appliance ready for pickup'
    },
    {
      title: 'New doctor partnership',
      time: '2 days ago',
      description: 'Dr. Williams added to your partner network'
    },
    {
      title: 'Quality check passed',
      time: '3 days ago',
      description: 'Denture set approved for delivery'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.animateStatNumbers();
  }

  startNewCase(): void {
    alert(`🔬 Starting new laboratory work...\n\nThis would open the lab case creation wizard where you can:\n\n• Select work type (Crown, Bridge, Denture, etc.)\n• Review doctor's prescription\n• Upload photos and impressions\n• Set work priority and timeline\n• Add special instructions\n• Begin production workflow`);
  }

  openSection(section: string): void {
    const sectionNames: { [key: string]: string } = {
      'calendar': '📅 Calendar & Delivery Schedule',
      'cases': '📋 Laboratory Cases Management',
      'messages': '💬 Messages & Communication',
      'doctors': '🩺 Doctors Network',
      'patients': '👤 Patient Case Information',
      'practices': '🏥 Dental Practices Network',
      'reports': '📊 Laboratory Reports & Analytics'
    };

    if (section === 'doctors') {
      alert(`🩺 Doctors Network\n\nDoctors you currently work with:\n\n• Dr. Sarah Johnson - General Dentistry\n  📍 Downtown Dental Clinic\n  📊 45 orders this month\n\n• Dr. Michael Martinez - Prosthodontics\n  📍 Elite Smile Center\n  📊 28 orders this month\n\n• Dr. Lisa Williams - Orthodontics\n  📍 Perfect Teeth Practice\n  📊 33 orders this month\n\n• Dr. David Chen - Oral Surgery\n  📍 Advanced Dental Care\n  📊 12 orders this month`);
    } else if (section === 'patients') {
      alert(`👤 Patient Case Information\n\nRecent patient cases you're working on:\n\n• Patient: Maria Rodriguez\n  🦷 Case: Crown restoration (#14)\n  👨‍⚕️ Doctor: Dr. Johnson\n  📅 Due: Tomorrow\n\n• Patient: James Thompson\n  🦷 Case: Bridge (3-unit)\n  👨‍⚕️ Doctor: Dr. Martinez\n  📅 Due: Friday\n\n• Patient: Sarah Kim\n  🦷 Case: Orthodontic retainer\n  👨‍⚕️ Doctor: Dr. Williams\n  📅 Due: Next Monday\n\n• Patient: Robert Davis\n  🦷 Case: Partial denture\n  👨‍⚕️ Doctor: Dr. Chen\n  📅 Due: Next week`);
    } else if (section === 'practices') {
      alert(`🏥 Dental Practices Network\n\nPractices you partner with:\n\n• Downtown Dental Clinic\n  👥 3 dentists, 45 cases/month\n  📍 123 Main St, Downtown\n  📞 (555) 123-4567\n\n• Elite Smile Center\n  👥 5 dentists, 62 cases/month\n  📍 456 Oak Avenue, Midtown\n  📞 (555) 234-5678\n\n• Perfect Teeth Practice\n  👥 2 dentists, 33 cases/month\n  📍 789 Pine Street, Uptown\n  📞 (555) 345-6789\n\n• Advanced Dental Care\n  👥 4 dentists, 28 cases/month\n  📍 321 Elm Road, Westside\n  📞 (555) 456-7890`);
    } else if (section === 'calendar') {
      alert(`📅 Calendar & Delivery Schedule\n\nUpcoming deadlines:\n\n• Today:\n  🦷 Crown restoration (Maria Rodriguez)\n  🦷 Bridge final fitting (James Thompson)\n\n• Tomorrow:\n  🦷 Orthodontic retainer delivery\n  🦷 Denture adjustment appointment\n\n• This Week:\n  📅 3 crown deliveries\n  📅 2 bridge fittings\n  📅 1 denture consultation\n\n• Next Week:\n  📅 5 new case consultations\n  📅 4 delivery appointments\n  📅 2 follow-up fittings`);
    } else if (section === 'cases') {
      alert(`📋 Laboratory Cases Management\n\nActive cases:\n\n• Case #2024-001: Crown Restoration\n  👤 Patient: Maria Rodriguez\n  👨‍⚕️ Dr. Johnson\n  📅 Due: Tomorrow\n  📄 Status: Final polish\n\n• Case #2024-002: 3-Unit Bridge\n  👤 Patient: James Thompson\n  👨‍⚕️ Dr. Martinez\n  📅 Due: Friday\n  📄 Status: Ceramic layering\n\n• Case #2024-003: Orthodontic Retainer\n  👤 Patient: Sarah Kim\n  👨‍⚕️ Dr. Williams\n  📅 Due: Monday\n  📄 Status: Quality check\n\n• Case #2024-004: Partial Denture\n  👤 Patient: Robert Davis\n  👨‍⚕️ Dr. Chen\n  📅 Due: Next week\n  📄 Status: Framework casting`);
    } else {
      alert(`Opening ${sectionNames[section] || section}...\n\nThis would navigate to the ${section} management page with full laboratory functionality.`);
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logging out... This would return you to the login page.');
    }
  }

  viewAllActivity(): void {
    alert('📋 Opening comprehensive activity log...\n\nThis would show:\n• Complete activity history\n• Detailed timestamps\n• Activity filtering options\n• Export functionality\n• Activity analytics');
  }

  private animateStatNumbers(): void {
    setTimeout(() => {
      const statElements = document.querySelectorAll('.stat-number');
      statElements.forEach((element, index) => {
        const finalValue = this.stats[index].number;
        let current = 0;
        const increment = finalValue / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= finalValue) {
            element.textContent = finalValue.toString();
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(current).toString();
          }
        }, 50);
      });
    }, 100);
  }
}