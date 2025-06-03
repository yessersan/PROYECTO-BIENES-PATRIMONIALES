import { Component } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error: string | null = null;

  
constructor(private apiService: ApiService, private router: Router) {}

login() {
  this.apiService.login(this.credentials).subscribe({
    next: (response) => {
      localStorage.setItem('token', response.token);
      console.log('Login successful', response);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.error = 'Login failed: ' + (err.error?.message || 'Unknown error');
    }
  });
}
goToRegistro() {
  this.router.navigate(['/registro']);
}

}