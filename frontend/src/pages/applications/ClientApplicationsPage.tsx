import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, Briefcase, DollarSign, MessageSquare, ArrowLeft } from "lucide-react";
import { jobService, applicationService } from "../../services/endpoints";
import { Job, Application } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { formatBudget, timeAgo } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ClientApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobService.getAll(), applicationService.getAll()])
      .then(([allJobs, allApps]) => {
        setJobs(Array.isArray(allJobs) ? allJobs : []);
        setApplications(Array.isArray(allApps) ? allApps : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // 1. Pata kazi zote zilizopostiwa na huyu Client aliyelogin
  const myJobs = useMemo(
    () => jobs.filter((j) => String(j.client_id || j.client) === String(user?.id)),
    [jobs, user]
  );

  const myJobIds = useMemo(() => new Set(myJobs.map((j) => j.id)), [myJobs]);

  // 2. Pata maombi (applications) yote yaliyotumwa kwenye hizo kazi zake pekee
  const myApps = useMemo(
    () => applications.filter((a) => myJobIds.has(a.job)),
    [applications, myJobIds]
  );

  // Ramani ili kupata jina la kazi kwa urahisi kwa kutumia job ID
  const jobMap = useMemo(() => {
    const map: Record<string | number, Job> = {};
    myJobs.forEach((job) => {
      map[job.id] = job;
    });
    return map;
  }, [myJobs]);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header na kitufe cha kurudi nyuma */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Total Applications</h1>
          <p className="text-slate-500">
            Review all proposals submitted by students for your posted jobs.
          </p>
        </div>
      </div>

      {myApps.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No applications received yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Once students start bidding on your active jobs, their proposals and details will appear here.
          </p>
          <Link to="/jobs/create">
            <Button size="sm">
              <Briefcase className="w-4 h-4 mr-2" />
              Post Another Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const connectedJob = jobMap[app.job];
            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Taarifa za Mwanafunzi na Kazi husika */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full w-fit">
                      <Briefcase className="w-3.5 h-3.5" />
                      Job: {connectedJob ? connectedJob.title : `Job #${app.job}`}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        {app.freelancer_username || "Student Applied"}
                        <span className="text-xs font-normal text-slate-400">
                          · {timeAgo(app.created_at)}
                        </span>
                      </h3>
                      {app.freelancer_email && (
                        <p className="text-xs text-slate-400">{app.freelancer_email}</p>
                      )}
                    </div>

                    {/* Proposal text */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 mb-1">Proposal / Cover Letter:</p>
                      <p className="text-sm text-slate-600 whitespace-pre-line">
                        {app.proposal || "No cover letter provided."}
                      </p>
                    </div>
                  </div>

                  {/* Kiasi cha Dau na kitufe cha Kuchat */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:min-w-[180px] border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        Bid Amount
                      </p>
                      <p className="text-xl font-extrabold text-slate-900 flex items-center md:justify-end gap-1">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        {formatBudget(app.bid_amount)}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      className="flex items-center justify-center gap-2"
                      onClick={() => {
                        // Inampeleka Client moja kwa moja kwenye Inbox
                        navigate("/messages", {
                          state: {
                            startChatWith: app.freelancer_id || app.student,
                            username: app.freelancer_username || "Student",
                          },
                        });
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      Chat with Student
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}