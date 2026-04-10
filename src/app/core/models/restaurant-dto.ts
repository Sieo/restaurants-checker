import { CommentDTO } from "./comment-dto";
export interface RestaurantDTO {
  id?: string;
  name: string;
  image_url: string;
  rating: number;
  address: string;
  cuisine: string;
  description: string;
  priceRange?: 1 | 2 | 3;
  my_rating?: number;
  commentCount?: number;
  comments?: CommentDTO[];
}
