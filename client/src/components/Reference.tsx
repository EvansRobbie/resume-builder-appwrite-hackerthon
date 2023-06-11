import { useState, useEffect } from "react";
import { Form, Formik, FieldArray } from "formik";
import FormikControl from "../forms/FormikControl";
import { useNavigate, useParams } from "react-router-dom";
import RemoveButton from "./RemoveButton";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppWrite";
import { v4 as uuidv4 } from "uuid";

const Reference = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    referees: [
      {
        id:uuidv4(),
        name: "",
        title: "",
        companyName: "",
        email: "",
        phone: "",
      },
    ],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('')
  
  useEffect(() => {
    if (subpages === "reference") {
      // setIsEdit(true)
      const fetchData = async () => {
        try {
          const response = await databases.listDocuments('648442d60bc9b3a9c1fe','648651f42bddee552e29')
          const documents = response.documents
           // console.log(documents)
           if (documents.length > 0) {
             const document = documents[0]
             // console.log(document)
             const updatedInitialValues = { referees: JSON.parse(document.referees) };
             setInitialValues(updatedInitialValues);
             // console.log(updatedInitialValues.experiences)
             setDocumentId(document.$id)
             setIsEdit(true);
          }
        } catch (e) {
          console.log("Failed to fetch Referee details", e);
          toast.error("Failed to fetch Referee details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  const onSubmit = async (values: {referees:string[] | any}, onSubmitProps:{resetForm:()=> void}) => {
    try {
    
      const refereesString = JSON.stringify(values.referees);

      if (isEdit) {
        // Update existing data in the database
        await databases.updateDocument('648442d60bc9b3a9c1fe','648651f42bddee552e29', documentId,{
          referees: refereesString,
        }, )
        toast.success("Details updated Successfully");
      } else {
        const promise = databases.createDocument(
          '648442d60bc9b3a9c1fe',
          '648651f42bddee552e29',
          uuidv4(),
          {
            referees: refereesString,
          },
        );
        
        promise.then(
          ()=> {
            // console.log(response);
            toast.success("Details Saved Successfully");
            navigate("/create-resume/experience");
          },
          (error:{response:{message:string}} )=> {
            console.log(error);
            toast.error(error.response.message);
          },
        );
        onSubmitProps.resetForm();
        navigate("/create-resume");
      }

    } catch (e) {
      console.log("Failed To Submit Details", e);
      toast.error("Failed To Submit Details");
    }
  };
  const handleDelete = async (formik:{values:{referees:string[]} }| any , index:number) => {
    try {
      const referees = formik.values.referees;
  
      if (index >= 0 && index < referees.length) {
        const deletedReferees = referees.splice(index, 1);
        formik.setFieldValue('referees', referees);
  
        // Retrieve the document
        const document = await databases.getDocument('648442d60bc9b3a9c1fe', '648651f42bddee552e29', documentId);
  
        // Modify the form details array by removing the deleted experience
        const updatedReferees = JSON.parse(document.referees).filter((experience:{id:string}) => experience.id !== deletedReferees[0].id);
  
        // Update the document with the modified form details array
        await databases.updateDocument('648442d60bc9b3a9c1fe', '648651f42bddee552e29', documentId, {
          referees: JSON.stringify(updatedReferees),
        });
  
        toast.success('Referees details deleted Successfully');
      } else {
        throw new Error('Invalid index');
      }
    } catch (e) {
      console.log('Failed to delete referees  details', e);
      toast.error('Failed to delete details');
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      className=""
    >
      {(formik) => (
        <Form className="w-full flex flex-col gap-6">
          <FieldArray name="referees">
            {({ push, remove }) => (
              <div className="">
                {formik.values.referees.map((_, index) => (
                  <div
                    key={index}
                    className="my-10 relative shadow-md overflow-hidden group  shadow-slate-900 px-4 rounded-2xl py-5"
                  >
                    <FormikControl
                      control="input"
                      name={`referees[${index}].name`}
                      label="Referee Name"
                      placeholder="John Doe"
                    />
                    <FormikControl
                      control="input"
                      name={`referees[${index}].title`}
                      label="Job Title"
                      placeholder="Senior Software Developer"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormikControl
                        control="input"
                        name={`referees[${index}].companyName`}
                        label="Company&nbsp;Name"
                        placeholder="Google"
                      />
                      <FormikControl
                        control="input"
                        name={`referees[${index}].email`}
                        label="Email"
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                    <FormikControl
                      control="input"
                      name={`referees[${index}].phone`}
                      label="Phone"
                      placeholder="+254700000000"
                    />
                    {index > 0 && <RemoveButton remove={() => remove(index)} />}
                    {isEdit && index >= 0 && (
                      <Button
                        handleDelete={() => handleDelete(formik, index)}
                      />
                    )}
                  </div>
                ))}
                <button
                  className="bg-cyan-500 flex px-4 py-1 text-sm rounded-full my-3 gap-2 items-center hover:bg-slate-950 duration-500 ease-in text-slate-200"
                  type="button"
                  onClick={() => push({
                    id:uuidv4(),
                    name: "",
                    title: "",
                    companyName: "",
                    email: "",
                    phone: "",
                  })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add
                </button>
              </div>
            )}
          </FieldArray>
          <button
            className="text-slate-200 button font-blod uppercase text-sm disabled:bg-cyan-500/20 cursor-pointer disabled:text-slate-950"
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Reference;
