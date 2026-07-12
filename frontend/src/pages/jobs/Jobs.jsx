import JobCard from "../../components/ui/JobCard";


function Jobs() {


  const jobs = [
    {
      id:1,
      title:"Build React Website",
      category:"Web Development",
      budget:150,
      description:
      "Need a student developer to create a modern website."
    },

    {
      id:2,
      title:"Design Social Media Posters",
      category:"Graphic Design",
      budget:50,
      description:
      "Create creative posters for a small business."
    },


    {
      id:3,
      title:"Database Project Help",
      category:"Database",
      budget:100,
      description:
      "Need assistance designing database systems."
    }
  ];


  return (

    <section className="max-w-7xl mx-auto px-6 py-10">


      <h1 className="text-4xl font-bold mb-8">
        Available Projects
      </h1>


      <div className="grid md:grid-cols-3 gap-6">


        {
          jobs.map((job)=>(

            <JobCard
              key={job.id}
              title={job.title}
              category={job.category}
              budget={job.budget}
              description={job.description}
            />

          ))
        }


      </div>


    </section>

  );
}


export default Jobs;