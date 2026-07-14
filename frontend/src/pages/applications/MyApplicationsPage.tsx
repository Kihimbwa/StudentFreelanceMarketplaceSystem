import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Send, Clock, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { Application, Job } from "../../types";
import { applicationService, jobService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, timeAgo, getErrorMessage } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apps, allJobs] = await Promise.all([
        applicationService.getAll(),
        jobService.getAll(),
      ]);
      setApplications(Array.isArray(apps) ? apps : []);
      setJobs(Array.isArray(allJobs) ? allJobs : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const myApps = useMemo(
    () => applications.filter((a) => a.student === user?.id),
    [applications, user]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return myApps;
    return myApps.filter((a) => a.status === filter);
  }, [myApps, filter]);

  const counts = useMemo(() => ({
    all: myApps.length,
    pending: myApps.filter((a) => a.status === "pending").length,
    accepted: myApps.filter((a) => a.status === "accepted").length,
    rejected: myApps.filter((a) => a.status === "rejected").length,
  }), [myApps]);

  const tabs = [
    { key: "all", label: "All", count: counts.all, icon: Send },
    { key: "pending", label: "Pending", count: counts.pending, icon: Clock },
    { key: "accepted", label: "Accepted", count: counts.accepted, icon: CheckCircle2 },
    { key: "rejected", label: "Rejected", count: counts.rejected, icon: XCircle },
  ];

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchApps} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-500">Track the status of your submitted proposals.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-xs ${filter === tab.key ? "bg-white/20" : "bg-slate-100"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No applications found"
          message={filter === "all" ? "You haven't applied to any jobs yet." : `No ${filter} applications.`}
          icon={<Send className="w-8 h-8" />}
          action={
            <Link to="/jobs">
              <Button variant="outline" size="sm">Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const job = jobs.find((j) => j.id === app.job);
            return (
              <Link
                key={app.id}
                to={`/jobs/${app.job}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {job?.title || `Job #${app.job}`}
                      </h3>
                      <Badge
                        variant={app.status === "accepted" ? "success" : app.status === "rejected" ? "danger" : "warning"}
                        className="capitalize flex-shrink-0"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{app.proposal}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">Bid: {formatBudget(app.bid_amount)}</span>
                      <span>Applied {timeAgo(app.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
