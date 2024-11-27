import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}; 

 export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  ); 
   const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
     setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const login = (user) => {
    console.log("Login function triggered", user); 
    localStorage.setItem("token", user.token);  
      localStorage.setItem("username", user.name);  
      localStorage.setItem("userId", user.id);  
    setIsLoggedIn(true);
    setUsername(user.name);
  };

     const landing = (user) => {
       console.log("Login function triggered", user);
       localStorage.setItem("token", user.token);
       localStorage.setItem("username", user.name);
       localStorage.setItem("userId", user.id);
       setIsLoggedIn(true);
       setUsername(user.name);
     };

   
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout ,landing}}>
      {children}
    </AuthContext.Provider>
  );
};
