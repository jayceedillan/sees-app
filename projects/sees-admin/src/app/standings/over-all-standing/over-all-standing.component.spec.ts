import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverAllStandingComponent } from './over-all-standing.component';

describe('OverAllStandingComponent', () => {
  let component: OverAllStandingComponent;
  let fixture: ComponentFixture<OverAllStandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverAllStandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverAllStandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
