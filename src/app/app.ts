import { Component, NgModule, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorsListComponent } from './components/doctor/doctorslist.component';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DoctorsListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css', 
})

export class App {
  protected readonly title = signal('my-angular-app');
}


