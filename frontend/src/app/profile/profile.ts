import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  employee: any = {};
  isEditing = false;
  showPopup = false;
  selectedFile: File | null = null;

  constructor(private employeeService: EmployeeService, private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;

    this.employeeService.getEmployeeById(userId).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (err) => {
        console.error('Failed to load employee data:', err);
        alert('Could not load profile.');
      }
    });
  }

  setEditMode() {
    this.isEditing = true;
  }

  saveAll() {
    this.isEditing = false;
    this.employeeService.updateEmployee(this.employee._id, this.employee).subscribe({
      next: () => {
        alert('Profile updated successfully');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update profile');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadImage();
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('userimage', this.selectedFile); 

    this.employeeService.updateEmployee(this.employee._id, formData).subscribe({
      next: () => {
        alert('Image uploaded successfully');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Image upload failed');
      }
    });
  }
}
