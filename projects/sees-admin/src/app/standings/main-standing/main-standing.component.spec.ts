import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStandingComponent } from './main-standing.component';

describe('MainStandingComponent', () => {
  let component: MainStandingComponent;
  let fixture: ComponentFixture<MainStandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainStandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainStandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
