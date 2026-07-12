import { useState } from "react";
import { applyJob } from "../../services/applicationService";



function ApplicationForm({jobId, close}){


const [coverLetter,setCoverLetter] = useState("");

const [loading,setLoading] = useState(false);

const [error,setError] = useState("");





async function handleSubmit(e){

e.preventDefault();


setLoading(true);

setError("");



try{


await applyJob(
jobId,
{
cover_letter:coverLetter
}
);



alert("Application sent successfully");


close();



}

catch(err){


setError(err.message);


}

finally{


setLoading(false);


}


}





return (

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
">


<div className="
bg-white
rounded-xl
p-8
w-full
max-w-lg
">


<h2 className="
text-2xl
font-bold
mb-5
">

Apply for this Job

</h2>




<textarea

value={coverLetter}

onChange={(e)=>setCoverLetter(e.target.value)}

placeholder="Write a short proposal..."

className="
w-full
border
rounded-lg
p-4
h-32
"

/>




{
error &&

<p className="
text-red-500
mt-3
">

{error}

</p>

}




<div className="
flex
gap-4
mt-5
">


<button

onClick={close}

className="
px-5
py-2
border
rounded-lg
"

>

Cancel

</button>




<button

onClick={handleSubmit}

disabled={loading}

className="
bg-blue-600
text-white
px-5
py-2
rounded-lg
"

>

{

loading
?
"Sending..."
:
"Submit Application"

}


</button>



</div>


</div>


</div>

);


}


export default ApplicationForm;