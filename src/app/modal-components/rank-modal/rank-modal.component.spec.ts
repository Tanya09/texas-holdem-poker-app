import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { RankModalComponent } from './rank-modal.component';

describe('RankModalComponent', () => {
  let component: RankModalComponent;
  let fixture: ComponentFixture<RankModalComponent>;
  const matDialogDataMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogDataMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
