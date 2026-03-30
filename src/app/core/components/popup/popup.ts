import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-popup",
  standalone: true,
  templateUrl: "./popup.html",
  styleUrls: ["./popup.css"],
})
export class PopupComponent {
  title = input<string>("");
  message = input<string>("");
  result = output<boolean>();

  onAccept() {
    this.result.emit(true);
  }

  onDeny() {
    this.result.emit(false);
  }
}
