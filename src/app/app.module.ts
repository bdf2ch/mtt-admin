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
import { CompanyModule } from './dashboard/company/company.module';
import { RestaurantsModule} from './dashboard/restaurants/restaurants.module';
import { SurveysModule } from './dashboard/surveys/surveys.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './dashboard/users/components/user-list/user-list.component';
import { LogInComponent } from './dashboard/authentication/components/log-in/log-in.component';
import { UserListGuard } from './dashboard/users/guards/user-list.guard';
import { CompanyComponent } from './dashboard/company/components/company/company.component';
import { CompanyResolveGuard } from './dashboard/company/guards/company-resolve.guard';
import { RestaurantListComponent } from './dashboard/restaurants/components/restaurant-list/restaurant-list.component';
import { RestaurantsResolveGuard } from './dashboard/restaurants/guards/restaurants-resolve.guard';
import { RolesListComponent } from './dashboard/users/components/roles-list/roles-list.component';
import { UsersComponent } from './dashboard/users/components/users/users.component';
import { SurveysComponent } from './dashboard/surveys/components/surveys/surveys.component';
import { SurveysListComponent } from './dashboard/surveys/components/surveys-list/surveys-list.component';
import { RoleListGuard } from './dashboard/users/guards/role-list.guard';
import { RewardsListComponent } from './dashboard/surveys/components/rewards-list/rewards-list.component';
import { RewardsResolveGuard } from './dashboard/surveys/guards/rewards-resolve.guard';
import { SurveysResolveGuard } from './dashboard/surveys/guards/surveys-resolve.guard';
import { SurveyComponent } from './dashboard/surveys/components/survey/survey.component';
import { SurveyResolveGuard } from './dashboard/surveys/guards/survey-resolve.guard';
import { AuthGuard } from './dashboard/authentication/guards/can-activate.guard';
import { AdminComponent } from './dashboard/admin/components/admin/admin.component';
import { AdminModule } from './dashboard/admin/admin.module';
import { AdminResolveGuard } from './dashboard/admin/guards/admin.resolve.guard';
import { TestComponent } from './dashboard/test/test.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportComponent } from './dashboard/surveys/components/report/report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [UserSessionGuard],
    children: [
      {
        path: '',
        redirectTo: 'surveys',
        pathMatch: 'full'
      },
      {
        path: 'surveys',
        component: SurveysComponent,
        resolve: [SurveysResolveGuard],
        children: [
          {
            path: '',
            component: SurveysListComponent
          },
          {
            path: 'rewards',
            component: RewardsListComponent
          },
          {
            path: ':id',
            component: SurveyComponent,
            resolve: [SurveyResolveGuard]
          },
          {
            path: ':id/report',
            component: ReportComponent,
            resolve: [SurveyResolveGuard]
          }
        ]
      },
      {
        path: 'company',
        component: CompanyComponent,
        resolve: [CompanyResolveGuard]
      },
      {
        path: 'restaurants',
        component: RestaurantListComponent,
        resolve: [RestaurantsResolveGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        resolve: [UserListGuard],
        children: [
          {
            path: '',
            component: UserListComponent
          },
          {
            path: 'roles',
            component: RolesListComponent,
            resolve: [RoleListGuard]
          }
        ]
      },
      {
        path: 'admin',
        component: AdminComponent,
        resolve: [
          AdminResolveGuard
        ]
      },
      {
        path: 'pie',
        component: TestComponent
      },
    ]
  },
  {
    path: 'auth',
    component: LogInComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TestComponent
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
    UsersModule,
    CompanyModule,
    RestaurantsModule,
    SurveysModule,
    AdminModule,
    NgxChartsModule
  ],
  exports: [
    ElModule,
    AuthenticationModule
  ],
  providers: [
    UserSessionGuard,
    CompanyResolveGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
