import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderDetailComponent } from './folder-detail.component';

describe('FolderDetailComponent', () => {
  let component: FolderDetailComponent;
  let fixture: ComponentFixture<FolderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
