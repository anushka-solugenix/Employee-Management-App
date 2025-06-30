import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-forgot-pswd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-pswd.html',
  styleUrl: './forgot-pswd.css'
})

export class ForgotPswd {
  email = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private employeeService: EmployeeService) {}

  validatePasswords() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.employeeService.resetPassword(this.email, this.newPassword).subscribe({
      next: (res) => {
        if (res.error) {
          this.errorMessage = res.error;
        } else {
          this.successMessage = res.message;
          this.newPassword = '';
          this.confirmPassword = '';
        }
      },
      error: (err) => {
        console.error('Reset error:', err);
        this.errorMessage = err.error?.error || 'An error occurred while resetting the password.';
      }
    });
  }
}
