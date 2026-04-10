import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { RestaurantDTO } from "../models/restaurant-dto";
import { Supabase } from "./supabase";

@Injectable({
  providedIn: "root",
})
export class RestaurantService {
  private readonly supabase: Supabase = inject(Supabase);

  getAllRestaurants() {
    return from(
      this.supabase.client.auth.getUser().then(async ({ data: { user } }) => {
        const userId = user?.id;

        const { data: data_1, error } = await this.supabase.client
          .from("restaurants")
          .select(
            `
          id,
          name,
          address,
          description,
          image_url,
          "priceRange",
          cuisine:cuisine(name),
          ratings(rating, user_id),
          comments(id, content, created_at, author:author_id(username))
          `,
          )
          .order("name", { ascending: true });
        if (error) throw error;
        return (data_1 ?? []).map((r: any) => {
          const allRatings = (r.ratings || []).filter(
            (x: any) => x.rating != null,
          );

          const avgRating = allRatings.length
            ? allRatings.reduce(
                (sum: number, x_1: any) => sum + Number(x_1.rating),
                0,
              ) / allRatings.length
            : 0;

          const myRatingObj = allRatings.find(
            (x_2: any) => x_2.user_id === userId,
          );

          const comments = (r.comments || []).map((comment: any) => ({
            id: comment.id,
            name: comment.author?.username ?? "Anonyme",
            comment: comment.content,
            date: comment.created_at,
          }));

          return {
            id: r.id,
            name: r.name,
            address: r.address,
            description: r.description,
            image_url: r.image_url,
            priceRange: r.priceRange,
            cuisine: r.cuisine?.name ?? null,
            rating: Math.round(avgRating || 0),
            my_rating: myRatingObj?.rating ?? null,
            comments,
            commentCount: comments.length,
          };
        });
      }),
    );
  }

  getAverageRating(restaurantId: string) {
    return from(
      this.supabase.client
        .rpc("get_average_rating", {
          p_restaurant_id: restaurantId,
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return Math.round(data ?? 0);
        }),
    );
  }

  addRestaurant(restaurant: RestaurantDTO, userId: string) {
    return from(
      this.supabase.client.from("restaurants").insert([
        {
          ...restaurant,
          created_by: userId,
        },
      ]),
    );
  }

  updateRestaurant(restaurantId: string, restaurant: RestaurantDTO) {
    return from(
      this.supabase.client
        .from("restaurants")
        .update({ ...restaurant })
        .eq("id", restaurantId),
    );
  }

  getRestaurantById(id: string): Observable<RestaurantDTO | null> {
    return from(
      this.supabase.client.auth.getUser().then(async ({ data: { user } }) => {
        const userId = user?.id;

        const { data: data_1, error } = await this.supabase.client
          .from("restaurants")
          .select(
            `
          id,
          name,
          address,
          description,
          image_url,
          "priceRange",
          cuisine:cuisine(name),
          ratings(rating, user_id),
          comments(id, content, created_at, author:author_id(username))
          `,
          )
          .eq("id", id)
          .order("name", { ascending: true });
        if (error) throw error;

        const restaurants = (data_1 ?? []).map((r: any) => {
          const allRatings = (r.ratings || []).filter(
            (x: any) => x.rating != null,
          );

          const avgRating = allRatings.length
            ? allRatings.reduce(
                (sum: number, x_1: any) => sum + Number(x_1.rating),
                0,
              ) / allRatings.length
            : 0;

          const myRatingObj = allRatings.find(
            (x_2: any) => x_2.user_id === userId,
          );

          const comments = (r.comments || []).map((comment: any) => ({
            id: comment.id,
            name: comment.author?.username ?? "Anonyme",
            comment: comment.content,
            date: comment.created_at,
          }));

          return {
            id: r.id,
            name: r.name,
            address: r.address,
            description: r.description,
            image_url: r.image_url,
            priceRange: r.priceRange,
            cuisine: r.cuisine?.name ?? null,
            rating: Math.round(avgRating || 0),
            my_rating: myRatingObj?.rating ?? null,
            comments,
            commentCount: comments.length,
          } as RestaurantDTO;
        });

        return restaurants[0] ?? null;
      }),
    );
  }

  addRating(restaurantId: string, rating: number) {
    return from(
      this.supabase.client
        .from("ratings")
        .insert({
          rating,
          user_id: this.supabase.clientId,
          restaurant_id: restaurantId,
        })
        .select(),
    );
  }

  updateRating(restaurantId: string, rating: number) {
    return from(
      this.supabase.client
        .from("ratings")
        .update({ rating })
        .eq("user_id", this.supabase.clientId)
        .eq("restaurant_id", restaurantId)
        .select(),
    );
  }

  deleteRestaurant(restaurantId: string) {
    return from(
      this.supabase.client.from("restaurants").delete().eq("id", restaurantId),
    );
  }

  addComment(restaurantId: string, comment: string) {
    return from(
      this.supabase.client
        .from("comments")
        .insert({
          content: comment,
          author_id: this.supabase.clientId,
          restaurant_id: restaurantId,
        })
        .select(),
    );
  }

  deleteComment(commentId: string) {
    return from(
      this.supabase.client.from("comments").delete().eq("id", commentId),
    );
  }
}
