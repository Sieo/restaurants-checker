import { inject } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "./core/services/auth";

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn().pipe(
    map((loggedIn) => {
      return loggedIn || router.createUrlTree(["/login"]);
    }),
  );
};

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login").then((m) => m.LoginComponent),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: "dashboard/cuisines",
    loadComponent: () =>
      import("./pages/cuisines/cuisines").then((m) => m.CuisinesComponent),
    canActivate: [authGuard],
  },
  {
    path: "dashboard/restaurants",
    loadComponent: () =>
      import("./pages/restaurants/restaurants").then(
        (m) => m.RestaurantsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "dashboard/restaurants/:restaurantId",
    loadComponent: () =>
      import("./pages/restaurants/restaurants").then(
        (m) => m.RestaurantsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    //fallback route
    path: "**",
    redirectTo: "/",
  },
];
