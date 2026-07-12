import { Link } from "react-router-dom";


function StudentDashboard(){


return (

<section className="
min-h-screen
bg-gray-50
p-8
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-4xl
font-bold
mb-3
">

Student Dashboard

</h1>



<p className="
text-gray-600
mb-8
">

Find projects, apply and grow your skills.

</p>




<div className="
grid
md:grid-cols-3
gap-6
">



<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
">

Available Jobs

</h2>


<p className="
text-gray-500
mt-3
">

Browse projects from clients

</p>



<Link

to="/jobs"

className="
inline-block
mt-4
bg-blue-600
text-white
px-5
py-3
rounded-lg
"

>

Browse Jobs

</Link>



</div>




<div className="
bg-white
rounded-xl
shadow
p-6
">

<h2 className="
text-xl
font-bold
">

Applications

</h2>


<p className="
text-gray-500
mt-3
">

Track your applications

</p>


</div>





<div className="
bg-white
rounded-xl
shadow
p-6
">

<h2 className="
text-xl
font-bold
">

Earnings

</h2>


<p className="
text-gray-500
mt-3
">

Your completed projects

</p>


</div>




</div>



</div>


</section>


);


}


export default StudentDashboard;