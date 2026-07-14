import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Building2, Briefcase, Users } from "lucide-react";
import { Job, Application, Review } from "../../types";
import { jobService, applicationService, reviewService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, timeAgo } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Rating from "../../components/ui/Rating";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const userId = parseInt(id || "0");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getAll(),
      applicationService.getAll(),
      reviewService.getAll(),
    ])
      .then(([allJobs, allApps, allRevs]) => {
        setJobs(Array.isArray(allJobs) ? allJobs : []);
        setApplications(Array.isArray(allApps) ? allApps : []);
        setReviews(Array.isArray(allRevs) ? allRevs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myJobs = useMemo(
    () => jobs.filter((j) => j.client_id === userId),
    [jobs, userId]
  );

  const myJobIds = useMemo(() => new Set(myJobs.map((j) => j.id)), [myJobs]);
  const myApps = useMemo(
    () => applications.filter((a) => myJobIds.has(a.job)),
    [applications, myJobIds]
  );

  const myReviews = useMemo(
    () => reviews.filter((r) => r.reviewee === userId),
    [reviews, userId]
  );

  const avgRating = useMemo(() => {
    if (myReviews.length === 0) return 0;
    return myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length;
  }, [myReviews]);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  const isOwn = user?.id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Client #{userId}</h1>
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
                {myJobs.length} job{myJobs.length !== 1 ? "s" : ""} posted
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {myApps.length} total applicant{myApps.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posted Jobs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Posted Jobs</h2>
        {myJobs.length === 0 ? (
          <EmptyState title="No jobs posted" message="This client hasn't posted any jobs yet." />
        ) : (
          <div className="space-y-3">
            {myJobs.map((job) => {
              const appCount = myApps.filter((a) => a.job === job.id).length;
              return (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{job.title}</p>
                    <p className="text-xs text-slate-400">
                      {formatBudget(job.budget)} · {timeAgo(job.created_at)}
                    </p>
                  </div>
                  <Badge variant="info">
                    <Users className="w-3 h-3" />
                    {appCount}
                  </Badge>
                  <Badge variant={job.status === "open" ? "success" : "default"}>{job.status}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Reviews</h2>
        {myReviews.length === 0 ? (
          <EmptyState title="No reviews yet" message="No reviews have been left for this client." />
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
                <p className="text-xs text-slate-400 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
