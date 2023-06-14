import {useState} from 'react'
import { Form, Formik } from "formik";
import FormikControl from "../forms/FormikControl";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { account } from "../appWrite/AppwriteConfig";
import {v4 as uuidv4} from 'uuid'
const Register = ({
  setToggle,
  handleToggle,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggle: () => void;
}) => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };
  const [hidePassword, setHidePassword] = useState(true)
  const validationSchema = Yup.object({
    username: Yup.string().required("Username Required"),
    email: Yup.string().email().required("Email Required"),
    password: Yup.string().required("Password Required"),
  });
  const handleTogglePassword = () =>{
    setHidePassword(prevState => !prevState)
  }
  const onSubmit = async (values: any) => {
  try {
    const promise = account.create(
      uuidv4(),
      values.email,
      values.password,
      values.username
    );
    promise.then(
      function(){
          // console.log(response)
          setToggle(true);
          toast.success("Registration Successful. Please Login!");
      },
      function({response}:any){
          console.log(response)
          toast.error(response.message);
      }
    );
  } catch (e) {
    console.log(e);
    toast.error("Registration Failed");
  }
    // try {
    //   await axios.post("/register", values);
    //   setToggle(false);
    //   toast.success("Registration Successfull");
    //   // alert('Registration Successful')
    // } catch (e) {
    //   console.log("Registration Failed", e);
    //   toast.error("Registration Failed");
    //   // alert('Registration Failed')
    // }
  };
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Form className="">
        <FormikControl
          control="input"
          name="username"
          label="Username"
          placeholder="Jane Doe"
        />
        <FormikControl
          control="input"
          name="email"
          label="Email"
          placeholder="janedoe@gmail.com"
        />
        <div className='relative'>
        <FormikControl
          control="input"
          name="password"
          label="Password"
          placeholder="Password"
          type={`${hidePassword ? 'password' : 'text'}`}
        />
        <div  onClick={handleTogglePassword} className='absolute top-1/2 right-3 z-10 cursor-pointer -trasnslate-y-1/2 '>
          {hidePassword ?
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg> :
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
      
          }

        </div>
        </div>
        <div className=" button">
          <button
            className="text-slate-200 font-blod uppercase text-sm "
            type="submit"
          >
            Register
          </button>
        </div>

        <div className="flex md:hidden gap-2 items-center">
          <p className="text-sm">Already have an account?</p>
          <span
            onClick={handleToggle}
            className="text-cyan-500 hover:underline underline-offset-2"
          >
            Login
          </span>
        </div>
      </Form>
    </Formik>
  );
};

export default Register;
