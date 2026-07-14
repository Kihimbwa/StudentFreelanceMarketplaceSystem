import { Link } from "react-router-dom";
import { Job } from "../../types";
import { formatBudget, timeAgo, parseSkills } from "../../utils/helpers";
import Badge from "../ui/Badge";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <Badge variant={job.status === "open" ? "success" : "default"} className="ml-2 flex-shrink-0">
          {job.status}
        </Badge>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {parseSkills(job.skills_required).slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-lg font-bold text-slate-900">{formatBudget(job.budget)}</span>
        <span className="text-xs text-slate-400">{timeAgo(job.created_at)}</span>
      </div>
    </Link>
  );
}
