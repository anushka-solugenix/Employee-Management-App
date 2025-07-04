import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isAuthPage: boolean = false;

  shouldShowNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register', '/popup', '/forgot-pswd'];
    return !hiddenRoutes.some(route => this.router.url.startsWith(route));
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/login') {
        history.pushState(null, '', location.href);
        window.onpopstate = () => {
          history.pushState(null, '', location.href);
        };
      } else {
        window.onpopstate = null;
      }
    });
  }
}
