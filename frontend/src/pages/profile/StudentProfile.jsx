import { useEffect,useState } from "react";
import { getProfile, updateProfile } from "../../services/profileService";



function StudentProfile(){


const [profile,setProfile]=useState(null);


const [form,setForm]=useState({

bio:"",
skills:"",
portfolio:""

});





useEffect(()=>{


async function load(){


const data = await getProfile();


setProfile(data);


setForm({

bio:data.bio || "",

skills:data.skills || "",

portfolio:data.portfolio || ""

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






async function handleSubmit(e){


e.preventDefault();


await updateProfile(form);


alert("Profile updated");


}






if(!profile){

return (

<h1 className="text-center py-10">

Loading profile...

</h1>

)

}






return (

<section className="
max-w-4xl
mx-auto
py-10
px-6
">


<div className="
bg-white
rounded-xl
shadow
p-8
">


<h1 className="
text-3xl
font-bold
mb-6
">

Student Profile

</h1>




<form onSubmit={handleSubmit}>


<textarea

name="bio"

value={form.bio}

onChange={handleChange}

placeholder="About you"

className="
w-full
border
p-4
rounded-lg
mb-4
"

/>





<input

name="skills"

value={form.skills}

onChange={handleChange}

placeholder="Skills (React, Python, Design)"

className="
w-full
border
p-3
rounded-lg
mb-4
"

/>





<input

name="portfolio"

value={form.portfolio}

onChange={handleChange}

placeholder="Portfolio URL"

className="
w-full
border
p-3
rounded-lg
mb-4
"

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


export default StudentProfile;