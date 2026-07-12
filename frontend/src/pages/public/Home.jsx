import { Link } from "react-router-dom";
import { ArrowRight, Code, Palette, Database, Smartphone } from "lucide-react";
import { motion } from "framer-motion";



function Home(){


const categories=[

{
title:"Web Development",
icon:<Code size={32}/>
},

{
title:"UI/UX Design",
icon:<Palette size={32}/>
},

{
title:"Data Science",
icon:<Database size={32}/>
},

{
title:"Mobile Apps",
icon:<Smartphone size={32}/>
}

];





return (

<div>



{/* HERO */}


<section className="
container
py-20
grid
md:grid-cols-2
gap-12
items-center
">



<motion.div

initial={{opacity:0,x:-40}}

animate={{opacity:1,x:0}}

>


<h1 className="
text-5xl
font-bold
leading-tight
text-slate-900
">

Hire talented students.
Build amazing projects.

</h1>



<p className="
mt-6
text-lg
text-slate-600
">

A freelance marketplace connecting
students with clients worldwide.

</p>




<div className="
mt-8
flex
gap-4
">


<Link

to="/jobs"

className="
bg-blue-600
text-white
px-6
py-3
rounded-xl
flex
items-center
gap-2
"

>

Find Talent

<ArrowRight size={20}/>

</Link>



<Link

to="/create-job"

className="
border
px-6
py-3
rounded-xl
"

>

Post Project

</Link>



</div>



</motion.div>






<div className="
bg-gradient-to-br
from-blue-600
to-purple-600
rounded-3xl
h-96
flex
items-center
justify-center
text-white
text-5xl
font-bold
">


StudentHub


</div>




</section>







{/* CATEGORY */}


<section className="
container
py-10
">


<h2 className="
text-3xl
font-bold
mb-8
">

Explore Skills

</h2>




<div className="
grid
md:grid-cols-4
gap-6
">



{

categories.map((item,index)=>(


<motion.div

key={index}

whileHover={{
y:-8
}}

className="
bg-white
rounded-2xl
shadow-sm
p-6
border
"

>


<div className="
text-blue-600
mb-4
">

{item.icon}

</div>



<h3 className="
font-bold
text-lg
">

{item.title}

</h3>



</motion.div>



))

}


</div>


</section>



</div>


);


}


export default Home;