import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPswd } from './forgot-pswd';

describe('ForgotPswd', () => {
  let component: ForgotPswd;
  let fixture: ComponentFixture<ForgotPswd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPswd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPswd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
