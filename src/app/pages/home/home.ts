import { Component, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterModule } from "@angular/router";
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
      .getAverageRating(restaurantId)
      .subscribe((avgRating) => {
        this.restaurants.update((restaurants) =>
          restaurants!.map((r) =>
            r.id === restaurantId ? { ...r, rating: avgRating } : r,
          ),
        );
      });
  }
}
