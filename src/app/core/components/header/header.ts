import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterModule } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../../services/auth";
import { Supabase } from "../../services/supabase";
import { NavDrawer } from "../nav-drawer/nav-drawer";

@Component({
  selector: "app-header",
  imports: [RouterModule, NavDrawer],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class Header {
  private readonly supabase = inject(Supabase);
  private readonly authService: AuthService = inject(AuthService);

  private readonly user = toSignal(this.authService.getUser());
  isLoggedIn = toSignal(
    this.supabase.session$.pipe(map((session) => !!session)),
  );
  public userProfile = computed(() => {
    if (this.isLoggedIn()) {
      return this.user()?.data?.user || null;
    }
    return null;
  });

  protected readonly isDrawerOpen = signal(false);

  toggleMenu() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  logout() {
    this.authService.signOut().subscribe();
  }
}
