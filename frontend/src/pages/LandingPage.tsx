import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Shield,
  Zap,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { jobService } from "../services/endpoints";
import { Job } from "../types";
import { formatBudget, timeAgo, parseSkills } from "../utils/helpers";
import Badge from "../components/ui/Badge";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService
      .getAll()
      .then((data) => setJobs(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const features = [
    {
      icon: Search,
      title: "Smart Job Search",
      description: "Find opportunities that match your skills with powerful filters and search.",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "JWT-authenticated platform with verified users and transparent reviews.",
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Apply to jobs in minutes with a streamlined proposal process.",
    },
    {
      icon: MessageSquare,
      title: "Built-in Messaging",
      description: "Communicate directly with clients or students through our messaging system.",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Jobs" },
    { value: "1,200+", label: "Students" },
    { value: "300+", label: "Clients" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.1) 0%, transparent 40%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-sm font-medium mb-6">
              <Sparkle />
              <span>Built for university students</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Find freelance work<br />
              <span className="bg-gradient-to-r from-sky-600 to-slate-900 bg-clip-text text-transparent">
                that fits your studies
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              StudentGig connects university students with real freelance opportunities.
              Browse jobs, submit proposals, and build your professional reputation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/jobs" : "/register"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
              >
                {isAuthenticated ? "Browse Jobs" : "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                Explore Jobs
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Jobs</h2>
              <p className="text-slate-500 mt-2">Latest opportunities posted by clients</p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View all jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {job.title}
                      </h3>
                      <Badge variant="success">{job.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {parseSkills(job.skills_required).slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-lg font-bold text-slate-900">{formatBudget(job.budget)}</span>
                      <span className="text-xs text-slate-400">{timeAgo(job.created_at)}</span>
                    </div>
                  </Link>
                ))}
          </div>

          {!loading && jobs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No jobs posted yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-slate-600">
              A complete platform designed for the modern student freelancer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: GraduationCap,
                title: "Create your profile",
                description: "Sign up as a student or client and set up your profile with your skills and details.",
              },
              {
                step: "02",
                icon: Search,
                title: "Browse & Apply",
                description: "Students find jobs that match their skills and submit proposals with their bid.",
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Connect & Work",
                description: "Clients review applications, accept the best fit, and start collaborating via messages.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-slate-100 mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)"
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Join StudentGig today and connect with opportunities that match your skills.
          </p>
          <Link
            to={isAuthenticated ? "/jobs" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 shadow-lg transition-all"
          >
            {isAuthenticated ? "Browse Jobs" : "Create Free Account"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Sparkle() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 5L18 8l-4.5 1L12 14l-1.5-5L6 8l4.5-1L12 2z" />
    </svg>
  );
}
