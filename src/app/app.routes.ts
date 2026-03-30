import { inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router, Routes } from "@angular/router";
import { AuthService } from "./core/services/auth";

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLogged = toSignal(auth.isLoggedIn());
  if (!isLogged) {
    router.navigate(["/login"]);
    return false;
  }
  return isLogged;
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
    redirectTo: "/login",
  },
];
