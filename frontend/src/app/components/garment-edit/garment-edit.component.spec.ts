import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentEditComponent } from './garment-edit.component';

describe('GarmentEditComponent', () => {
  let component: GarmentEditComponent;
  let fixture: ComponentFixture<GarmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarmentEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
