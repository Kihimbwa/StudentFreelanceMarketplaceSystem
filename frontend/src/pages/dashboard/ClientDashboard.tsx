import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Job, Application, Message } from "../../types";
import { jobService, applicationService, messageService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, timeAgo } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getAll(),
      applicationService.getAll(),
      messageService.getAll(),
    ])
      .then(([allJobs, allApps, allMsgs]) => {
        setJobs(Array.isArray(allJobs) ? allJobs : []);
        setApplications(Array.isArray(allApps) ? allApps : []);
        setMessages(Array.isArray(allMsgs) ? allMsgs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myJobs = useMemo(
    () => jobs.filter((j) => String(j.client_id || j.client) === String(user?.id)),
    [jobs, user]
  );

  const myJobIds = useMemo(() => new Set(myJobs.map((j) => j.id)), [myJobs]);

  const myApps = useMemo(
    () => applications.filter((a) => myJobIds.has(a.job)),
    [applications, myJobIds]
  );

  const stats = useMemo(() => {
    const totalBudget = myJobs.reduce((sum, j) => sum + parseFloat(j.budget || "0"), 0);
    return {
      posted: myJobs.length,
      open: myJobs.filter((j) => j.status === "open").length,
      applicants: myApps.length,
      totalBudget,
    };
  }, [myJobs, myApps]);

  const recentMessages = useMemo(() => {
    return [...messages]
      .filter((m) => String(m.sender) === String(user?.id) || String(m.receiver) === String(user?.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [messages, user]);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  const statCards = [
    { label: "Posted Jobs", value: stats.posted, icon: Briefcase, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Open Jobs", value: stats.open, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Applicants", value: stats.applicants, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Budget", value: formatBudget(stats.totalBudget), icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50" },
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
            <p className="text-slate-300">Manage your jobs and applicants here.</p>
          </div>
          <Link to="/jobs/create">
            <Button variant="secondary">
              <Plus className="w-4 h-4" />
              Post a Job
            </Button>
          </Link>
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
            <h2 className="text-lg font-semibold text-slate-900">Your Posted Jobs</h2>
            <Link to="/jobs" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              View all
            </Link>
          </div>
          {myJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 mb-3">No jobs posted yet.</p>
              <Link to="/jobs/create">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.slice(0, 5).map((job) => {
                const appCount = myApps.filter((a) => a.job === job.id).length;
                return (
                  <div
                    key={job.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-slate-500" />
                    </div>
                    <Link to={`/jobs/${job.id}`} className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate hover:text-sky-600 transition-colors">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatBudget(job.budget)} · {timeAgo(job.created_at)}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link to={`/jobs/${job.id}/applicants`}>
                        <Badge variant="info">
                          <Users className="w-3 h-3" />
                          {appCount}
                        </Badge>
                      </Link>
                      <Badge variant={job.status === "open" ? "success" : "default"}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/jobs/create">
                <Button variant="outline" fullWidth>
                  <Plus className="w-4 h-4" />
                  Post a Job
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Applications
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" fullWidth>
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Button>
              </Link>
              <Link to={`/profile/client/${user?.id}`}>
                <Button variant="outline" fullWidth>
                  <ArrowRight className="w-4 h-4" />
                  View Profile
                </Button>
              </Link>
            </div>
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
    </div>
  );
}