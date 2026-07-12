import { useEffect,useState } from "react";
import { getProfile, updateProfile } from "../../services/profileService";



function ClientProfile(){


const [profile,setProfile]=useState(null);


const [form,setForm]=useState({

company_name:"",
description:"",
location:""

});





useEffect(()=>{


async function load(){


const data=await getProfile();


setProfile(data);


setForm({

company_name:data.company_name || "",

description:data.description || "",

location:data.location || ""

});


}


load();


},[]);





function handleChange(e){


setForm({

...form,

[e.target.name]:e.target.value

});


}






async function submit(e){


e.preventDefault();


await updateProfile(form);


alert("Profile updated");


}





if(!profile){

return <h1 className="text-center py-10">

Loading...

</h1>

}






return (

<section className="max-w-4xl mx-auto py-10 px-6">


<div className="bg-white shadow rounded-xl p-8">


<h1 className="text-3xl font-bold mb-6">

Client Profile

</h1>



<form onSubmit={submit}>


<input

name="company_name"

value={form.company_name}

onChange={handleChange}

placeholder="Company name"

className="w-full border p-3 rounded-lg mb-4"

/>




<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Company description"

className="w-full border p-3 rounded-lg mb-4"

/>




<input

name="location"

value={form.location}

onChange={handleChange}

placeholder="Location"

className="w-full border p-3 rounded-lg mb-4"

/>





<button

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
"

>

Save Profile

</button>



</form>


</div>


</section>

);


}


export default ClientProfile;