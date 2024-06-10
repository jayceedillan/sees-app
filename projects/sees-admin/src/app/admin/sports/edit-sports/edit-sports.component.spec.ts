import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSportsComponent } from './edit-sports.component';

describe('EditSportsComponent', () => {
  let component: EditSportsComponent;
  let fixture: ComponentFixture<EditSportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
