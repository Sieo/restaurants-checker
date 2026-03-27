import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login").then((m) => m.LoginComponent),
  },
  {
    path: "cuisines",
    loadComponent: () =>
      import("./pages/cuisines/cuisines").then((m) => m.CuisinesComponent),
  },
  {
    path: "restaurants",
    loadComponent: () =>
      import("./pages/restaurants/restaurants").then(
        (m) => m.RestaurantsComponent,
      ),
  },
  {
    path: "restaurants/:restaurantId",
    loadComponent: () =>
      import("./pages/restaurants/restaurants").then(
        (m) => m.RestaurantsComponent,
      ),
  },
  {
    //fallback route
    path: "**",
    redirectTo: "",
  },
];
