import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Briefcase, Send } from "lucide-react";
import { Application, Job, Review } from "../../types";
import { applicationService, jobService, reviewService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, formatDate } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Rating from "../../components/ui/Rating";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const userId = parseInt(id || "0");

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getAll(),
      jobService.getAll(),
      reviewService.getAll(),
    ])
      .then(([apps, allJobs, revs]) => {
        setApplications(Array.isArray(apps) ? apps : []);
        setJobs(Array.isArray(allJobs) ? allJobs : []);
        setReviews(Array.isArray(revs) ? revs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myApps = useMemo(
    () => applications.filter((a) => a.student === userId),
    [applications, userId]
  );

  const myReviews = useMemo(
    () => reviews.filter((r) => r.reviewee === userId),
    [reviews, userId]
  );

  const avgRating = useMemo(() => {
    if (myReviews.length === 0) return 0;
    return myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length;
  }, [myReviews]);

  const acceptedJobs = useMemo(
    () => myApps.filter((a) => a.status === "accepted"),
    [myApps]
  );

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  const isOwn = user?.id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <Avatar name={`Student ${userId}`} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Student #{userId}
              </h1>
              {isOwn && <Badge variant="info">You</Badge>}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Rating value={avgRating} showValue />
              <span className="text-sm text-slate-500">
                ({myReviews.length} review{myReviews.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                {acceptedJobs.length} completed job{acceptedJobs.length !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1.5">
                <Send className="w-4 h-4" />
                {myApps.length} application{myApps.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Job History</h2>
          {myApps.length === 0 ? (
            <EmptyState title="No applications yet" message="This student hasn't applied to any jobs." />
          ) : (
            <div className="space-y-3">
              {myApps.map((app) => {
                const job = jobs.find((j) => j.id === app.job);
                return (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {job?.title || `Job #${app.job}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        Bid: {formatBudget(app.bid_amount)} · {formatDate(app.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={app.status === "accepted" ? "success" : app.status === "rejected" ? "danger" : "warning"}
                      className="capitalize"
                    >
                      {app.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Reviews</h2>
          {myReviews.length === 0 ? (
            <EmptyState title="No reviews yet" message="No reviews have been left for this student." />
          ) : (
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={review.reviewer_name} size="sm" />
                    <span className="text-sm font-medium text-slate-700">{review.reviewer_name}</span>
                  </div>
                  <Rating value={review.rating} size="sm" />
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(review.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
