import { createContext, useContext, useState } from "react";


const AuthContext = createContext();



export function AuthProvider({ children }) {


  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  });



  const login = (userData) => {


    setUser(userData.user);


    localStorage.setItem(
      "user",
      JSON.stringify(userData.user)
    );


    localStorage.setItem(
      "access",
      userData.access
    );


    localStorage.setItem(
      "refresh",
      userData.refresh
    );


  };




  const logout = () => {


    setUser(null);


    localStorage.removeItem("user");

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");


  };




  return (

    <AuthContext.Provider

      value={{
        user,
        login,
        logout
      }}

    >

      {children}

    </AuthContext.Provider>

  );

}




export function useAuth(){

  return useContext(AuthContext);

}