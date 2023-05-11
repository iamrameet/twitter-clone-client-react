import { useState } from "react";
import FetchRequest from "../../scripts/fetch-request";
import Button from "../Button";
import DialogBox, { DialogBoxProperties } from "../DialogBox";
import "./Style.css";
import { UserResponse } from "../../helper/user";
import { DEFAULT_IMAGE } from "../../scripts/user";

type AuthAreaProperties = {
  closeHandle: DialogBoxProperties["closeHandle"];
  onSuccess: (userData: UserResponse, token: string) => void;
};

export default function AuthArea(props: AuthAreaProperties){

  const [ authState, setAuthState ] = useState<"pending" | "default">("default");

  const [ userEmail, setUserEmail ] = useState("");
  const [ userPassword, setUserPassword ] = useState("");

  const [ step, setStep ] = useState(1);

  return <DialogBox closeHandle={ props.closeHandle }>

    <div className="container auth-form gap">

      <h1>Sign in to Twitter-Clone</h1>
      <div className="container input">
        <input
          type="text"
          id="auth-user"
          placeholder="Email, or username"
          value={ userEmail }
          disabled={ step !== 1 }
          onChange={ event => updateState(event, setUserEmail) }
        />
        <label htmlFor="auth-user">Email, or username</label>
      </div>

      {
        step === 1 ? <>
          <Button emphasis="high" isMono={true} onClick={ async () => {
              setAuthState("pending");
              await sleep(1000);
              try{
                const { isAvailable } = await FetchRequest.get("/user/check_availability/:field/:value", {
                  field: "email",
                  value: userEmail
                });
                if(!isAvailable){
                  setStep(step + 1);
                }
              } catch(ex) {} finally {
                setAuthState("default");
              }
            } }>Next</Button>
          <Button emphasis="medium" isMono={true}>Forgot password?</Button>
        </> : <>
          <div className="container input">
            <input
              type="password"
              id="auth-password"
              placeholder="Password"
              value={ userPassword }
              onChange={ event => updateState(event, setUserPassword) }
            />
            <label htmlFor="auth-password">Password</label>
          </div>
          <Button emphasis="high" isMono={true} onClick={ async () => {
              setAuthState("pending");
              await sleep(1000);
              try{
                const { userData, token } = await FetchRequest.post("/user/auth", {
                  email: userEmail,
                  password: userPassword
                });
                userData.image = userData.image ? FetchRequest.host + userData.image : DEFAULT_IMAGE;
                userData.cover = userData.cover ? FetchRequest.host + userData.cover : undefined;

                props.onSuccess(userData, token);
              } catch(ex) {} finally {
                setAuthState("default");
              }
            } }>Log in</Button>
        </>
      }
      <div className="container w-fill pad-v">
        <p>Don't have an account? <a href="#" className="link">Sign up</a></p>
      </div>

    </div>

    { authState === "pending" ?
      <div className="container absolute top left w-fill h-fill center bg">
        <div className="spinner"></div>
      </div>
    : <></> }

  </DialogBox>
};

const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

export function SignupArea(props: AuthAreaProperties){

  const [ authState, setAuthState ] = useState<"pending" | "default">("default");

  const [ userName, setUserName ] = useState("");
  const [ userEmail, setUserEmail ] = useState("");
  const [ userPassword, setUserPassword ] = useState("");
  const [ birthYear, setBirthYear ] = useState("2023");
  const [ birthMonth, setBirthMonth ] = useState("1");
  const [ birthDay, setBirthDay ] = useState("1");
  const [ verificationOTP, setOTP ] = useState("");
  const [ verificationKey, setKey ] = useState("");

  const [ step, setStep ] = useState(1);

  return <DialogBox
    closeHandle={ step === 1 ? props.closeHandle : () => setStep(step - 1) }
    title={ `Step ${ step } of 5` }
    closeIcon={ step === 1 ? "cancel" : "back" }
  >
    <div className="container auth-form gap">

      { step === 4 ? <>

        <h1>You'll need a password</h1>
        <p className="text-sub-title">Make sure it’s 8 characters or more.</p>
        <div className="container input">
          <input
            type="password"
            id="signup-password"
            placeholder="Password"
            minLength={8}
            value={ userPassword }
            onChange={ event => updateState(event, setUserPassword) }
          />
          <label htmlFor="signup-password">Password</label>
        </div>

      </> : step === 3 ? <>

        <h2>We sent you a code</h2>
        <p className="text sub-title">Enter it below to verify { userEmail }.</p>
        <div className="container input">
          <input
            type="number"
            id="signup-otp"
            placeholder="Verification code"
            value={ verificationOTP }
            onChange={ event => updateState(event, setOTP) }
            maxLength={6}
          />
          <label htmlFor="signup-otp">Verification code</label>
        </div>

      </> :
      <>
        <h1>Create your account</h1>

        <div className="container input">
          <input
            type="text"
            id="signup-name"
            placeholder="Name"
            maxLength={50}
            onChange={ event => updateState(event, setUserName) }
          />
          <label htmlFor="signup-name">Name</label>
        </div>

        <div className="container input">
          <input
            type="email"
            id="signup-email"
            placeholder="Email"
            onChange={ event => updateState(event, setUserEmail) }
          />
          <label htmlFor="signup-email">Email</label>
        </div>

        { step === 2 ? <>

          <div className="container input">
            <input
              type="text"
              id="signup-dob"
              placeholder="Date of birth"
              value={ `${ monthNames[parseInt(birthMonth) - 1].slice(0, 3) } ${birthDay}, ${birthYear}` }
              readOnly={true}
              onFocus={ () => setTimeout(setStep, 300, 1) }
            />
            <label htmlFor="signup-dob">Date of birth</label>
          </div>

          <p className="container pad-v text small sub-title">By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. Twitter may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalizing our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.</p>

        </> : <div className="container w-fill">

          <h4>Date of birth</h4>
          <p className="text sub-title">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
          <div className="container w-fill row gap">

            <div className="container input w-fill">
              <select
                id="signup-month"
                placeholder="Month"
                value={ birthMonth }
                onChange={ event => updateState(event, setBirthMonth) }
              >{
                monthNames.map((monthName, index) => <option value={ index + 1 }>{ monthName }</option>)
              }</select>
              <label htmlFor="signup-month">Month</label>
            </div>

            <div className="container input w-fill">
              <select id="signup-day" value={ birthDay } onChange={ event => updateState(event, setBirthDay) }>{
                new Array(31)
                  .fill(1)
                  .map((start, index) => <option value={ index + start }>{ index + start }</option>)
              }</select>
              <label htmlFor="signup-day">Day</label>
            </div>

            <div className="container input w-fill">
              <select
                id="signup-year"
                value={ birthYear }
                onChange={ event => updateState(event, setBirthYear) }>
                { (() => {
                  const year = new Date().getFullYear()
                  return new Array(year - 1900).fill(year)
                    .map((year, index) => <option value={ year - index }>{ year - index }</option>)
                })() }
              </select>
              <label htmlFor="signup-year">Year</label>
            </div>

          </div>

        </div> }

      </> }

      <br/>

      <Button
        emphasis="high"
        isMono={ step !== 2 }
        onClick={
          step === 4 ? async () => {
            const { userData, token } = await signup(
              verificationOTP,
              verificationKey,
              userName,
              userEmail,
              `${ birthYear }-${ birthMonth.padStart(2, "0") }-${ birthDay.padStart(2, "0") }`,
              userPassword
            );
            userData.image = userData.image ? FetchRequest.host + userData.image : DEFAULT_IMAGE;
            userData.cover = userData.cover ? FetchRequest.host + userData.cover : undefined;
            props.onSuccess(userData, token);
          } : step === 3 ? async () => {
              setAuthState("pending");
              await sleep(1000);
              try{
                await verifyOTP(verificationOTP, verificationKey).then(setStep);
              } catch(ex) {} finally {
                setAuthState("default");
              }
          }
          : step === 2
            ? async () => {
              setAuthState("pending");
              await sleep(1000);
              try{
                await initAccount(userEmail, userName, birthYear + birthMonth + birthDay).then(setKey);
                setStep(step + 1);
              } catch(ex) {} finally {
                setAuthState("default");
              }
            }
            : () => setStep(2)
      }
      >{ step === 2 ? "Sign up" : "Next" }</Button>

      <br/>

    </div>

    { authState === "pending" ?
      <div className="container absolute top left w-fill h-fill center bg">
        <div className="spinner"></div>
      </div>
    : <></> }

  </DialogBox>;
};

function updateState(
  event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  stateUpdater: React.Dispatch< React.SetStateAction<string> >
){
  stateUpdater(event.currentTarget.value);
}

async function initAccount(email: string, name: string, dob: string){
  const data = await FetchRequest.post("/user/init_account", { email, name, dob });
  return data.key;
}

async function verifyOTP(otp: string, key: string){
  const data = await FetchRequest.post("/user/verify_otp", { otp, key })
  return 4 as const;
  // 168190
}

async function signup(otp: string, key: string, name: string, email: string, dob: string, password: string){
  return await FetchRequest.post("/user/", {
    otp, key, name, email, dob, password
  });
}

function sleep<T>(timeout: number, data?: T){
  return new Promise(resolve => setTimeout(resolve, timeout, data));
}