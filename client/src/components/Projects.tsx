import { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import FormikControl from "../forms/FormikControl";
import { useNavigate, useParams } from "react-router-dom";
import RemoveButton from "./RemoveButton";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { v4 as uuidv4 } from "uuid";
import { databaseId, projectsCollectionId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

const Projects = () => {
  const { subpages } = useParams();
  const { user, documentId, userId } = useResumeContext();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    project: [
      {
        id: uuidv4(),
        title: "",
        description: "",
      },
    ],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [documentId, setDocumentId] = useState<string>("");

  useEffect(() => {
    if (subpages === "projects") {
      // setIsEdit(true)
      const fetchData = async () => {
        try {
          const response = await databases.getDocument(
            databaseId,
            projectsCollectionId,
            documentId
          );
         
            const updatedInitialValues = {
              project: JSON.parse(response.project),
            };
            setInitialValues(updatedInitialValues);
            setIsEdit(true);
          
        } catch (e) {
          console.log("Failed to fetch Projects details", e);
          // toast.error("Failed to fetch projects details");
        }
      };
      if (userId === documentId) {
        fetchData();
      } else {
        // userId does not match documentId, set fields to empty
        setInitialValues(initialValues);
        setIsEdit(false);
      }
    }
  }, [subpages, userId, user]);
  const onSubmit = async (
    values: { project: string[] | any },
    onSubmitProps: { resetForm: () => void }
  ) => {
    try {
      const projectString = JSON.stringify(values.project);

      if (isEdit) {
        // Update existing data in the database
        await databases.updateDocument(
          databaseId,
          projectsCollectionId,
          documentId,
          {
            project: projectString,
          }
        );
        toast.success("Project details updated Successfully");
      } else {
        const promise = databases.createDocument(
          databaseId,
          projectsCollectionId,
          user?.$id,
          {
            project: projectString,
          }
        );

        promise.then(
          () => {
            // console.log(response);
            toast.success("Details Saved Successfully");
            navigate("/create-resume");
          },
          (error: { response: { message: string } }) => {
            console.log(error);
            toast.error(error.response.message);
          }
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
  const handleDelete = async (
    formik: { values: { project: string[] } } | any,
    index: number
  ) => {
    try {
      const project = formik.values.project;

      if (index >= 0 && index < project.length) {
        const deletedProject = project.splice(index, 1);
        formik.setFieldValue("project", project);

        // Retrieve the document
        const document = await databases.getDocument(
          databaseId,
          projectsCollectionId,
          documentId
        );

        // Modify the form details array by removing the deleted experience
        const updatedproject = JSON.parse(document.project).filter(
          (experience: { id: string }) => experience.id !== deletedProject[0].id
        );

        // Update the document with the modified form details array
        await databases.updateDocument(
          databaseId,
          projectsCollectionId,
          documentId,
          {
            project: JSON.stringify(updatedproject),
          }
        );

        toast.success("project details deleted Successfully");
      } else {
        throw new Error("Invalid index");
      }
    } catch (e) {
      console.log("Failed to delete project  details", e);
      toast.error("Failed to delete details");
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
                  onClick={() =>
                    push({
                      id: uuidv4(),
                      title: "",
                      description: "",
                    })
                  }
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
