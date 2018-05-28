import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { ElModule } from 'element-angular';
import { AuthenticationResource } from './resources/authentication.resource';
import { AuthenticationService } from './services/authentication.service';
import { LogInComponent } from './components/log-in/log-in.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResourceModule.forRoot(),
    ElModule
  ],
  declarations: [
    LogInComponent
  ],
  providers: [
    AuthenticationResource,
    AuthenticationService
  ]
})
export class AuthenticationModule {}
