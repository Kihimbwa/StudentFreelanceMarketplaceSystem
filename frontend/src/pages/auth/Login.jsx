import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/forms/InputField";


function Login() {


  const { login } = useAuth();

  const navigate = useNavigate();



  function handleLogin(e){

    e.preventDefault();


    login({
      name:"John Student",
      email:"student@test.com",
      role:"student"
    });


    navigate("/dashboard");

  }



  return (

    <section className="min-h-[80vh] flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>


        <form onSubmit={handleLogin}>


          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
          />


          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
          />


          <button
            className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-lg
            mt-4
            "
          >

            Login

          </button>


        </form>


      </div>

    </section>

  );
}


export default Login;