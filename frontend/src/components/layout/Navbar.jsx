import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";


function Navbar(){


const { user, logout } = useAuth();

const navigate = useNavigate();


const [open,setOpen] = useState(false);





function handleLogout(){


logout();

navigate("/login");


}






return (

<nav className="
bg-white
shadow-sm
border-b
">


<div className="
max-w-7xl
mx-auto
px-6
py-4
flex
items-center
justify-between
">


{/* Logo */}

<Link

to="/"

className="
text-2xl
font-bold
text-blue-600
"

>

StudentHub

</Link>





{/* Links */}

<div className="
flex
items-center
gap-6
">



<Link to="/jobs">

Jobs

</Link>




{
user && user.role === "client" && (

<Link to="/create-job">

Post Job

</Link>

)

}





{
user && user.role === "student" && (

<Link to="/my-applications">

Applications

</Link>

)

}





{
!user && (

<>

<Link to="/login">

Login

</Link>



<Link

to="/register"

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
"

>

Register

</Link>

</>

)

}






{
user && (


<div className="relative">


<button

onClick={()=>setOpen(!open)}

className="
flex
items-center
gap-2
font-medium
"

>


<div className="
w-9
h-9
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
"

>

{

user.username
?
user.username.charAt(0).toUpperCase()
:
"U"

}

</div>



{user.username}


</button>





{

open && (

<div className="
absolute
right-0
mt-3
bg-white
shadow-lg
rounded-xl
p-4
w-48
">


<Link

to={
user.role==="student"
?
"/student-profile"
:
"/client-profile"
}

className="
block
py-2
"

>

My Profile

</Link>





<button

onClick={handleLogout}

className="
block
py-2
text-red-500
"

>

Logout

</button>




</div>

)

}



</div>


)

}



</div>


</div>


</nav>

);


}


export default Navbar;