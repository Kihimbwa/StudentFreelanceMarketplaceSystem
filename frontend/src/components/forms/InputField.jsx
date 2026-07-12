import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {


  const [showPassword, setShowPassword] = useState(false);


  const isPassword = type === "password";


  return (

    <div className="mb-5">


      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>


      <div className="relative">


        <input

          name={name}

          type={
            isPassword && showPassword
            ? "text"
            : type
          }

          placeholder={placeholder}

          value={value}

          onChange={onChange}

          className={`
          w-full
          px-4
          py-3
          rounded-lg
          border
          outline-none
          pr-12

          ${
            error
            ?
            "border-red-500"
            :
            "border-gray-300 focus:border-blue-500"
          }

          `}

        />


        {
          isPassword && (

          <button

            type="button"

            onClick={() =>
              setShowPassword(!showPassword)
            }

            className="
            absolute
            right-4
            top-3
            text-gray-500
            "

          >

            {
              showPassword
              ?
              <FiEyeOff size={20}/>
              :
              <FiEye size={20}/>
            }


          </button>

          )
        }


      </div>



      {
        error && (

          <p className="
          text-red-500
          text-sm
          mt-2
          ">

            {error}

          </p>

        )
      }


    </div>

  );
}


export default InputField;