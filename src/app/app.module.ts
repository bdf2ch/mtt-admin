import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ElModule } from 'element-angular';
import { UsersModule } from './dashboard/users/users.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './dashboard/users/components/user-list/user-list.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    {
      path: 'users',
      component: UserListComponent
    }
  ]
}];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ElModule.forRoot(),
    UsersModule
  ],
  exports: [
    ElModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
