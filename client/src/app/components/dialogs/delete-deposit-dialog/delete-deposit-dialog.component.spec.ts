import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDepositDialogComponent } from './delete-deposit-dialog.component';

describe('DeleteDepositDialogComponent', () => {
  let component: DeleteDepositDialogComponent;
  let fixture: ComponentFixture<DeleteDepositDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDepositDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDepositDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
