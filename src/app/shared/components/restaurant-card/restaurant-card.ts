import { TitleCasePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { RestaurantDTO } from "../../../core/models/restaurant-dto";
import { RestaurantService } from "../../../core/services/restaurant";

@Component({
  selector: "app-restaurant-card",
  imports: [TitleCasePipe, RouterLink],
  templateUrl: "./restaurant-card.html",
  styleUrl: "./restaurant-card.css",
})
export class RestaurantCard {
  private readonly restaurantService = inject(RestaurantService);
  restaurant = model<RestaurantDTO | null>({
    id: "1",
    name: "Blue Lagoon Bistro",
    image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    address: "123 Ocean Drive, Miami, FL",
    cuisine: "Seafood",
    description:
      "A lively seaside destination offering the freshest catches and panoramic ocean views.",
    priceRange: 3,
  });

  hasAction = input<boolean>(false);
  refresh = output<boolean>();

  priceRangeArray = computed(() => {
    const range = this.restaurant()?.priceRange ?? 1;
    return new Array(range).fill(0);
  });

  updateRating(note: number, restaurantId: string) {
    this.restaurantService.updateRating(restaurantId, note).subscribe((res) => {
      this.restaurant.update((rest) => {
        rest!.my_rating = (res.data![0] as RestaurantDTO)?.rating ?? 0;
        return rest;
      });
      this.refresh.emit(true);
    });
  }

  openInMaps(address: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  }
}
