export function validateRegister(form){

  const errors={};


  if(!form.name){
    errors.name="Full name is required";
  }


  if(!form.email){
    errors.email="Email is required";
  }


  if(
    form.email &&
    !form.email.includes("@")
  ){
    errors.email="Invalid email";
  }


  if(!form.password){

    errors.password="Password is required";

  }
  else if(form.password.length < 8){

    errors.password=
    "Password must be at least 8 characters";

  }


  if(
    form.password !== form.confirmPassword
  ){

    errors.confirmPassword=
    "Passwords do not match";

  }


  if(!form.role){

    errors.role=
    "Please select account type";

  }


  return errors;

}