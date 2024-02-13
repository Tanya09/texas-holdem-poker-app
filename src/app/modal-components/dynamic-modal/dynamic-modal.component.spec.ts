import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModalComponent } from './dynamic-modal.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DynamicModalComponent', () => {
  let component: DynamicModalComponent;
  let fixture: ComponentFixture<DynamicModalComponent>;
  const matDialogDataMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicModalComponent ],
      providers: [
        // Provide a mock version of MatDialogRef
        { provide: MatDialogRef, useValue: matDialogDataMock  }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
