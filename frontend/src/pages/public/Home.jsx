function Home() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center">

      <div className="text-center max-w-3xl">

        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Connect Students With Freelance Opportunities
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          A marketplace where students can showcase their skills,
          find projects, and earn while learning.
        </p>

        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
          Find Projects
        </button>

      </div>

    </section>
  );
}

export default Home;