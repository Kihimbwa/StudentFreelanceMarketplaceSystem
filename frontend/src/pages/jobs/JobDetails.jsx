import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApplicationForm from "../../components/forms/ApplicationForm";


function JobDetails(){


const {id} = useParams();


const [job,setJob] = useState(null);

const [loading,setLoading] = useState(true);
const [showApply,setShowApply] = useState(false);



useEffect(()=>{


async function fetchJob(){


try{


const response = await fetch(
`http://localhost:8000/api/jobs/${id}/`
);



const data = await response.json();


setJob(data);



}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


}


fetchJob();


},[id]);





if(loading){

return (

<div className="text-center py-10">

Loading job...

</div>

);

}





if(!job){

return (

<div className="text-center py-10">

Job not found

</div>

);

}





return (

<section className="
max-w-5xl
mx-auto
px-6
py-10
">


<div className="
bg-white
shadow
rounded-xl
p-8
">


<h1 className="
text-4xl
font-bold
mb-4
">

{job.title}

</h1>



<p className="
text-blue-600
font-medium
">

{job.category}

</p>



<p className="
text-gray-600
mt-6
">

{job.description}

</p>



<div className="
mt-6
text-2xl
font-bold
text-green-600
">

${job.budget}

</div>




<button

onClick={()=>setShowApply(true)}

className="
mt-8
bg-blue-600
text-white
px-8
py-3
rounded-lg
"

>

Apply Now

</button>



</div>

{
showApply && (

<ApplicationForm

jobId={job.id}

close={()=>setShowApply(false)}

/>

)
}

</section>


);


}


export default JobDetails;