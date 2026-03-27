import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { map } from "rxjs";
import { RestaurantDTO } from "../../core/models/restaurant-dto";
import { Cuisines } from "../../core/services/cuisines";
import { RestaurantService } from "../../core/services/restaurant";
import { Supabase } from "../../core/services/supabase";
import { RestaurantCard } from "../../shared/components/restaurant-card/restaurant-card";

@Component({
  selector: "app-restaurants",
  imports: [RestaurantCard, ReactiveFormsModule],
  templateUrl: "./restaurants.html",
  styleUrl: "./restaurants.css",
})
export class RestaurantsComponent {
  private readonly restaurantService = inject(RestaurantService);
  private readonly cuisinesService = inject(Cuisines);
  private readonly supabase = inject(Supabase);
  private readonly fb: FormBuilder = inject(FormBuilder);

  cuisines = toSignal(this.cuisinesService.getAllCuisines());

  restaurantId = input<string>();

  form = this.fb.group({
    id: [{ value: "", disabled: true }],
    cuisine: ["", Validators.required],
    description: "",
    image_url: "",
    address: "",
    name: ["", Validators.required],
    priceRange: 1,
  });

  restaurant = toSignal(
    this.form.valueChanges.pipe(
      map(
        (value) =>
          ({
            ...value,
            cuisine: this.cuisines()?.data?.find((c) => c.id === value.cuisine)
              ?.name,
          }) as RestaurantDTO,
      ),
    ),
  );

  refresh: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      console.log("need refresh: ", this.refresh());
      console.log("restaurant ID ", this.restaurantId());
      if (this.restaurantId() || this.refresh()) {
        this.restaurantService
          .getRestaurantById(this.restaurantId()!)
          .subscribe((res) => {
            console.log(res);
            this.form.patchValue(res?.data?.[0]);
          });
      }
    });
  }

  addRestaurant() {
    if (this.form.valid) {
      const restaurant: RestaurantDTO = this.form.value as RestaurantDTO;
      this.restaurantService
        .addRestaurant(restaurant, this.supabase.clientId!)
        .subscribe((res) => {
          console.log(res);
          this.form.reset();
        });
    }
  }

  deleteRestaurant() {}
}
