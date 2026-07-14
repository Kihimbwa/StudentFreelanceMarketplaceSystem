import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Clock, MessageSquare, Star } from "lucide-react";
import { Application } from "../../types";
import { applicationService, reviewService, messageService } from "../../services/endpoints";
import { useToast } from "../../context/ToastContext";
import { formatBudget, timeAgo, getErrorMessage } from "../../utils/helpers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [reviewModal, setReviewModal] = useState<{ studentId: number; studentName: string } | null>(null);
  const [messageModal, setMessageModal] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [messageContent, setMessageContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const jobId = parseInt(id || "0");

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getAll({ job: jobId });
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load applicants"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (appId: number, status: "accepted" | "rejected") => {
    setUpdating(appId);
    try {
      await applicationService.update(appId, { status });
      toast.success(`Application ${status}!`);
      fetchApps();
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to ${status} application`));
    } finally {
      setUpdating(null);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      await reviewService.create({
        reviewee: reviewModal.studentId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Review submitted!");
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit review"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageModal) return;
    setSubmitting(true);
    try {
      await messageService.create({
        receiver: messageModal,
        content: messageContent,
      });
      toast.success("Message sent!");
      setMessageModal(null);
      setMessageContent("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    pending: { variant: "warning" as const, icon: Clock, label: "Pending" },
    accepted: { variant: "success" as const, icon: CheckCircle2, label: "Accepted" },
    rejected: { variant: "danger" as const, icon: XCircle, label: "Rejected" },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Applicants</h1>
        <p className="text-slate-500">
          {loading ? "Loading..." : `${applications.length} applicant${applications.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchApps} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          message="When students apply to your job, they'll appear here."
          icon={<CheckCircle2 className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const cfg = statusConfig[app.status];
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Avatar name={`Student ${app.student}`} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/profile/student/${app.student}`}
                        className="font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                      >
                        Student #{app.student}
                      </Link>
                      <Badge variant={cfg.variant}>
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">{app.proposal}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="font-medium text-slate-700">
                        Bid: {formatBudget(app.bid_amount)}
                      </span>
                      <span>Applied {timeAgo(app.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(app.id, "accepted")}
                          loading={updating === app.id}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(app.id, "rejected")}
                          loading={updating === app.id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {app.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewModal({ studentId: app.student, studentName: `Student ${app.student}` })}
                      >
                        <Star className="w-4 h-4" />
                        Leave Review
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMessageModal(app.student)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title="Leave a Review">
        <form onSubmit={handleReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                >
                  <Star
                    className={`w-7 h-7 ${n <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Comment"
            placeholder="Share your experience working with this student..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setReviewModal(null)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={submitting}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Message Modal */}
      <Modal open={!!messageModal} onClose={() => setMessageModal(null)} title="Send Message">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Textarea
            label="Your Message"
            placeholder="Write your message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setMessageModal(null)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={submitting}>
              Send
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
