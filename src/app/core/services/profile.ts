import { inject, Injectable } from "@angular/core";
import type { User } from "@supabase/supabase-js";
import { from, map, Observable } from "rxjs";
import { environment } from "../../environment";
import { Supabase } from "./supabase";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private readonly supabase = inject(Supabase);

  getProfile(): Observable<UserProfile | null> {
    return from(this.supabase.client.auth.getUser()).pipe(
      map((result) => {
        if (result.error || !result.data.user) {
          return null;
        }
        return this.toProfile(result.data.user);
      }),
    );
  }

  updateProfile(profile: {
    username: string;
    avatar_url?: string;
  }): Observable<UserProfile | null> {
    return from(
      this.supabase.client.auth.updateUser({
        data: {
          username: profile.username,
          avatar_url: profile.avatar_url,
        },
      }),
    ).pipe(
      map((result) => {
        if (result.error || !result.data.user) {
          throw (
            result.error ?? new Error("Impossible de mettre à jour le profil.")
          );
        }
        return this.toProfile(result.data.user);
      }),
    );
  }

  uploadAvatar(file: File): Observable<string> {
    const bucket = environment.supabase.storageBucket || "avatars";
    const filePath = `${bucket}/${Date.now()}_${file.name}`;

    return from(
      this.supabase.client.storage.from(bucket).upload(filePath, file, {
        upsert: true,
      }),
    ).pipe(
      map((result) => {
        if (result.error) {
          const message =
            result.error.message ?? result.error.name ?? "Upload failed.";
          throw new Error(
            message.includes("Bucket not found")
              ? `Bucket '${bucket}' not found. Create it in Supabase Storage or update environment.supabase.storageBucket.`
              : message,
          );
        }
        const { data } = this.supabase.client.storage
          .from(bucket)
          .getPublicUrl(filePath);
        return data.publicUrl;
      }),
    );
  }

  private toProfile(user: User) {
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    return {
      id: user.id,
      email: user.email ?? "",
      username:
        typeof metadata["username"] === "string"
          ? metadata["username"]
          : undefined,
      avatar_url:
        typeof metadata["avatar_url"] === "string"
          ? metadata["avatar_url"]
          : undefined,
      full_name:
        typeof metadata["full_name"] === "string"
          ? metadata["full_name"]
          : undefined,
    };
  }
}
