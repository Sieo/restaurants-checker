import { Component, inject, signal, WritableSignal } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { catchError, switchMap } from "rxjs";
import { ProfileService } from "../../core/services/profile";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.html",
  styleUrl: "./profile.css",
  imports: [FormsModule, ReactiveFormsModule],
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  profileForm = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(2)]],
    avatar_url: [""],
  });

  avatarPreview: WritableSignal<string | null> = signal(null);
  selectedAvatarFile: File | null = null;
  errorMessage: WritableSignal<string | null> = signal(null);
  successMessage: WritableSignal<string | null> = signal(null);
  isSaving: WritableSignal<boolean> = signal(false);

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        if (!profile) {
          return;
        }
        this.profileForm.patchValue({
          username: profile.username ?? "",
          avatar_url: profile.avatar_url ?? "",
        });
        this.avatarPreview.set(profile.avatar_url ?? null);
      },
      error: () => {
        this.errorMessage.set("Impossible de charger le profil.");
      },
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.selectedAvatarFile = file;
    this.avatarPreview.set(URL.createObjectURL(file));
  }

  onSubmit() {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSaving.set(true);

    const username = this.profileForm.value.username?.trim() ?? "";
    const avatarUrl = this.profileForm.value.avatar_url?.trim();

    const update$ = this.selectedAvatarFile
      ? this.profileService.uploadAvatar(this.selectedAvatarFile).pipe(
          switchMap((publicUrl) =>
            this.profileService.updateProfile({
              username,
              avatar_url: publicUrl,
            }),
          ),
        )
      : this.profileService.updateProfile({
          username,
          avatar_url: avatarUrl || undefined,
        });

    update$
      .pipe(
        catchError((error) => {
          console.error(error);
          this.errorMessage.set("Impossible de mettre à jour le profil.");
          this.isSaving.set(false);
          throw error;
        }),
      )
      .subscribe((profile) => {
        this.successMessage.set("Profil mis à jour.");
        this.avatarPreview.set(profile?.avatar_url ?? this.avatarPreview());
        this.selectedAvatarFile = null;
        this.isSaving.set(false);
      });
  }
}
