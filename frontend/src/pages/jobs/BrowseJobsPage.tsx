import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Job } from "../../types";
import { jobService } from "../../services/endpoints";
import JobCard from "../../components/jobs/JobCard";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { SkeletonList } from "../../components/ui/Skeleton";
import { parseSkills } from "../../utils/helpers";

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getAll();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    jobs.forEach((job) => parseSkills(job.skills_required).forEach((s) => skillSet.add(s)));
    return Array.from(skillSet).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills_required.toLowerCase().includes(q)
      );
    }
    if (skillFilter) {
      result = result.filter((j) =>
        parseSkills(j.skills_required).some((s) => s.toLowerCase() === skillFilter.toLowerCase())
      );
    }
    if (budgetFilter) {
      const budget = parseFloat(budgetFilter);
      result = result.filter((j) => parseFloat(j.budget) >= budget);
    }
    if (statusFilter) {
      result = result.filter((j) => j.status === statusFilter);
    }
    return result;
  }, [jobs, search, skillFilter, budgetFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedJobs = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch("");
    setSkillFilter("");
    setBudgetFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const hasFilters = search || skillFilter || budgetFilter || statusFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Jobs</h1>
        <p className="text-slate-500">
          {loading ? "Loading..." : `${filtered.length} job${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search jobs by title, description, or skills..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-slide-down">
            <Select
              label="Skill"
              value={skillFilter}
              onChange={(e) => { setSkillFilter(e.target.value); setPage(1); }}
            >
              <option value="">All skills</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </Select>
            <Select
              label="Minimum Budget"
              value={budgetFilter}
              onChange={(e) => { setBudgetFilter(e.target.value); setPage(1); }}
            >
              <option value="">Any budget</option>
              <option value="50000">50,000+ TZS</option>
              <option value="100000">100,000+ TZS</option>
              <option value="300000">300,000+ TZS</option>
              <option value="500000">500,000+ TZS</option>
              <option value="1000000">1,000,000+ TZS</option>
            </Select>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
            {hasFilters && (
              <div className="sm:col-span-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4" />
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job List */}
      {loading ? (
        <SkeletonList count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchJobs} />
      ) : pagedJobs.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No matching jobs" : "No jobs available"}
          message={hasFilters ? "Try adjusting your search or filters." : "Check back later for new opportunities."}
          icon={<Search className="w-8 h-8" />}
          action={hasFilters ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
