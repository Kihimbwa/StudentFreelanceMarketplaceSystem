const API_URL = "http://localhost:8000/api";



export async function getJobs(){


  const response = await fetch(
    `${API_URL}/jobs/`
  );


  const data = await response.json();



  if(!response.ok){

    throw new Error(
      "Failed to fetch jobs"
    );

  }


  return data;


}




export async function createJob(jobData){


  const token = localStorage.getItem("access");



  const response = await fetch(

    `${API_URL}/jobs/`,

    {

      method:"POST",


      headers:{

        "Content-Type":"application/json",

        "Authorization":`Bearer ${token}`

      },


      body:JSON.stringify(jobData)

    }

  );



  const data = await response.json();



  if(!response.ok){


    throw new Error(

      data.message || "Failed to create job"

    );


  }



  return data;


}