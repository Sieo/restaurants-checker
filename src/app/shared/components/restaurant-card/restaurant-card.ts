import { DatePipe, TitleCasePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  WritableSignal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { filter, switchMap } from "rxjs";
import { RestaurantDTO } from "../../../core/models/restaurant-dto";
import { PopupService } from "../../../core/services/popup.service";
import { RestaurantService } from "../../../core/services/restaurant";

@Component({
  selector: "app-restaurant-card",
  imports: [TitleCasePipe, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: "./restaurant-card.html",
  styleUrl: "./restaurant-card.css",
})
export class RestaurantCard {
  private readonly restaurantService = inject(RestaurantService);
  private readonly fb = inject(FormBuilder);
  private readonly popupService = inject(PopupService);
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
    commentCount: 0,
  });

  hasAction = input<boolean>(false);
  refresh = output<boolean>();

  priceRangeArray = computed(() => {
    const range = this.restaurant()?.priceRange ?? 1;
    return new Array(range).fill(0);
  });

  commentList = computed(() => {
    return this.restaurant()?.comments ?? [];
  });

  displayComments: WritableSignal<boolean> = model(false);

  commentForm = this.fb.group({
    content: ["", Validators.required],
  });

  updateRating(note: number, restaurantId: string) {
    // I didn't rate it before
    if (this.restaurant()?.my_rating === null) {
      this.restaurantService.addRating(restaurantId, note).subscribe((res) => {
        this.restaurant.update((rest) => {
          rest!.my_rating = (res.data![0] as RestaurantDTO)?.rating ?? 0;
          return rest;
        });
        this.refresh.emit(true);
      });
    } else {
      this.restaurantService
        .updateRating(restaurantId, note)
        .subscribe((res) => {
          this.restaurant.update((rest) => {
            rest!.my_rating = (res.data![0] as RestaurantDTO)?.rating ?? 0;
            return rest;
          });
          this.refresh.emit(true);
        });
    }
  }

  openInMaps(address: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  }

  toggleDisplayComments() {
    this.displayComments.set(!this.displayComments());
  }

  addComment() {
    const content = this.commentForm.get("content")?.value;
    if (this.restaurant()?.id && content) {
      this.restaurantService
        .addComment(this.restaurant()!.id!, content)
        .subscribe(() => {
          this.commentForm.reset();
          this.refresh.emit(true);
        });
    }
  }

  deleteComment(commentId: string) {
    this.popupService
      .open("Confirmer", "Confirmez vous la suppression ?")
      .pipe(
        filter((res) => res),
        switchMap(() => this.restaurantService.deleteComment(commentId)),
      )
      .subscribe(() => {
        this.refresh.emit(true);
      });
  }
}
