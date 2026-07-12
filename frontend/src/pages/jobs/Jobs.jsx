import { useEffect, useState } from "react";
import JobCard from "../../components/ui/JobCard";
import { getJobs } from "../../services/jobService";



function Jobs(){


const [jobs,setJobs] = useState([]);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");





useEffect(()=>{


async function loadJobs(){


try{


const data = await getJobs();


setJobs(data);



}

catch(err){


setError(
err.message
);


}

finally{


setLoading(false);


}



}



loadJobs();



},[]);







if(loading){


return (

<div className="text-center py-10">

<h1 className="text-xl">
Loading jobs...
</h1>

</div>

);


}






if(error){


return (

<div className="text-center py-10 text-red-500">

{error}

</div>

);


}






return (

<section className="
max-w-7xl
mx-auto
px-6
py-10
">


<h1 className="
text-4xl
font-bold
mb-8
">

Available Projects

</h1>




<div className="
grid
md:grid-cols-3
gap-6
">



{

jobs.map((job)=>(


<JobCard

key={job.id}

id={job.id}

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