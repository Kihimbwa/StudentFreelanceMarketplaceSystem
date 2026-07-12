function Sidebar() {
  return (
    <aside className="
      w-64
      bg-slate-900
      text-white
      min-h-screen
      p-6
    ">

      <h2 className="text-2xl font-bold mb-8">
        Dashboard
      </h2>


      <nav className="space-y-4">

        <a href="/dashboard">
          Overview
        </a>

        <a href="/jobs">
          Browse Jobs
        </a>

        <a href="/profile">
          Profile
        </a>

        <a href="/login">
          Logout
        </a>

      </nav>


    </aside>
  );
}

export default Sidebar;