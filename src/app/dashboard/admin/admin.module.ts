import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { AdminResolveGuard } from './guards/admin.resolve.guard';
import { ElModule } from 'element-angular';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    ElModule
  ],
  declarations: [
    AdminComponent,
    SearchPipe
  ],
  providers: [
    AdminResolveGuard
  ]
})
export class AdminModule { }
