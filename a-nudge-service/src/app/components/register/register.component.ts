import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    name: String;
    email: String;
    username: String;
    password: String;
    confirmPassword: String;

    constructor(private router: Router,
                private validateService: ValidateService,
                private authService: AuthService,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    onRegisterSubmit() {
        const user = {
            name: this.name,
            email: this.email,
            username: this.username,
            password: this.password,
            confirmPassword: this.confirmPassword
        }

        if (!this.validateService.validateRegister(user)) {
            this.snackBar.open('Please fill in all fields', '', {duration: 3000});
            return false;
        }

        if (!this.validateService.validateEmail(user.email)) {
          this.snackBar.open('Please use a valid email', '', {duration: 3000});
          return false;
        }

        this.authService.registerUser(user).subscribe(data => {
            if (data.success) {
                this.snackBar.open('You are now registered and can login', '', {duration: 3000});
                this.router.navigate(['/login']);
            } else {
                this.snackBar.open('Something went wrong', '', {duration: 3000});
                this.router.navigate(['/register']);
            }
        });
    }

}