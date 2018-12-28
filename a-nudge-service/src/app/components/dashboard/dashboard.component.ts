import { Component, OnInit, group } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddGroupComponent } from '../add-group/add-group.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    user: Object;
    group: Object;
    groups: any;
    dialogBox_addGroup: MatDialogRef<AddGroupComponent>;

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private validateService: ValidateService,
                private authService: AuthService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;

            this.authService.getGroups(this.user["name"]).subscribe(groups => {
                this.groups = groups.groups;
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

    addMember(event: MatChipInputEvent, group) {
        const input = event.input;
        const value = event.value;
        
        if (!this.validateService.validateEmail(value)) {
            this.snackBar.open('Please use a valid email', '', {duration: 3000});
            return false;
        }

        const member = {
            email: value
        }

        this.authService.authenticateMember(member).subscribe(data => {
            if (!data.success) {
                this.snackBar.open('User does not exist', '', {duration: 3000});
            } else {
                if ((value || '').trim()) {
                    group["members"].push(value.trim());
                }
        
                if (input) {
                    input.value = '';
                }
            }
        });
    }

    removeMember(group, member): void {
        const index = group["members"].indexOf(member);

        if (index > 0) {
            group["members"].splice(index, 1);
        } else {
            this.snackBar.open('Cannot remove admin', '', {duration: 3000});
        }
    }

    onNewGroup() {
        this.dialogBox_addGroup = this.dialog.open(AddGroupComponent, {width: '25%'});

        this.dialogBox_addGroup.afterClosed().subscribe(result => {
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

    onUpdateSubmit(group) {
        this.group = JSON.stringify(group);

        if (!this.validateService.validateGroup(group)) {
            this.snackBar.open('Please fill in all fields', '', {duration: 3000});
            return false;
        }

        this.authService.updateGroup(this.group).subscribe(data => {
            if (data.success) {
                this.ngOnInit();
                this.snackBar.open('Your group has been updated', '', {duration: 3000});
            } else {
                this.snackBar.open('Something went wrong', '', {duration: 3000});
            }
        });
    }
}
