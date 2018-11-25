import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    title = 'Nudge';

    constructor(private authService: AuthService,
                private router: Router,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    onLogoutClick() {
      this.authService.logout();
      this.snackBar.open('You are logged out', '', {duration: 3000});
      this.router.navigate(['/login']);
      return false;
    }
}