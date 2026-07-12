import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";



function MyApplications(){


const [applications,setApplications]=useState([]);

const [loading,setLoading]=useState(true);





useEffect(()=>{


async function load(){


try{


const data = await getMyApplications();


setApplications(data);


}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}


}


load();


},[]);






if(loading){

return <h1 className="text-center py-10">
Loading applications...
</h1>

}






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

My Applications

</h1>




<div className="
grid
md:grid-cols-2
gap-6
">


{

applications.map((app)=>(


<div

key={app.id}

className="
bg-white
shadow
rounded-xl
p-6
"

>


<h2 className="
font-bold
text-xl
">

{app.job.title}

</h2>



<p className="
mt-3
text-gray-600
">

Status:

<span className="font-bold">

 {app.status}

</span>

</p>


</div>


))


}


</div>


</section>

);


}


export default MyApplications;