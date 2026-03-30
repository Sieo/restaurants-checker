import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterModule } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../../services/auth";
import { Supabase } from "../../services/supabase";

@Component({
  selector: "app-header",
  imports: [RouterModule],
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

  protected readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  logout() {
    this.authService.signOut().subscribe();
  }
}
