import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-nav-drawer",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./nav-drawer.html",
  styleUrl: "./nav-drawer.css",
})
export class NavDrawer {
  private readonly authService = inject(AuthService);

  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  closeDrawer() {
    this.close.emit();
  }

  logout() {
    this.authService.signOut().subscribe();
    this.close.emit();
  }
}
