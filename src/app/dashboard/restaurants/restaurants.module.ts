import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElModule } from 'element-angular';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantsResolveGuard } from './guards/restaurants-resolve.guard';
import { RestaurantsResource } from './resources/restaurants.resource';
import { RestaurantsService } from './services/restaurants.service';

@NgModule({
  imports: [
    CommonModule,
    ElModule
  ],
  declarations: [
    RestaurantListComponent
  ],
  providers: [
    RestaurantsResource,
    RestaurantsService,
    RestaurantsResolveGuard
  ],
  exports: [
    RestaurantListComponent
  ]
})
export class RestaurantsModule { }
