import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  employee: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  title = "Search here";

  Clickhere() {
    console.log('Successfully registered');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      console.log('User is not logged in (no token).');
      return;
    }

    let decoded: any;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return;
    }

    if (!decoded || !decoded.userId) {
      console.error('Token does not contain userId.');
      return;
    }

    const userId = decoded.userId;

    this.http.get(`http://localhost:3000/api/employees/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.employee = data;
      },
      error: (err) => {
        console.error('Failed to load employee:', err);
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
