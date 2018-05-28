import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { ElModule } from 'element-angular';
import { AuthenticationModule } from './dashboard/authentication/authentication.module';
import { UsersModule } from './dashboard/users/users.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './dashboard/users/components/user-list/user-list.component';
import { LogInComponent } from './dashboard/authentication/components/log-in/log-in.component';

const routes: Routes = [
  {
    path: 'auth',
    component: LogInComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent
      }
    ]
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
