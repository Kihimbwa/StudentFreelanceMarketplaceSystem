import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
  Send,
  MessageSquare,
} from "lucide-react";
import { Job, Application } from "../../types";
import { jobService, applicationService, messageService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatBudget, formatDate, parseSkills, timeAgo, getErrorMessage } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import Modal from "../../components/ui/Modal";
import JobCard from "../../components/jobs/JobCard";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isStudent, isAuthenticated } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [applyForm, setApplyForm] = useState({ proposal: "", bid_amount: "" });
  const [messageContent, setMessageContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const jobId = parseInt(id || "0");

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getById(jobId);
      setJob(data);
      const allJobs = await jobService.getAll();
      const similar = allJobs
        .filter((j) => j.id !== jobId && j.status === "open")
        .slice(0, 3);
      setSimilarJobs(similar);
      if (isStudent && user) {
        const apps = await applicationService.getAll();
        setMyApplications(apps.filter((a) => a.student === user.id && a.job === jobId));
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load job details"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationService.create({
        job: jobId,
        proposal: applyForm.proposal,
        bid_amount: applyForm.bid_amount,
      });
      toast.success("Application submitted successfully!");
      setShowApply(false);
      setApplyForm({ proposal: "", bid_amount: "" });
      fetchJob();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit application"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    try {
      await messageService.create({
        receiver: job.client_id,
        content: messageContent,
      });
      toast.success("Message sent!");
      setShowMessage(false);
      setMessageContent("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Spinner size="lg" className="py-20" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState message={error || "Job not found"} onRetry={fetchJob} />
      </div>
    );
  }

  const hasApplied = myApplications.length > 0;
  const isOwner = user?.id === job.client_id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Badge variant={job.status === "open" ? "success" : "default"} className="mb-3">
                  {job.status}
                </Badge>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h1>
                <p className="text-sm text-slate-400">Posted {timeAgo(job.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Budget</p>
                  <p className="text-lg font-semibold text-slate-900">{formatBudget(job.budget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Posted on</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(job.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {parseSkills(job.skills_required).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Similar Jobs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarJobs.map((sj) => (
                  <JobCard key={sj.id} job={sj} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">About the Client</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={`Client ${job.client_id}`} size="lg" />
              <div>
                <p className="font-semibold text-slate-900">Client #{job.client_id}</p>
                <p className="text-xs text-slate-400">Member since 2026</p>
              </div>
            </div>
            {isAuthenticated && !isOwner && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowMessage(true)}
              >
                <MessageSquare className="w-4 h-4" />
                Contact Client
              </Button>
            )}
          </div>

          {/* Apply Section */}
          {isStudent && job.status === "open" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {hasApplied ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Application Submitted</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    You applied with a bid of {formatBudget(myApplications[0].bid_amount)}
                  </p>
                  <Badge variant="info" className="capitalize">{myApplications[0].status}</Badge>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-slate-900 mb-1">Apply for this job</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Submit your proposal and bid for this opportunity.
                  </p>
                  <Button fullWidth onClick={() => setShowApply(true)}>
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Manage Job</h3>
              <div className="space-y-2">
                <Link to={`/jobs/${job.id}/applicants`}>
                  <Button variant="outline" fullWidth>
                    <Briefcase className="w-4 h-4" />
                    View Applicants
                  </Button>
                </Link>
                <Link to={`/jobs/${job.id}/edit`}>
                  <Button variant="outline" fullWidth>Edit Job</Button>
                </Link>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
              <h3 className="font-semibold text-slate-900 mb-1">Want to apply?</h3>
              <p className="text-sm text-slate-500 mb-4">Sign in to submit your proposal.</p>
              <Link to="/login">
                <Button fullWidth>Sign in</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal open={showApply} onClose={() => setShowApply(false)} title="Submit Proposal">
        <form onSubmit={handleApply} className="space-y-4">
          <Textarea
            label="Your Proposal"
            placeholder="Describe why you're the best fit for this job..."
            value={applyForm.proposal}
            onChange={(e) => setApplyForm({ ...applyForm, proposal: e.target.value })}
            required
            className="min-h-[120px]"
          />
          <Input
            label="Your Bid Amount (TZS)"
            type="number"
            placeholder="e.g. 450000"
            value={applyForm.bid_amount}
            onChange={(e) => setApplyForm({ ...applyForm, bid_amount: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setShowApply(false)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Message Modal */}
      <Modal open={showMessage} onClose={() => setShowMessage(false)} title="Send Message">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Textarea
            label="Your Message"
            placeholder="Write your message to the client..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
            className="min-h-[120px]"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setShowMessage(false)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={submitting}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
