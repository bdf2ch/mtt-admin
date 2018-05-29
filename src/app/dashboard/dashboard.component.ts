import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor (private readonly router: Router,
               public readonly authenticationService: AuthenticationService) {}

  ngOnInit() {}


  onMenuChange(index: string): void {
    console.log(index);
    switch (index) {
      case '6-1':
        this.logOut();
        break;
    }
  }

  logOut() {
    console.log('logout');
    this.authenticationService.logOut();
    this.router.navigate(['/auth']);
  }
}
