import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: Object;
    icon = 'lock';

    constructor(private router: Router,
                private validateService: ValidateService,
                private authService: AuthService,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;
        },
        err => {
            console.log(err);
            return false;
        });
    }

    toggleLock() {
        if (this.icon === 'lock') {
            this.icon = 'lock_open';
        } else {
            this.icon = 'lock';
        }
    }

    onUpdateSubmit(user) {
        if (!this.validateService.validateUpdate(user)) {
            this.snackBar.open('Please fill in all fields', '', {duration: 3000});
            return false;
        }

        if (!this.validateService.validateEmail(user.email)) {
            this.snackBar.open('Please use a valid email', '', {duration: 3000});
            return false;
        }

        this.authService.updateUser(this.user).subscribe(data => {
            if (data.success) {
                this.authService.storeUserData(data.token, data.user);
                this.snackBar.open('Your profile has been updated', '', {duration: 3000});
                this.router.navigate(['/profile']);
            } else {
                this.snackBar.open('Something went wrong', '', {duration: 3000});
                this.router.navigate(['/profile']);
            }
        });

        this.icon = 'lock';
    }
}