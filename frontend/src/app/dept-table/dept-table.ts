import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { EmployeeService, Employee } from '../employee.service';

@Component({
  selector: 'app-dept-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './dept-table.html',
  styleUrls: ['./dept-table.css'],
})
export class DeptTable implements OnInit {
  rowData: Employee[] = [];
  currentPage = 1;
  pageSize = 8;
  selectedSortKey = '_id';
  selectedSortOrder = 'desc';
  totalPages: number[] = [];

  columnDefs: ColDef[] = [
    { field: '_id' },
    { field: 'firstname' },
    { field: 'lastname' },
    { field: 'email' },
    { field: 'joiningDate' },
    { field: 'city' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployeesPage(this.currentPage, this.selectedSortKey, this.selectedSortOrder)
      .subscribe({
        next: (res) => {
          this.rowData = res.employees.map((emp) => ({
            ...emp,
            joiningDate: new Date(emp.joiningDate).toLocaleDateString(),
          }));
          this.pageSize = res.pageSize;

          const total = res.totalPages ?? 1;
          this.totalPages = Array.from({ length: total }, (_, i) => i + 1);
        },
        error: (err) => console.error('Error loading employees:', err),
      });
  }

  goToPage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    this.loadEmployees();
  }

  sortChanged(sortKey: string, sortOrder: string): void {
    this.selectedSortKey = sortKey;
    this.selectedSortOrder = sortOrder;
    this.currentPage = 1;
    this.loadEmployees();
  }
}
