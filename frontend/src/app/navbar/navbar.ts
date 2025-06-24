import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private authService: AuthService, private router:Router){}
  title="Search here";
    Clickhere(){
    console.log('Successfully registered');
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login'],{replaceUrl:true})
  }
}
