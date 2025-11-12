import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfitDetailComponent } from './outfit-detail.component';

describe('OutfitDetailComponent', () => {
  let component: OutfitDetailComponent;
  let fixture: ComponentFixture<OutfitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutfitDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutfitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
