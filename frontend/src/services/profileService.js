const API_URL = "http://localhost:8000/api";



export async function getProfile(){


const token = localStorage.getItem("access");



const response = await fetch(

`${API_URL}/profile/`,

{

headers:{

"Authorization":`Bearer ${token}`

}

}

);



const data = await response.json();



if(!response.ok){

throw new Error(
"Failed to load profile"
);

}



return data;


}






export async function updateProfile(profileData){


const token = localStorage.getItem("access");



const response = await fetch(

`${API_URL}/profile/`,

{

method:"PUT",


headers:{

"Content-Type":"application/json",

"Authorization":`Bearer ${token}`

},


body:JSON.stringify(profileData)


}

);



const data = await response.json();



if(!response.ok){

throw new Error(
"Profile update failed"
);

}



return data;


}