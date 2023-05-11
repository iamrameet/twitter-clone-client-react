import { createContext, useState } from "react";
import { User, UserResponse } from "../../helper/user";

const UserContext = createContext<{
  userData?: UserResponse,
  setUserData: React.Dispatch<React.SetStateAction<UserResponse | undefined>>,
  updateUserData: (data: Partial<UserResponse>) => void;
}>({
  setUserData(){},
  updateUserData(){}
});

function AuthUserStates(props: { children: JSX.Element }){

  const [ userData, setUserData ] = useState<UserResponse>();

  function updateUserData(data: Partial<UserResponse>){
    setUserData(Object.assign({}, userData, data));
  }

  return <UserContext.Provider value={{ userData, setUserData, updateUserData }}>
    { props.children }
  </UserContext.Provider>

}

export { UserContext };
export default AuthUserStates;