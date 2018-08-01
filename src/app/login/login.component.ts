import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    userName: string;

    constructor(private router: Router) {
        this.userName = '';
    }

    ngOnInit() {}

    gotoMainPage() {
        // Set localstorage data
        if (this.userName.replace(/' '/g, '').length > 0) {
            localStorage.setItem('isLoggedin', 'true');
            localStorage.setItem('athlete', this.userName);
            this.router.navigate(['main']);
        }
    }
}
