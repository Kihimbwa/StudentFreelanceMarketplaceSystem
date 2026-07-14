import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button>
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
