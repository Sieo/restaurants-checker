import { Component, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterModule } from "@angular/router";
import { RestaurantDTO } from "../../core/models/restaurant-dto";
import { RestaurantService } from "../../core/services/restaurant";
import { RestaurantCard } from "../../shared/components/restaurant-card/restaurant-card";

@Component({
  selector: "app-home",
  templateUrl: "./home.html",
  styleUrls: ["./home.css"],
  imports: [RouterModule, RestaurantCard],
})
export class HomeComponent {
  private readonly restaurantService = inject(RestaurantService);

  restaurants = rxResource({
    stream: () => this.restaurantService.getAllRestaurants(),
  });

  onRefresh(restaurantId: string) {
    this.restaurantService
      .getRestaurantById(restaurantId)
      .subscribe((restaurant) => {
        this.restaurants.update((restaurants) =>
          restaurants!.map((r: RestaurantDTO) =>
            r.id === restaurantId ? (restaurant as any) : r,
          ),
        );
      });
  }
}
