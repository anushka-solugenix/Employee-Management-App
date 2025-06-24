import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
   standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  employees: Employee[] = [];
  nextId = 1;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployees();
    console.log('Sending token:', localStorage.getItem('token'));
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

updateEmail(emp: Employee) {
  if (!emp._id || !emp.email) return;

  this.employeeService.updateEmployeeEmail(emp._id, emp.email).subscribe({
    next: () => {
      emp.editingEmail = false;
      this.fetchEmployees();  
    },
    error: (err) => console.error('Error updating email:', err)
  });
}


deleteEmployee(id: string | undefined) {
  if (!id) return; 

  this.employeeService.deleteEmployee(id).subscribe({
    next: () => this.fetchEmployees(),
    error: (err) => console.error('Error deleting employee:', err)
  });
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
