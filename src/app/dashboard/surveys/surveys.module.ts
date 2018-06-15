import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { ElModule } from 'element-angular';
import { SurveysComponent } from './components/surveys/surveys.component';
import { SurveysListComponent } from './components/surveys-list/surveys-list.component';
import { SurveysResource } from './resources/surveys.resource';
import { SurveysService } from './services/surveys.service';
import { RewardsListComponent } from './components/rewards-list/rewards-list.component';
import { RewardsResolveGuard } from './guards/rewards-resolve.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResourceModule,
    RouterModule,
    ElModule
  ],
  declarations: [
    SurveysComponent,
    SurveysListComponent,
    RewardsListComponent
  ],
  providers: [
    SurveysResource,
    SurveysService,
    RewardsResolveGuard,
    RewardsResolveGuard
  ],
  exports: [
    SurveysComponent,
    SurveysListComponent
  ]
})
export class SurveysModule { }
