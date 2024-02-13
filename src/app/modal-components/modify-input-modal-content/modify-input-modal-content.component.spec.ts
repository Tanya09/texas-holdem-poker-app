import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ModifyInputModalContentComponent } from './modify-input-modal-content.component';

describe('ModifyInputModalContentComponent', () => {
  let component: ModifyInputModalContentComponent;
  let fixture: ComponentFixture<ModifyInputModalContentComponent>;
  const matDialogDataMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyInputModalContentComponent ],
      providers: [
        // Provide FormBuilder
        FormBuilder,
        { provide: MatDialogRef, useValue: matDialogDataMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyInputModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
