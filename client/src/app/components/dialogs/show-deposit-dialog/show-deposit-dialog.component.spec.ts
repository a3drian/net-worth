import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDepositDialogComponent } from './show-deposit-dialog.component';

describe('ShowDepositDialogComponent', () => {
  let component: ShowDepositDialogComponent;
  let fixture: ComponentFixture<ShowDepositDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDepositDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDepositDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
