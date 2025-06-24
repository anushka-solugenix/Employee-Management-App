import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  postalcode?: string;
  joiningDate: string;
  password: string;
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, this.getAuthHeaders());
  }

  registerEmployee(employee: Employee): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, employee, this.getAuthHeaders());
  }

  updateEmployeeEmail(id: string, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { email }, this.getAuthHeaders());
  }

deleteEmployee(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  
}

  refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string }>('http://localhost:3000/api/auth/token', {
      token: refreshToken
    }).subscribe({
      next: res => localStorage.setItem('token', res.accessToken),
      error: err => {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      }
    });
  }
}
