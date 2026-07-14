import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { useAuth, getHomeRoute } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getErrorMessage } from "../../utils/helpers";

// Function ya siri ya kusoma data iliyofichwa ndani ya JWT token (Decryption)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      // 1. Fanya login (Hii itasave access token)
      await login(form);
      toast.success("Welcome back!");

      // 2. Kwasababu backend haileti user object, tunasoma access token kwenye localStorage
      const accessToken = localStorage.getItem("access") || localStorage.getItem("accessToken");
      
      let userRole: "student" | "client" = "student"; // Default role kama isipopatikana
      
      if (accessToken) {
        const decoded = parseJwt(accessToken);
        // Kama backend imeweka role ndani ya token payload tutaipata hapa, 
        // la sivyo tunaangalia kama username uliyotumia inaashiria role yako.
        if (decoded && decoded.role) {
          userRole = decoded.role;
        } else {
          // Kama backend haikuweka role kwenye token kabisa, tunamrudisha kwenye dashboard ya student
          // AU unaweza kuweka check hapa kulingana na akaunti uliyotengeneza
          userRole = form.username.toLowerCase().includes("client") ? "client" : "student";
        }
      }

      const targetRoute = getHomeRoute(userRole);
      navigate(from || targetRoute, { replace: true });

    } catch (err) {
      const msg = getErrorMessage(err, "Invalid credentials");
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)"
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">StudentGig</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Where students<br />meet opportunity
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Join the marketplace built for university talent. Find freelance work that fits your skills and schedule.
          </p>
          <div className="space-y-4">
            {[
              "Browse hundreds of student-friendly jobs",
              "Apply with proposals that showcase your skills",
              "Build your reputation with verified reviews",
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

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">StudentGig</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              icon={<UserIcon className="w-4 h-4" />}
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              error={errors.username}
              required
            />
            <Input
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              required
            />

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-sky-600 hover:text-sky-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}