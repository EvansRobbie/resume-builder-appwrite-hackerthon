import { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import FormikControl from "../forms/FormikControl";
import { useNavigate, useParams } from "react-router-dom";
import RemoveButton from "./RemoveButton";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppWrite";
import { v4 as uuidv4 } from "uuid";

const Projects = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    project: [
      {
        id:uuidv4(),
        title: "",
        description: "",
      },
    ],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('')


  useEffect(() => {
    if (subpages === "projects") {
      // setIsEdit(true)
      const fetchData = async () => {
        try {
          const response = await databases.listDocuments('648442d60bc9b3a9c1fe','64864cd49f0757319727')
          const documents = response.documents
           // console.log(documents)
           if (documents.length > 0) {
             const document = documents[0]
             // console.log(document)
             const updatedInitialValues = { project: JSON.parse(document.project) };
             setInitialValues(updatedInitialValues);
             // console.log(updatedInitialValues.experiences)
             setDocumentId(document.$id)
             setIsEdit(true);
          }
        
        } catch (e) {
          console.log("Failed to fetch Projects details", e);
          toast.error("Failed to fetch projects details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  const onSubmit = async (values: {project:string[] | any}, onSubmitProps:{resetForm:()=> void}) => {
    try {
      const projectString = JSON.stringify(values.project);

      if (isEdit) {
        // Update existing data in the database
        await databases.updateDocument('648442d60bc9b3a9c1fe','64864cd49f0757319727', documentId,{
          project: projectString,
        }, )
        toast.success("Project details updated Successfully");
      } else {
        const promise = databases.createDocument(
          '648442d60bc9b3a9c1fe',
          '64864cd49f0757319727',
          uuidv4(),
          {
            project: projectString,
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
    navigate("/create-resume");
  };
  const handleDelete = async (formik:{values:{project:string[]} }| any , index:number) => {
    try {
      const project = formik.values.project;
  
      if (index >= 0 && index < project.length) {
        const deletedProject = project.splice(index, 1);
        formik.setFieldValue('project', project);
  
        // Retrieve the document
        const document = await databases.getDocument('648442d60bc9b3a9c1fe', '64864cd49f0757319727', documentId);
  
        // Modify the form details array by removing the deleted experience
        const updatedproject = JSON.parse(document.project).filter((experience:{id:string}) => experience.id !== deletedProject[0].id);
  
        // Update the document with the modified form details array
        await databases.updateDocument('648442d60bc9b3a9c1fe', '64864cd49f0757319727', documentId, {
          project: JSON.stringify(updatedproject),
        });
  
        toast.success('project details deleted Successfully');
      } else {
        throw new Error('Invalid index');
      }
    } catch (e) {
      console.log('Failed to delete project  details', e);
      toast.error('Failed to delete details');
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formik) => (
        <Form className="flex flex-col gap-4">
          <FieldArray name="project">
            {({ push, remove }) => (
              <div>
                {formik.values.project.map((_, index) => (
                  <div
                    key={index}
                    className="my-10 relative group shadow-md overflow-hidden  shadow-slate-900 px-4 rounded-2xl py-5"
                  >
                    <FormikControl
                      control="input"
                      name={`project.[${index}].title`}
                      label="Title"
                      placeholder=" React Resume Builder"
                    />
                    <FormikControl
                      control="textarea"
                      name={`project.[${index}].description`}
                      label="Description"
                      placeholder="Developed a Resume Builder using Typescript, React, React Formik..."
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
                    title: "",
                    description: "",
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

export default Projects;
