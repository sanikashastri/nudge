import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-add-group',
    templateUrl: './add-group.component.html',
    styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
    user: Object;
    name: String;
    admin: String;

    constructor(private authService: AuthService,
                private dialogBox: MatDialogRef<AddGroupComponent>) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;
        },
        err => {
            console.log(err);
            return false;
        });
    }

    onNewGroupSubmit(admin) {
        const group = {
            name: this.name,
            admin: admin
        }

        this.dialogBox.close(group);
    }
}