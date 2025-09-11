import { Component, NgModule, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PracticesListComponent } from './components/practice/practice';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PracticesListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css', 
})

export class App {
  protected readonly title = signal('my-angular-app');
}


