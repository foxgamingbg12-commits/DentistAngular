import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DoctorsListComponent } from './components/doctor/doctorslist.component';
import { PracticesListComponent } from './components/practice/practice';
import { PatientListComponent } from './components/patients/patient-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'doctor', component: DoctorsListComponent },
  { path: 'practice', component: PracticesListComponent },
  {path: 'patients', component: PatientListComponent},
  { path: '**', redirectTo: '/home' } // Wildcard route (404 page)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }