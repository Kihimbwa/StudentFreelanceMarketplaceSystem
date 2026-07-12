import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { getJobApplicants } from "../../services/applicationService";



function JobApplicants(){


const {id}=useParams();


const [apps,setApps]=useState([]);





useEffect(()=>{


async function load(){


const data = await getJobApplicants(id);


setApps(data);


}


load();


},[id]);






return (

<section className="
max-w-6xl
mx-auto
py-10
px-6
">


<h1 className="
text-3xl
font-bold
mb-8
">

Applicants

</h1>




<div className="grid gap-5">


{

apps.map((app)=>(


<div

key={app.id}

className="
bg-white
shadow
rounded-xl
p-6
"

>


<h2 className="font-bold">

{app.student.username}

</h2>



<p className="mt-3">

{app.cover_letter}

</p>


</div>


))


}



</div>


</section>

);


}


export default JobApplicants;