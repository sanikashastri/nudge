import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddGroupComponent } from '../add-group/add-group.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    user: Object;
    group: Object;
    groups: any;
    dialogBox: MatDialogRef<AddGroupComponent>;

    constructor(private authService: AuthService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;

            this.authService.getGroups(this.user["name"]).subscribe(groups => {
                this.groups = groups.groups
            },
            err => {
                console.log(err);
                return false;
            });
        },
        err => {
            console.log(err);
            return false;
        });
    }

    onNewGroup() {
        this.dialogBox = this.dialog.open(AddGroupComponent, {width: '25%'});

        this.dialogBox.afterClosed().subscribe(result => {
            this.group = JSON.stringify(result);

            this.authService.createGroup(this.group).subscribe(data => {
                if (data.success) {
                    this.ngOnInit();
                    this.snackBar.open('Your group has been created', '', {duration: 3000});
                } else {
                    this.snackBar.open('Something went wrong', '', {duration: 3000});
                }
            });
        });
    }
}