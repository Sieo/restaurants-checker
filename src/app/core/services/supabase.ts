import { Injectable } from "@angular/core";
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { BehaviorSubject, map } from "rxjs";
import { environment } from "../../environment";

@Injectable({
  providedIn: "root",
})
export class Supabase {
  private readonly supabaseClient: SupabaseClient;
  private readonly authSessionSubject = new BehaviorSubject<AuthSession | null>(
    null,
  );

  constructor() {
    this.supabaseClient = createClient(
      environment.supabase.url,
      environment.supabase.SUPABASE_PUBLISHABLE_KEY,
    );
    this.initAuthChanges();
  }

  initAuthChanges() {
    this.supabaseClient.auth.onAuthStateChange((_, session) => {
      this.authSessionSubject.next(session);
    });
  }

  get session$() {
    return this.authSessionSubject.asObservable();
  }

  get clientId() {
    return this.authSessionSubject.value?.user.id;
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }

  get user$() {
    return this.session$.pipe(map((session) => session?.user || null));
  }
}
