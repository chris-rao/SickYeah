import http from '../utils/http';

export interface ReviewPhoto {
  id: string;
  photoUrl: string;
  reviewId: string;
}

export interface ReviewUser {
  id: string;
  username: string;
  avatar: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: string;
  comment: string;
  createdAt: string;
  photos?: ReviewPhoto[];
  user?: ReviewUser;
}

export interface CreateReviewData {
  restaurantId: string;
  rating: string;
  comment?: string;
}

export interface ReviewResponse {
  review: Review;
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface PhotosResponse {
  photos: ReviewPhoto[];
}

class ReviewService {
  async createReview(data: CreateReviewData): Promise<ReviewResponse> {
    return http.post<ReviewResponse>('/reviews', data);
  }

  async uploadReviewPhotos(reviewId: string, files: File[]): Promise<PhotosResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    return http.post<PhotosResponse>(`/reviews/${reviewId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getRestaurantReviews(restaurantId: string): Promise<ReviewsResponse> {
    return http.get<ReviewsResponse>(`/reviews/restaurant/${restaurantId}`);
  }
}

export const reviewService = new ReviewService();
export default reviewService;
