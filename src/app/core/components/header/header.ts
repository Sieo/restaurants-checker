import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router, RouterModule } from "@angular/router";
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
  private readonly router = inject(Router);

  private readonly user = toSignal(this.supabase.user$);
  isLoggedIn = computed(() => !!this.user());
  public userProfile = computed(() => {
    if (this.isLoggedIn()) {
      return this.user() || null;
    }
    return null;
  });

  public avatarUrl = computed(() => {
    const user = this.userProfile();
    const metadata = user?.user_metadata as Record<string, unknown> | undefined;
    return typeof metadata?.["avatar_url"] === "string"
      ? metadata["avatar_url"]
      : null;
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

  toProfile() {
    this.router.navigate(["/profile"]);
  }
}
