import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityTableComponent } from './community-table.component';

describe('CommunityTableComponent', () => {
  let component: CommunityTableComponent;
  let fixture: ComponentFixture<CommunityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
