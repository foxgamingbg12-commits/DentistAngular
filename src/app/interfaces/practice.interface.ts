export interface Practice {
  practiceID: number;
  name: string;
  companyName: string;
  adress: string;
  phone: string;
  email?: string;
  taxID?: string;
  openingHours?: string;
  deliveryMethod?: string;
  partnerSince: string;
  status: string;
  doctorCount: number;
  caseCount: number;
}

export interface PracticeStats {
  totalPractices: number;
  totalDoctors: number;
  recentWork: number;
}