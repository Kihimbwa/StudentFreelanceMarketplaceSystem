import { useState } from "react";
import { createJob } from "../../services/jobService";
import { useNavigate } from "react-router-dom";


function CreateJob(){


const navigate = useNavigate();



const [form,setForm] = useState({

title:"",
category:"",
budget:"",
description:""

});



const [error,setError] = useState("");

const [loading,setLoading] = useState(false);




function handleChange(e){


setForm({

...form,

[e.target.name]:e.target.value

});


}





async function handleSubmit(e){


e.preventDefault();


setLoading(true);

setError("");



try{


await createJob(form);



alert("Job created successfully");



navigate("/jobs");



}

catch(err){


setError(err.message);


}


finally{


setLoading(false);


}


}






return (

<section className="
max-w-3xl
mx-auto
py-10
px-6
">


<div className="
bg-white
shadow
rounded-xl
p-8
">


<h1 className="
text-3xl
font-bold
mb-6
">

Post a New Job

</h1>




<form onSubmit={handleSubmit}>


<input

name="title"

placeholder="Job title"

value={form.title}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>



<input

name="category"

placeholder="Category"

value={form.category}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>



<input

name="budget"

placeholder="Budget"

value={form.budget}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>



<textarea

name="description"

placeholder="Describe your project"

value={form.description}

onChange={handleChange}

className="
w-full
border
p-3
rounded-lg
mb-4
h-32
"

/>




{
error &&

<p className="
text-red-500
mb-4
">

{error}

</p>

}




<button

disabled={loading}

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
"

>

{

loading
?
"Posting..."
:
"Post Job"

}


</button>




</form>


</div>


</section>

);


}


export default CreateJob;