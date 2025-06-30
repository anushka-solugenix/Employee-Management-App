import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
   standalone: true,
  imports:[CommonModule,FormsModule,RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  employees: Employee[] = [];
  nextId = 1;
  selectedSortKey: string = '';
  currentPage = 1;
  pageSize = 5; 
  totalPages = 0;


  constructor(private employeeService: EmployeeService) {}

ngOnInit() {
  this.loadEmployees();
}

loadEmployees(): void {
  this.employeeService.getEmployeesPage(this.currentPage, this.pageSize, this.selectedSortKey)
    .subscribe({
      next: (res: { employees: Employee[], total: number, page: number, totalPages: number }) => {
        this.employees = res.employees.map(emp => ({
          ...emp,
          joiningDate: new Date(emp.joiningDate).toLocaleDateString()
        }));
        this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Error loading employees:', err)
    });
}

sortEmployees(): void {
  this.currentPage = 1;
  this.loadEmployees();
}

fetchEmployees() {
  this.employeeService.getEmployees().subscribe({
    next: (data) => {
      this.employees = data.map(emp => ({
        _id: emp._id,  
        firstname: emp.firstname,
        lastname: emp.lastname,
        email: emp.email,
        joiningDate: new Date(emp.joiningDate).toLocaleDateString(),
        editingEmail: false
      }));
    },
    error: (err) => console.error('Error fetching employees:', err)
  });
}

deleteEmployee(id: string | undefined): void {
  if (!id) return;
  this.employeeService.deleteEmployee(id).subscribe({
    next: () => this.loadEmployees(),
    error: (err) => console.error('Error deleting employee:', err)
  });
}


goToPage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.loadEmployees();
}

}

export interface Employee {
  _id: string; 
  firstname: string;
  lastname: string;
  email: string;
  phno?: string;
  dob?: string;
  gender?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  region?: string;
  editingEmail?: boolean;
  postalcode?: string;
  joiningDate: string;
}
