function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-blue-600">
          Student Freelance
        </h1>

        <div className="flex gap-6 text-gray-700">
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
          <a href="/login">Login</a>
          <a
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Register
          </a>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;