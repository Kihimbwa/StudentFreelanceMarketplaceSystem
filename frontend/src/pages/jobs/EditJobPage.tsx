import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Trash2 } from "lucide-react";
import { jobService } from "../../services/endpoints";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/helpers";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills_required: "",
    status: "open" as string,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const jobId = parseInt(id || "0");

  useEffect(() => {
    jobService
      .getById(jobId)
      .then((data) => {
        setForm({
          title: data.title,
          description: data.description,
          budget: data.budget,
          skills_required: data.skills_required,
          status: data.status,
        });
      })
      .catch((err) => toast.error(getErrorMessage(err, "Failed to load job")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await jobService.update(jobId, form);
      toast.success("Job updated successfully!");
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update job"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobService.delete(jobId);
      toast.success("Job deleted successfully!");
      navigate("/dashboard/client");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete job"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Spinner size="lg" className="py-20" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Job</h1>
          <p className="text-slate-500">Update your job posting.</p>
        </div>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="min-h-[150px]"
        />
        <Input
          label="Budget (TZS)"
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          required
        />
        <Input
          label="Skills Required"
          value={form.skills_required}
          onChange={(e) => setForm({ ...form, skills_required: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Job?" size="sm">
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
