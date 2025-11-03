import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfitListComponent } from './outfit-list.component';

describe('OutfitListComponent', () => {
  let component: OutfitListComponent;
  let fixture: ComponentFixture<OutfitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutfitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutfitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
