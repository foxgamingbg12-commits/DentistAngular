export interface Practice {
  PracticeID: number;
  Name: string;
  CompanyName: string;
  Address: string;
  Phone: string;
  Email?: string;
  TaxID?: string;
  OpeningHours?: string;
  DeliveryMethod?: string;
  PartnerSince: string;
  Status: string;
  Doctors: number;
  RecentCases: number;
}

export interface PracticeStats {
  totalPractices: number;
  activePractices: number;
  totalDoctors: number;
  recentWork: number;
}