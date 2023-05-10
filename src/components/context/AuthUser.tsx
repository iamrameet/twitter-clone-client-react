import { createContext, useState } from "react";
import { UserResponse } from "../../helper/user";

const UserContext = createContext<{ userData?: UserResponse, setUserData: React.Dispatch<React.SetStateAction<UserResponse | undefined>> }>({ setUserData(){
  console.log("default")
} });

function AuthUserStates(props: { children: JSX.Element }){

  const [ userData, setUserData ] = useState<UserResponse>();

  return <UserContext.Provider value={{ userData, setUserData }}>
    { props.children }
  </UserContext.Provider>

}

export { UserContext };
export default AuthUserStates;