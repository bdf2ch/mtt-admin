import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from './authentication/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  selectedMenu: string;

  constructor (private readonly router: Router,
               private readonly route: ActivatedRoute,
               public readonly authenticationService: AuthenticationService) {}

  ngOnInit() {}


  onMenuChange(index: string): void {
    console.log(index);

    switch (index) {
      case 'log-out':
        this.logOut();
        break;
    }
  }

  logOut() {
    console.log('logout');
    this.authenticationService.logOut();
  }
}
