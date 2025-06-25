import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css'
})
export class Popup implements OnInit {
  employee: any;
  showPopup = false;


  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    console.log("Stored token:", token);

    if (id && token) {
      this.http.get(`http://localhost:3000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: (data) => {
          this.employee = data;
        },
        error: (err) => {
          console.error("Error fetching employee:", err);
        }
      });
    } else {
      console.error("Missing employee ID or token");
    }
  }

  back(){
    this.router.navigate(['/home'],{replaceUrl:true})
  }
}
