import { TitleCasePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Cuisines } from "../../core/services/cuisines";

@Component({
  selector: "app-cuisines",
  imports: [ReactiveFormsModule, FormsModule, TitleCasePipe],
  templateUrl: "./cuisines.html",
  styleUrl: "./cuisines.css",
})
export class CuisinesComponent {
  private readonly cuisinesService = inject(Cuisines);
  private readonly fb: FormBuilder = inject(FormBuilder);

  cuisines = rxResource({
    stream: () => this.cuisinesService.getAllCuisines(),
  });

  form = this.fb.group({
    name: ["", Validators.required],
  });

  addCuisine() {
    if (this.form.valid) {
      this.cuisinesService
        .addCuisine(this.form.value.name!.toLowerCase())
        .subscribe((res) => {
          console.log(res);
          this.form.reset();
          this.cuisines.reload();
        });
    }
  }

  removeCuisine(id: string) {
    this.cuisinesService.removeCuisine(id).subscribe(() => {
      this.cuisines.reload();
    });
  }
}
