import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js";
import { from, map, Observable } from "rxjs";
import { Supabase } from "./supabase";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly supabase: Supabase = inject(Supabase);
  private readonly router = inject(Router);

  signUp(email: string, password: string): Observable<AuthResponse> {
    return from(
      this.supabase.client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: globalThis.location.origin + "/",
        },
      }),
    );
  }

  signIn(
    email: string,
    password: string,
  ): Observable<AuthTokenResponsePassword> {
    return from(
      this.supabase.client.auth.signInWithPassword({
        email,
        password,
      }),
    );
  }

  signOut() {
    return from(this.supabase.client.auth.signOut()).pipe(
      map(() => {
        // Clear the auth session in Supabase service
        this.supabase.initAuthChanges();
        this.router.navigate(["/login"]);
      }),
    );
  }

  sendForgotPasswordEmail(email: string) {
    return from(
      this.supabase.client.auth.resetPasswordForEmail(email, {
        redirectTo: globalThis.location.origin + "/forgot-password",
      }),
    );
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.supabase.client.auth.getSession()).pipe(
      map(({ data }) => !!data.session),
    );
  }

  getUser() {
    return from(this.supabase.client.auth.getUser());
    // return this.isLoggedIn().pipe(
    //   filter((loggedIn) => loggedIn),
    //   switchMap(() => {
    //   }),
    // );
  }
}
