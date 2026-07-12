function JobCard({ title, category, budget, description }) {

  return (
    <div className="
      bg-white
      rounded-xl
      shadow-sm
      border
      p-6
      hover:shadow-md
      transition
    ">

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>


      <p className="text-sm text-blue-600 mt-2">
        {category}
      </p>


      <p className="text-gray-600 mt-4">
        {description}
      </p>


      <div className="flex justify-between items-center mt-6">

        <span className="font-bold text-green-600">
          ${budget}
        </span>


        <button
          className="
          bg-blue-600
          text-white
          px-5
          py-2
          rounded-lg
          "
        >
          Apply
        </button>

      </div>


    </div>
  );
}

export default JobCard;