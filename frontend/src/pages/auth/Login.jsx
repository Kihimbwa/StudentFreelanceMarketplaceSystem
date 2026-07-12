import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../../components/forms/InputField";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";



function Login(){


const navigate = useNavigate();


const { login } = useAuth();



const [form,setForm] = useState({

 email:"",
 password:""

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


setError("");

setLoading(true);



try{


const response = await loginUser(form);



console.log(
 "Login success",
 response
);



login(response);



if(response.user.role === "student"){

 navigate("/dashboard");

}


else if(response.user.role === "client"){

 navigate("/client-dashboard");

}



}


catch(err){


setError(
 err.message
);


}


finally{


setLoading(false);


}



}




return (


<section className="
min-h-[80vh]
flex
items-center
justify-center
">


<div className="
bg-white
shadow-lg
rounded-xl
p-8
w-full
max-w-md
">


<h1 className="
text-3xl
font-bold
text-center
mb-6
">

Login

</h1>



<form onSubmit={handleSubmit}>


<InputField

label="Email"

name="email"

type="email"

value={form.email}

onChange={handleChange}

placeholder="Enter email"

/>



<InputField

label="Password"

name="password"

type="password"

value={form.password}

onChange={handleChange}

placeholder="Enter password"

/>




{
error && (

<p className="
text-red-500
text-sm
mb-4
">

{error}

</p>

)

}




<button

disabled={loading}

className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-3
rounded-lg
"

>


{

loading
?
"Logging in..."
:
"Login"

}


</button>



</form>



</div>


</section>


);


}


export default Login;