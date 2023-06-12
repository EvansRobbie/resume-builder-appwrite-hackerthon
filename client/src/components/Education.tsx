import { useState, useEffect } from "react";
import FormikControl from "../forms/FormikControl";
import { Form, Formik, FieldArray } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import RemoveButton from "./RemoveButton";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { v4 as uuidv4 } from "uuid";
import { databaseId, educationCollectionId } from "./envExports";

const Education = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    education: [
      {
        id: uuidv4(),
        course: "",
        school: "",
        grade: "",
        year: "",
      },
    ],
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>("");

  useEffect(() => {
    if (subpages === "education") {
      const fetchData = async () => {
        try {
          const response = await databases.listDocuments(
            databaseId,
            educationCollectionId
          );
          const documents = response.documents;
          // console.log(documents)
          if (documents.length > 0) {
            const document = documents[0];
            // console.log(document)
            const updatedInitialValues = {
              education: JSON.parse(document.education),
            };
            setInitialValues(updatedInitialValues);
            // console.log(updatedInitialValues.experiences)
            setDocumentId(document.$id);
            setIsEdit(true);
          }
        } catch (e) {
          console.log("Failed to fetch Education details", e);
          toast.error("Failed to fetch Education details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  // console.log(initialValues)
  const onSubmit = async (
    values: { education: string[] | any },
    onSubmitProps: { resetForm: () => void }
  ) => {
    try {
      const educationString = JSON.stringify(values.education);

      if (isEdit) {
        // Update existing data in the database
        await databases.updateDocument(
          databaseId,
          educationCollectionId,
          documentId,
          {
            education: educationString,
          }
        );
        toast.success("Details updated Successfully");
      } else {
        const promise = databases.createDocument(
          databaseId,
          educationCollectionId,
          uuidv4(),
          {
            education: educationString,
          }
        );

        promise.then(
          () => {
            // console.log(response);
            toast.success("Details Saved Successfully");
            navigate("/create-resume/experience");
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
  };
  const handleDelete = async (
    formik: { values: { education: string[] } } | any,
    index: number
  ) => {
    try {
      const education = formik.values.education;

      if (index >= 0 && index < education.length) {
        const deletedEducation = education.splice(index, 1);
        formik.setFieldValue("education", education);

        // Retrieve the document
        const document = await databases.getDocument(
          databaseId,
          educationCollectionId,
          documentId
        );

        // Modify the form details array by removing the deleted experience
        const updatedEducation = JSON.parse(document.education).filter(
          (experience: { id: string }) =>
            experience.id !== deletedEducation[0].id
        );

        // Update the document with the modified form details array
        await databases.updateDocument(
          databaseId,
          educationCollectionId,
          documentId,
          {
            education: JSON.stringify(updatedEducation),
          }
        );

        toast.success("Education details deleted Successfully");
      } else {
        throw new Error("Invalid index");
      }
    } catch (e) {
      console.log("Failed to delete education  details", e);
      toast.error("Failed to delete details");
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
        <Form className="w-full flex flex-col gap-6">
          <FieldArray name="education">
            {({ push, remove }) => (
              <div>
                {formik.values.education.map((_, index) => (
                  <div
                    key={index}
                    className="my-10 relative group shadow-md overflow-hidden  shadow-slate-900 px-4 rounded-2xl py-5"
                  >
                    <FormikControl
                      control="input"
                      name={`education[${index}].course`}
                      label="Course/Degree"
                      placeholder="Bsc Infomation Technology"
                    />
                    <div className="grid grid-cols-2 w-full gap-4">
                      <FormikControl
                        control="input"
                        name={`education[${index}].school`}
                        label="School/University"
                        placeholder="University of ..."
                      />

                      <FormikControl
                        control="input"
                        name={`education[${index}].grade`}
                        label="Grade/Score"
                        placeholder="University of ..."
                      />
                    </div>
                    <FormikControl
                      control="input"
                      name={`education[${index}].year`}
                      label="Year"
                      placeholder="2011 - 2015"
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
                      course: "",
                      school: "",
                      grade: "",
                      year: "",
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

export default Education;
