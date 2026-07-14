import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Lock, User as UserIcon, Mail, ArrowRight, GraduationCap, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getErrorMessage } from "../../utils/helpers";
import { UserRole } from "../../types";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully!");
      navigate(form.role === "client" ? "/dashboard/client" : "/dashboard/student", { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err, "Registration failed");
      if (msg.includes("username")) setErrors({ username: msg });
      else if (msg.includes("email")) setErrors({ email: msg });
      else setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">StudentGig</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
          <p className="text-slate-500 mb-8">Join StudentGig and start your journey</p>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {errors.form}
            </div>
          )}

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "student" })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                form.role === "student"
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">I'm a Student</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "client" })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                form.role === "client"
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm font-medium">I'm a Client</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              icon={<UserIcon className="w-4 h-4" />}
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              error={errors.username}
              required
            />
            <Input
              label="Email"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              required
              minLength={6}
            />

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)"
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">StudentGig</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Start your freelance<br />career today
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Whether you're looking for talent or looking for work, StudentGig connects you with the right people.
          </p>
          <div className="space-y-4">
            {[
              "Free to join — no hidden fees",
              "Verified student talent from universities",
              "Secure messaging and transparent reviews",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
