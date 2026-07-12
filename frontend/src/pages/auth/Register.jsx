import InputField from "../../components/forms/InputField";


function Register() {

  return (

    <section className="min-h-[80vh] flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>


        <form>

          <InputField
            label="Full Name"
            placeholder="Enter your name"
          />


          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
          />


          <InputField
            label="Password"
            type="password"
            placeholder="Create password"
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
            Register
          </button>


        </form>

      </div>

    </section>

  );
}

export default Register;