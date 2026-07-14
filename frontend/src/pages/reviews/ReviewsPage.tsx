import { useEffect, useState, useMemo } from "react";
import { Star, Search } from "lucide-react";
import { Review } from "../../types";
import { reviewService } from "../../services/endpoints";
import { formatDate, getErrorMessage } from "../../utils/helpers";
import Avatar from "../../components/ui/Avatar";
import Rating from "../../components/ui/Rating";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getAll();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load reviews"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(
      (r) =>
        r.reviewer_name.toLowerCase().includes(q) ||
        r.reviewee_name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchReviews} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reviews</h1>
        <p className="text-slate-500">See what people are saying about each other.</p>
      </div>

      {/* Overall Rating Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">{avgRating.toFixed(1)}</span>
              <Rating value={avgRating} />
            </div>
            <p className="text-sm text-slate-500">
              Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Search reviews by name or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No reviews found"
          message={search ? "Try a different search." : "No reviews have been left yet."}
          icon={<Star className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <Avatar name={review.reviewer_name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{review.reviewer_name}</p>
                      <p className="text-xs text-slate-400">
                        reviewed <span className="font-medium text-slate-600">{review.reviewee_name}</span>
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(review.created_at)}</span>
                  </div>
                  <Rating value={review.rating} size="sm" />
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
