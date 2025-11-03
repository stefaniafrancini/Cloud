import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentFormComponent } from './garment-form.component';

describe('GarmentFormComponent', () => {
  let component: GarmentFormComponent;
  let fixture: ComponentFixture<GarmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GarmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
