import { Link } from "react-router-dom";


function ClientDashboard(){


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

Client Dashboard

</h1>


<p className="
text-gray-600
mb-8
">

Manage your projects and hire talented students.

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

Posted Jobs

</h2>


<p className="
text-gray-500
mt-3
">

0 Active Jobs

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

Applications

</h2>


<p className="
text-gray-500
mt-3
">

0 Applications

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

Actions

</h2>



<Link

to="/create-job"

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

+ Post New Job

</Link>



</div>



</div>



</div>


</section>


);


}


export default ClientDashboard;