import { Component, computed, inject } from "@angular/core";
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
  public userProfile = computed(() => this.user()?.data?.user || null);

  logout() {
    this.authService.signOut().subscribe();
  }
}
