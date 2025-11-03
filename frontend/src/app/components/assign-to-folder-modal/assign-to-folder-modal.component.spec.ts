import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToFolderModalComponent } from './assign-to-folder-modal.component';

describe('AssignToFolderModalComponent', () => {
  let component: AssignToFolderModalComponent;
  let fixture: ComponentFixture<AssignToFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignToFolderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignToFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
