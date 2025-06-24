import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

login() {
  
  this.http.post<{ accessToken: string }>('http://localhost:3000/api/auth/login', {
    username: this.username.trim(),  
    password: this.password ,
    
  }).subscribe({
    next: (res) => {
      
      localStorage.setItem('token', res.accessToken);  
      this.authService.login(res.accessToken);
      this.router.navigate(['/home'],{replaceUrl:true}); 
    },
    error: () => {
      this.error = 'Invalid credentials';
    }
  });
}


}
