import { useState, useEffect } from "react";
import { Form, Formik, FieldArray } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./DeleteButton";
import RemoveButton from "./RemoveButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppWrite";
import { v4 as uuidv4 } from "uuid";
import FormikControl from "../forms/FormikControl";

const Experience = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    experiences: [
      {
        id:uuidv4(),
        companyName: "",
        jobTitle: "",
        start: "",
        end: "",
        details: "",
      },
    ],
  });
 
  const [isEdit, setIsEdit] = useState(false);
  const [documentId, setDocumentId] = useState("");
  useEffect(() => {
    if (subpages === "experience") {
      const fetchData = async () => {
        try {
         const response = await databases.listDocuments('648442d60bc9b3a9c1fe','6484c33366edeb779367')
         const documents = response.documents
          // console.log(documents)
          if (documents.length > 0) {
            const document = documents[0]
            // console.log(document)
            const updatedInitialValues = { experiences: JSON.parse(document.experiences) };
            setInitialValues(updatedInitialValues);
            // console.log(updatedInitialValues.experiences)
            setDocumentId(document.$id)
            setIsEdit(true);
          } 
        } catch (e) {
          console.log("Failed to fetch Experience details", e);
          toast.error("Failed to fetch Experience details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  // console.log(documentId)

  const onSubmit = async (values:any, onSubmitProps:any) => {
    try {
    
      const experiencesString = JSON.stringify(values.experiences);

      if (isEdit) {
        // Update existing data in the database
        await databases.updateDocument('648442d60bc9b3a9c1fe','6484c33366edeb779367', documentId,{
          experiences: experiencesString,
        }, )
        toast.success("Details updated Successfully");
      } else {
        const promise = databases.createDocument(
          '648442d60bc9b3a9c1fe',
          '6484c33366edeb779367',
          uuidv4(),
          {
            experiences: experiencesString,
          },
        );
        
        promise.then(
          ()=> {
            // console.log(response);
            toast.success("Details Saved Successfully");
            navigate("/create-resume/experience");
          },
          (error:any )=> {
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

  const handleDelete = async (formik:{values:{experiences:string[]}} | any, index:number) => {
    try {
      const experiences = formik.values.experiences;
  
      if (index >= 0 && index < experiences.length) {
        const deletedExperience = experiences.splice(index, 1);
        formik.setFieldValue('experiences', experiences);
  
        // Retrieve the document
        const document = await databases.getDocument('648442d60bc9b3a9c1fe', '6484c33366edeb779367', documentId);
  
        // Modify the form details array by removing the deleted experience
        const updatedExperiences = JSON.parse(document.experiences).filter((experience:{id:string}) => experience.id !== deletedExperience[0].id);
  
        // Update the document with the modified form details array
        await databases.updateDocument('648442d60bc9b3a9c1fe', '6484c33366edeb779367', documentId, {
          experiences: JSON.stringify(updatedExperiences),
        });
  
        toast.success('Details Deleted Successfully');
      } else {
        throw new Error('Invalid index');
      }
    } catch (e) {
      console.log('Failed to delete experience details', e);
      toast.error('Failed to delete details');
    }
  };
  
  

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      className="py-4"
    >
      {(formik) => (
        <Form className="w-full flex flex-col gap-6 relative">
          <FieldArray name="experiences">
            {({ push, remove }) => (
              <div className="">
                {formik.values.experiences.map((_, index) => (
                  <div
                    key={index}
                    className="my-10 relative shadow-md group  overflow-hidden  shadow-slate-900 px-4 rounded-2xl py-5"
                  >
                    <FormikControl
                      control="input"
                      name={`experiences.${index}.companyName`}
                      label="Company Name"
                      placeholder="Google"
                    />
                    <FormikControl
                      control="input"
                      name={`experiences.${index}.jobTitle`}
                      label="Job Title"
                      placeholder="Software Developer"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormikControl
                        control="input"
                        name={`experiences.${index}.start`}
                        label="Start Date"
                        placeholder="March - 2023"
                      />
                      <FormikControl
                        control="input"
                        name={`experiences.${index}.end`}
                        label="End Date"
                        placeholder="upto Date/ Present"
                      />
                    </div>
                    <FormikControl
                      control="textarea"
                      name={`experiences.${index}.details`}
                      label="Details"
                      placeholder="Collaborated with team members to write clean and efficient code..."
                    />
                    {index > 0 && <RemoveButton remove={() => remove(index)} />}
                    {isEdit && index >= 0 && (
                      <Button
                        handleDelete={()=>handleDelete(formik, index)}
                      />
                    )}
                  </div>
                ))}
                <button
                  className="bg-cyan-500 flex px-4 py-1 text-sm rounded-full my-3 gap-2 items-center hover:bg-slate-950 duration-500 ease-in text-slate-200"
                  type="button"
                  onClick={() => push({
                    id: uuidv4(),
                    companyName: "",
                    jobTitle: "",
                    start: "",
                    end: "",
                    details: "",})}
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

export default Experience;
