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
    /*
    switch (index) {
      case 'company':
        this.router.navigate(['company']).then(() => {
          this.selectedMenu = 'company';
        });
        break;
      case 'restaurants':
        this.router.navigate(['restaurants']).then(() => {
          this.selectedMenu = 'restaurants';
        });
        break;
      case 'users':
        this.router.navigate(['users']).then(() => {
          this.selectedMenu = 'users';
        });
        break;
      case 'roles':
        console.log(this.route);
        this.router.navigateByUrl('/users/roles').then(() => {
          this.selectedMenu = 'roles';
          console.log('succeed');
        });
        break;
      case 'log-out':
        this.logOut();
        break;
    }
    */
  }

  logOut() {
    console.log('logout');
    this.authenticationService.logOut();
    this.router.navigate(['/auth']);
  }
}
