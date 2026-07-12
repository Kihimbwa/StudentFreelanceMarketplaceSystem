import Sidebar from "../../components/dashboard/Sidebar";
import { useAuth } from "../../context/AuthContext";


function StudentDashboard(){

    const { user } = useAuth();

  return (

    <div className="flex">

      <Sidebar />


      <main className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-6">
 Welcome {user?.name}
</h1>


        <div className="grid md:grid-cols-3 gap-6">


          <div className="bg-white shadow p-6 rounded-xl">

            <h2 className="font-bold text-xl">
              Applications
            </h2>

            <p className="text-gray-600 mt-2">
              5 Active Applications
            </p>

          </div>


          <div className="bg-white shadow p-6 rounded-xl">

            <h2 className="font-bold text-xl">
              Completed Jobs
            </h2>

            <p className="text-gray-600 mt-2">
              12 Proj<h1 className="text-4xl font-bold mb-6">
          Student Dashboard
        </h1>ects
            </p>

          </div>


          <div className="bg-white shadow p-6 rounded-xl">

            <h2 className="font-bold text-xl">
              Earnings
            </h2>

            <p className="text-green-600 mt-2">
              $450
            </p>

          </div>


        </div>


      </main>


    </div>

  );

}


export default StudentDashboard;