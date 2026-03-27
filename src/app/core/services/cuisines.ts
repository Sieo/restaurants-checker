import { inject, Injectable } from "@angular/core";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { from, Observable } from "rxjs";
import { CuisineDTO } from "../models/cuisine-dto";
import { Supabase } from "./supabase";

@Injectable({
  providedIn: "root",
})
export class Cuisines {
  private readonly supaBase: Supabase = inject(Supabase);
  private readonly TABLE_NAME = "cuisines";

  getAllCuisines(): Observable<PostgrestSingleResponse<CuisineDTO[]>> {
    return from(this.supaBase.client.from(this.TABLE_NAME).select("*"));
  }

  getKitchenPromises() {
    return this.supaBase.client.from(this.TABLE_NAME).select("*");
  }

  addCuisine(name: string) {
    return from(this.supaBase.client.from(this.TABLE_NAME).insert({ name }));
  }

  removeCuisine(id: string) {
    return from(
      this.supaBase.client.from(this.TABLE_NAME).delete().eq("id", id).select(),
    );
  }

  updateCuisine(id: string, name: string) {
    return from(
      this.supaBase.client.from(this.TABLE_NAME).update({ name }).eq("id", id),
    );
  }
}
