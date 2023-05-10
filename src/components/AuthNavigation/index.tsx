import Button from "../Button";

type AuthNavigationProperties = {
  onButtonClick: (type: "login" | "signup") => void
};

export default function AuthNavigation(props: AuthNavigationProperties) {
  return <div className="container w-fill row auth-navigation evenly pad-500 pad-h">
    <div className="container mw-600 text-container">
      <h2>Don’t miss what’s happening</h2>
      <p>People on Twitter are the first to know.</p>
    </div>
    <div className="container row center gap actions">
      <Button onClick={ () => props.onButtonClick("login") }>Log in</Button>
      <Button isMono={true} onClick={ () => props.onButtonClick("signup") }>Sign up</Button>
    </div>
  </div>;
}