import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticesListComponent } from './practice';

describe('Practice', () => {
  let component: PracticesListComponent;
  let fixture: ComponentFixture<PracticesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
