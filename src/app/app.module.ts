import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { ElModule } from 'element-angular';
import { AuthenticationModule } from './dashboard/authentication/authentication.module';
import { UserSessionGuard } from './shared/guards/user-session.guard';
import { UsersModule } from './dashboard/users/users.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './dashboard/users/components/user-list/user-list.component';
import { LogInComponent } from './dashboard/authentication/components/log-in/log-in.component';
import { UserListGuard } from './dashboard/users/guards/user-list.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [UserSessionGuard],
    children: [
      {
        path: 'users',
        component: UserListComponent,
        resolve: [UserListGuard]
      }
    ]
  },
  {
    path: 'auth',
    component: LogInComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ElModule.forRoot(),
    ResourceModule.forRoot(),
    AuthenticationModule,
    UsersModule
  ],
  exports: [
    ElModule,
    AuthenticationModule
  ],
  providers: [
    UserSessionGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
