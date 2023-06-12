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
  const validationSchema = Yup.object({
    username: Yup.string().required("Username Required"),
    email: Yup.string().email().required("Email Required"),
    password: Yup.string().required("Password Required"),
  });
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
      <Form className="relative">
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
        <FormikControl
          control="input"
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
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
