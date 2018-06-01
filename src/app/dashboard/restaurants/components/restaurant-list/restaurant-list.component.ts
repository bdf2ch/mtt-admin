import { Component, OnInit } from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {

  constructor(public readonly restaurantsService: RestaurantsService) {}

  ngOnInit() {
  }

}
