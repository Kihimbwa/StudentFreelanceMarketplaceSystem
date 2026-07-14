import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  ArrowRight,
  Star,
} from "lucide-react";
import { Application, Job, Message, Review } from "../../types";
import { applicationService, jobService, messageService, reviewService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, timeAgo } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";
import JobCard from "../../components/jobs/JobCard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getAll(),
      jobService.getAll(),
      messageService.getAll(),
      reviewService.getAll(),
    ])
      .then(([apps, allJobs, msgs, revs]) => {
        setApplications(Array.isArray(apps) ? apps : []);
        setJobs(Array.isArray(allJobs) ? allJobs : []);
        setMessages(Array.isArray(msgs) ? msgs : []);
        setReviews(Array.isArray(revs) ? revs : []);
      })
      .catch((err) => {
        console.error("Error fetching student dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Kuchuja maombi kwa kutumia freelancer_id sahihi kutoka kwenye API
  const myApps = useMemo(() => {
    if (!user?.id) return [];
    
    return applications.filter((app: any) => {
      const currentUserId = String(user.id).trim();

      // 1. Angalia kama kuna freelancer_id ya moja kwa moja
      if (app.freelancer_id && String(app.freelancer_id).trim() === currentUserId) {
        return true;
      }

      // 2. Njia ya ziada kama itarudi kama object
      if (app.freelancer && typeof app.freelancer === "object") {
        const fId = app.freelancer.id || app.freelancer._id;
        if (fId && String(fId).trim() === currentUserId) return true;
      }

      return false;
    });
  }, [applications, user]);

  // Mahesabu ya takwimu kulingana na maombi ya mwanafunzi huyu
  const stats = useMemo(() => {
    return {
      total: myApps.length,
      pending: myApps.filter((a) => String(a.status || "pending").toLowerCase() === "pending").length,
      accepted: myApps.filter((a) => {
        const s = String(a.status || "").toLowerCase();
        return s === "accepted" || s === "approved" || s === "hired";
      }).length,
      rejected: myApps.filter((a) => {
        const s = String(a.status || "").toLowerCase();
        return s === "rejected" || s === "declined" || s === "cancelled";
      }).length,
    };
  }, [myApps]);

  const recommendedJobs = useMemo(() => {
    return jobs.filter((j) => j.status === "open").slice(0, 3);
  }, [jobs]);

  const myReviews = useMemo(() => {
    if (!user?.id) return [];
    return reviews.filter((r) => {
      const revieweeId = r.reviewee && typeof r.reviewee === "object"
        ? String((r.reviewee as any).id)
        : String(r.reviewee);
      return String(revieweeId).trim() === String(user.id).trim();
    });
  }, [reviews, user]);

  const avgRating = useMemo(() => {
    if (myReviews.length === 0) return 0;
    return myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length;
  }, [myReviews]);

  const recentMessages = useMemo(() => {
    if (!user?.id) return [];
    return [...messages]
      .filter((m) => {
        const senderId = m.sender && typeof m.sender === "object" ? String((m.sender as any).id) : String(m.sender);
        const receiverId = m.receiver && typeof m.receiver === "object" ? String((m.receiver as any).id) : String(m.receiver);
        const currentUserId = String(user.id);
        return senderId === currentUserId || receiverId === currentUserId;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [messages, user]);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  const statCards = [
    { label: "Total Applications", value: stats.total, icon: Send, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Accepted", value: stats.accepted, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.4) 0%, transparent 50%)"
        }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.username}!</h1>
            <p className="text-slate-300">Here's what's happening with your applications.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/jobs">
              <Button variant="secondary" size="md">
                Browse Jobs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Active Applications</h2>
            <Link to="/my-applications" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              View all
            </Link>
          </div>
          {myApps.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 mb-3">No applications yet.</p>
              <Link to="/jobs">
                <Button variant="outline" size="sm">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 5).map((app) => {
                const jobId = app.job && typeof app.job === "object" ? (app.job as any).id : app.job;
                const job = jobs.find((j) => j.id === jobId);
                
                return (
                  <Link
                    key={app.id}
                    to={`/jobs/${jobId}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {job?.title || (app.job && typeof app.job === "object" ? (app.job as any).title : `Job #${app.job}`)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Bid: {formatBudget(app.bid_amount)} · {timeAgo(app.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        String(app.status || "").toLowerCase() === "accepted" || String(app.status || "").toLowerCase() === "approved" 
                          ? "success" 
                          : String(app.status || "").toLowerCase() === "rejected" || String(app.status || "").toLowerCase() === "declined" 
                            ? "danger" 
                            : "warning"
                      }
                      className="capitalize"
                    >
                      {app.status || "pending"}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Overview</h2>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={user?.username || ""} size="lg" />
              <div>
                <p className="font-semibold text-slate-900">{user?.username}</p>
                <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-slate-700">
                {avgRating.toFixed(1)} ({myReviews.length} reviews)
              </span>
            </div>
            <Link to={`/profile/student/${user?.id}`}>
              <Button variant="outline" fullWidth size="sm">View Profile</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Messages</h2>
              <Link to="/messages" className="text-sm font-medium text-sky-600 hover:text-sky-700">
                View all
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No messages yet.</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    to="/messages"
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-1">{msg.content}</p>
                      <p className="text-xs text-slate-400">{timeAgo(msg.timestamp)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {recommendedJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Recommended Jobs</h2>
            <Link to="/jobs" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}