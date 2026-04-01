// src/app/magic-link/magic-link.component.ts
import { Component, inject, signal, WritableSignal } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { catchError } from "rxjs";
import { AuthService } from "../../core/services/auth";

@Component({
  selector: "app-magic-link",
  templateUrl: "./login.html",
  styleUrl: "./login.css",
  imports: [FormsModule, ReactiveFormsModule],
})
export class LoginComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isSigningUp: WritableSignal<boolean> = signal(false);

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  errorMessage: WritableSignal<string | null> = signal(null);

  forgotPassword() {
    this.errorMessage.set(null);
    if (!this.loginForm.value.email) {
      this.errorMessage.set(
        "Veuillez entrer votre adresse email pour réinitialiser votre mot de passe.",
      );
      return;
    }
    this.authService
      .sendForgotPasswordEmail(this.loginForm.value.email)
      .subscribe();
  }

  onSubmit() {
    this.errorMessage.set(null);
    if (this.loginForm.valid) {
      if (this.isSigningUp()) {
        console.log("Signing up with", this.loginForm.value);
        this.authService
          .signUp(this.loginForm.value.email!, this.loginForm.value.password!)
          .subscribe({
            next: (response) => {
              console.log("Sign-up successful:", response);
              this.router.navigate(["/"]);
            },
            error: (error) => {
              console.error("Sign-up error:", error);
            },
          });
      } else {
        console.log("Signing in with", this.loginForm.value);
        this.authService
          .signIn(this.loginForm.value.email!, this.loginForm.value.password!)
          .pipe(
            catchError((error) => {
              console.error("Sign-in error:", error);
              if (error.message === "Invalid login credentials") {
                this.errorMessage.set(
                  "Identifiants invalides. Veuillez vérifier votre email et mot de passe.",
                );
              } else {
                this.errorMessage.set(
                  "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
                );
              }
              throw error;
            }),
          )
          .subscribe((response) => {
            console.log("Sign-in successful:", response);
            // The error can be in the response...
            if (response.error) {
              if (response.error.message === "Invalid login credentials") {
                this.errorMessage.set(
                  "Identifiants invalides. Veuillez vérifier votre email et mot de passe.",
                );
              } else {
                this.errorMessage.set(
                  "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
                );
              }
            } else {
              this.router.navigate(["/"]);
            }
          });
      }
    }
    this.loginForm.markAllAsTouched();
  }
}
