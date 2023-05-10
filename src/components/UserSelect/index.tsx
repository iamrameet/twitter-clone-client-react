import { User } from "../../helper/user";
import "./Style.css";

export default function UserSelect(props: { users: User[], onSelect: (user: User) => void }){
  return <div className="container w-fill auto user-select">
    {
      props.users.map(user => {
        return <div className="container w-fill row gap pad center hover" onClick={ () => props.onSelect(user) }>
          <div className="box image"></div>
          <div className="container w-fill h-fill">
            <div className="text title">{ user.name }</div>
            <div className="text sub-title">{ user.username }</div>
          </div>
        </div>;
      })
    }
  </div>;
};