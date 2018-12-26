import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'app-add-group',
    templateUrl: './add-group.component.html',
    styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
    user: Object;
    name: String;
    admin: String;

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    members: String[] = [];

    constructor(private validateService: ValidateService,
                private authService: AuthService,
                private snackBar: MatSnackBar,
                private dialogBox: MatDialogRef<AddGroupComponent>) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;
            this.members.push(this.user["email"].trim());
        },
        err => {
            console.log(err);
            return false;
        });
    }
    
    addMember(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;
        
        if (!this.validateService.validateEmail(value)) {
            this.snackBar.open('Please use a valid email', '', {duration: 3000});
            return false;
        }

        if ((value || '').trim()) {
            this.members.push(value.trim());
        }

        if (input) {
            input.value = '';
        }
    }

    removeMember(member): void {
        const index = this.members.indexOf(member);

        if (index > 0) {
            this.members.splice(index, 1);
        } else {
            this.snackBar.open('Cannot remove admin', '', {duration: 3000});
        }
    }

    onNewGroupSubmit(admin) {
        const group = {
            name: this.name,
            admin: admin,
            members: this.members
        }

        if (!this.validateService.validateGroup(group)) {
            this.snackBar.open('Please fill in all fields', '', {duration: 3000});
            return false;
        }

        this.dialogBox.close(group);
    }
}
