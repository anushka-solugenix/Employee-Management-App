import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule, CommonModule,RouterLink]
})
export class Register implements OnInit {
  constructor(private router: Router, private empService: EmployeeService, private http: HttpClient) {}

  ngOnInit(): void {}

  @ViewChild('regform') form!: NgForm;
  onRegistration(form: NgForm) {
    const formData = form.value;

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phno: formData.phno,
      dob: formData.dob,
      gender: formData.gender,
      street1: formData.street1,
      street2: formData.street2,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      postalcode: formData.postalcode,
      password: formData.password  
    };

    this.http.post('http://localhost:3000/api/auth/register', payload)
      .subscribe({
        next: () => {
          alert('Registered successfully!\nEmail sent');
          form.reset();
          this.router.navigate(['/login']); 
        },
        error: () => {
          alert('Registration failed.');
        }
      });
  }
}
