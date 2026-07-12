import Sidebar from "../../components/dashboard/Sidebar";


function ClientDashboard(){

  return (

    <div className="flex">

      <Sidebar />


      <main className="flex-1 p-10">


        <h1 className="text-4xl font-bold mb-6">
          Client Dashboard
        </h1>


        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-xl font-bold">
            Posted Jobs
          </h2>


          <p className="text-gray-600 mt-2">
            Manage your freelance projects here.
          </p>


        </div>


      </main>


    </div>

  );

}


export default ClientDashboard;