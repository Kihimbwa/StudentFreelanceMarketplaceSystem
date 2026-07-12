const API_URL = "http://localhost:8000/api";



export async function applyJob(jobId, applicationData){


const token = localStorage.getItem("access");


const response = await fetch(

`${API_URL}/applications/`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Authorization":`Bearer ${token}`

},


body:JSON.stringify({

job:jobId,

cover_letter:applicationData.cover_letter

})

}

);



const data = await response.json();


if(!response.ok){

throw new Error(
data.message || "Application failed"
);

}


return data;


}






export async function getMyApplications(){


const token = localStorage.getItem("access");


const response = await fetch(

`${API_URL}/applications/my/`,

{

headers:{

"Authorization":`Bearer ${token}`

}

}

);



const data = await response.json();



if(!response.ok){

throw new Error(
"Failed to load applications"
);

}



return data;


}







export async function getJobApplicants(jobId){


const token = localStorage.getItem("access");



const response = await fetch(

`${API_URL}/jobs/${jobId}/applications/`,

{

headers:{

"Authorization":`Bearer ${token}`

}

}

);



const data = await response.json();



if(!response.ok){

throw new Error(
"Failed to load applicants"
);

}



return data;


}