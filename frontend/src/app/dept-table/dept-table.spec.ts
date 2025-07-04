import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptTable } from './dept-table';

describe('DeptTable', () => {
  let component: DeptTable;
  let fixture: ComponentFixture<DeptTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
