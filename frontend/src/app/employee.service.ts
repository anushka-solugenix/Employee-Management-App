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
  selected: boolean;
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

getEmployees(page: number = 1, sortBy: string = '_id', sortOrder: string = 'desc') {
  return this.http.get<{
    employees: Employee[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/api/employees?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
}


getEmployeeById(id: string) {
  return this.http.get<any>(
    `http://localhost:3000/api/employees/${id}`,
    this.getAuthHeaders()
  );
}

registerEmployee(employee: Employee): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, employee, this.getAuthHeaders());
}

updateEmployeeEmail(id: string, email: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, { email }, this.getAuthHeaders());
}

updateEmployee(id: string, employee: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, employee, this.getAuthHeaders());
}

deleteEmployee(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  
}

uploadUserImage(id: string, formData: FormData) {
  return this.http.post(
    `http://localhost:3000/api/employees/${id}/uploads`,
    formData,
    this.getAuthHeaders()
  );
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

resetPassword(email: string, newPassword: string) {
return this.http.post<{ message: string, error?: string }>(
  'http://localhost:3000/api/employees/forgot-password',
  { email, newPassword });
}

getEmployeesPage(
  page: number,
  sortBy: string,
  sortOrder: string
): Observable<{
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  return this.http.get<{
    employees: Employee[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(
    `http://localhost:3000/api/employees?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
}

}
