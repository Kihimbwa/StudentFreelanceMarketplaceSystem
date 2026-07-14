import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase } from "lucide-react";
import { jobService } from "../../services/endpoints";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/helpers";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills_required: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const job = await jobService.create(form);
      toast.success("Job posted successfully!");
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to create job");
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a New Job</h1>
        <p className="text-slate-500">Find the perfect student for your project.</p>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Job Title"
          placeholder="e.g. Mobile App UI Design"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Describe the job in detail. What do you need done? What are the requirements?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="min-h-[150px]"
        />
        <Input
          label="Budget (TZS)"
          type="number"
          placeholder="e.g. 150000"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          required
        />
        <Input
          label="Skills Required"
          placeholder="e.g. Figma, UI/UX, React (comma-separated)"
          value={form.skills_required}
          onChange={(e) => setForm({ ...form, skills_required: e.target.value })}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={loading}>
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
}
