import { Form, Formik } from "formik";
import FormikControl from "../forms/FormikControl";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { v4 as uuidv4 } from "uuid";
import { databaseId, objectiveCollectionId } from "./envExports";

const Objective = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    objective: "",
  });
  const [isEditing, setIsEdit] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");

  useEffect(() => {
    if (subpages === "objective") {
      const fetchData = async () => {
        try {
          const response = await databases.listDocuments(
            databaseId,
            objectiveCollectionId
          );
          const documents = response.documents;
          // console.log(documents[0].name)
          if (documents.length > 0) {
            const document = documents[0];
            // console.log(document)
            setInitialValues(document);
            setDocumentId(document.$id);
            setIsEdit(true);
          }
        } catch (e) {
          console.log("Failed to fetch Objective details", e);
          toast.error("Failed to fetch Objective details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  const onSubmit = async (values: any, onSubmitProps: any) => {
    try {
      if (isEditing) {
        delete values.$databaseId;
        delete values.$collectionId;
        await databases.updateDocument(
          databaseId,
          objectiveCollectionId,
          documentId,
          values
        );
        toast.success("Objective Details Updated Successfully");
      } else {
        const promise = databases.createDocument(
          databaseId,
          objectiveCollectionId,
          uuidv4(),
          values
        );
        promise.then(
          function () {
            // console.log(response);
            toast.success("Objective details Saved Successfully");
            navigate("/create-resume");
          },
          function (error: any) {
            console.log(error);
            toast.error(error.message);
          }
        );
        onSubmitProps.resetForm();
      }
    } catch (e) {
      console.log("Failed To Submit Details", e);
      toast.error("Failed To Submit Details");
    }
  };

  const handleDelete = async () => {
    try {
      const promise = databases.deleteDocument(
        databaseId,
        objectiveCollectionId,
        documentId
      );
      promise.then(
        function () {
          // console.log(response)
          toast.success("Objective details Deleted Succesfully");
          navigate("/create-resume");
        },
        function ({ error }: any) {
          console.log(error.message);
        }
      );
    } catch (e) {
      console.log("Failed to delete Objective Details");
      toast.error("Failed to Delete Objective details");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      <Form className="shadow-md group shadow-slate-950 px-4 py-6 rounded-2xl relative ">
        <FormikControl
          control="textarea"
          name="objective"
          label="Objective"
          placeholder="Results-driven and highly motivated Full Stack Junior developer....."
        />

        <div className="button">
          <button
            className="text-slate-200 font-blod uppercase text-sm "
            type="submit"
          >
            {isEditing ? "update" : "save"}
          </button>
        </div>
        {isEditing && <Button handleDelete={handleDelete} />}
      </Form>
    </Formik>
  );
};

export default Objective;
