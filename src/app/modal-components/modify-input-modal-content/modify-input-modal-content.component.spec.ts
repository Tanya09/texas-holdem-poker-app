import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyInputModalContentComponent } from './modify-input-modal-content.component';

describe('ModifyInputModalContentComponent', () => {
  let component: ModifyInputModalContentComponent;
  let fixture: ComponentFixture<ModifyInputModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyInputModalContentComponent ]
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
