import { useState } from "react";
import InputField from "../../components/forms/InputField";
import { validateRegister } from "../../utils/validation";
import { registerUser } from "../../services/authService";


function Register() {


  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""

  });


  const [errors, setErrors] = useState({});


  const [loading, setLoading] = useState(false);



  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  }




  async function handleSubmit(e) {

    e.preventDefault();


    const validationErrors = validateRegister(form);


    setErrors(validationErrors);



    if (Object.keys(validationErrors).length > 0) {

      return;

    }



    setLoading(true);



    try {


      const response = await registerUser(form);



      console.log(
        "Registration successful:",
        response
      );


      alert("Account created successfully");



    }

    catch(error) {


      console.log(error);


      alert(
        error.message
      );


    }


    finally {


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

          Create Account

        </h1>



        <form onSubmit={handleSubmit}>


          <InputField

            label="Full Name"

            name="name"

            value={form.name}

            onChange={handleChange}

            placeholder="Enter your name"

            error={errors.name}

          />



          <InputField

            label="Email"

            name="email"

            type="email"

            value={form.email}

            onChange={handleChange}

            placeholder="Enter your email"

            error={errors.email}

          />




          <InputField

            label="Password"

            name="password"

            type="password"

            value={form.password}

            onChange={handleChange}

            placeholder="Create password"

            error={errors.password}

          />




          <InputField

            label="Confirm Password"

            name="confirmPassword"

            type="password"

            value={form.confirmPassword}

            onChange={handleChange}

            placeholder="Confirm password"

            error={errors.confirmPassword}

          />




          <div className="mb-5">


            <label className="
              block
              mb-2
              font-medium
              text-gray-700
            ">

              Account Type

            </label>




            <select

              name="role"

              value={form.role}

              onChange={handleChange}


              className="
                w-full
                px-4
                py-3
                border
                rounded-lg
                outline-none
                focus:border-blue-500
              "

            >


              <option value="">
                Select role
              </option>


              <option value="student">
                Student
              </option>



              <option value="client">
                Client
              </option>



            </select>




            {
              errors.role && (

                <p className="
                  text-red-500
                  text-sm
                  mt-2
                ">

                  {errors.role}

                </p>

              )
            }



          </div>





          <button

            disabled={loading}


            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
              transition
            "

          >


            {
              loading
              ?
              "Creating account..."
              :
              "Register"
            }



          </button>



        </form>



      </div>



    </section>


  );


}


export default Register;