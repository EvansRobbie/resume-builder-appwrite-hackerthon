import { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import FormikControl from "../forms/FormikControl";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
// import { v4 as uuidv4 } from "uuid";
import { databases } from "../appWrite/AppwriteConfig";
import { databaseId, personalCollectionId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";
const Personal = () => {
  const { subpages } = useParams();
  const {user} = useResumeContext()
  const userId = localStorage.getItem('userId');
  // const [documentId, setDocumentId] = useState('')
  const documentId = userId; // Update this based on your logic to get the documentId
  // console.log(userId)
  // console.log(documentId)
  const navigate = useNavigate();
  //  console.log(params)
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    linked: "",
  });
  useEffect(() => {
    if (subpages === "personal") {
      const fetchData = async () => {
        try {
          const promise = databases.getDocument(
            databaseId,
            personalCollectionId,
            documentId
          );
          promise.then((response:any)=>{
            // console.log(response)
            setInitialValues(response);
            // setDocumentId(response.$id)
            setIsEdit(true);
          }, ({response}:any)=>{
            console.log(response.message)
          })
          // console.log(response);
          // const documents = response.documents;
        
            // const document = documents[0];
            // console.log(documents);
          
        } catch (e) {
          console.log("Failed to fetch personal Data", e);
          toast.error("Failed to fetch personal details");
        }
      };
  
      // Set documentId based on userId
      
  
      if (userId === documentId) {
        fetchData();
      } else {
        // userId does not match documentId, set fields to empty
        setInitialValues({ name: "",
        email: "",
        address: "",
        phone: "",
        website: "",
        linked: "",});
        setIsEdit(false);
      }
    }
  }, [subpages, userId, user]);
  //  console.log(documentId)
  //  {userId === documentId ? console.log(true) : console.log(false)}
    const onSubmit = async (values: any, onSubmitProps: any) => {
      // console.log(values)
      try {
        if (isEdit) {
          delete values.$databaseId;
          delete values.$collectionId;
          await databases.updateDocument(
            databaseId,
            personalCollectionId,
            documentId,
            values
          );
          toast.success(" Details Updated Successfully");
        } else {
        
          const promise = databases.createDocument(
            databaseId,
            personalCollectionId,
            user?.$id,
            values
          );
          promise.then(
            function () {
              // console.log(response);
              toast.success("Details Saved Successfully");
            },
            function (error: any) {
              console.log(error);
              toast.error(error);
            }
          );
          onSubmitProps.resetForm();
          navigate("/create-resume");
        }
      } catch (e) {
        console.log("Failed To Submit Details", e);
        toast.error("Failed To Submit Details");
      }
    };
  const handleDelete = () => {
    try {
      const promise = databases.deleteDocument(
        databaseId,
        personalCollectionId,
        documentId
      );
      promise.then(
        function (response: any) {
          console.log(response);
          toast.success("Details Deleted Succesfully");
          navigate("/create-resume");
        },
        function ({ response }: any) {
          console.log(response.message);
        }
      );
    } catch (e) {
      console.log("Failed to delete Personal Details");
      toast.error("Failed to Delete details");
    }
  };
  // console.log(isEdit)
  return (
    // enable initialize helps in pupulating the data that is in the db in the input fields for editing
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      className="py-4"
    >
      <Form className="w-full relative flex flex-col group gap-6 shadow-md shadow-slate-950 px-4 py-6 rounded-2xl">
        <div className="grid grid-cols-2 w-full gap-4">
          <FormikControl
            control="input"
            name="name"
            label="Name"
            placeholder="Jane Doe"
          />
          <FormikControl
            control="input"
            name="email"
            label="Email"
            placeholder="janedoe@gmail.com"
          />
        </div>
        <FormikControl
          control="textarea"
          name="address"
          label="Address"
          placeholder="Nairobi, Kenya"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormikControl
            control="input"
            name="phone"
            label="Phone"
            placeholder="+254700000000"
          />
          <FormikControl
            control="input"
            name="website"
            label="Website"
            placeholder="www.janedoe.com"
          />
        </div>
        <FormikControl
          control="input"
          name="linked"
          label="LinkedIn"
          placeholder="www.linkedin/janedoe.com"
        />
        <div className=" button">
          <button
            className="text-slate-200 font-blod uppercase text-sm "
            type="submit"
          >
            {isEdit ? "update" : "save"}
          </button>
        </div>

        {isEdit && <Button handleDelete={handleDelete} />}
      </Form>
    </Formik>
  );
};

export default Personal;
