import { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import FormikControl from "../forms/FormikControl";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
// import { v4 as uuidv4 } from "uuid";
import { certificateCollectionId, databaseId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

const Certifications = () => {
  const { subpages } = useParams();
  const { user, documentId, userId } = useResumeContext();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    certificate: "",
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [documentId, setDocumentId] = useState<string>("");
  useEffect(() => {
    if (subpages === "certifications") {
      const fetchData = async () => {
        try {
          const promise = databases.getDocument(
            databaseId,
            certificateCollectionId,
            documentId
          );
          promise.then((response:any)=>{
            setInitialValues(response);
            setIsEdit(true);

          }, ({ response }: any) => {
            console.log(response.message);
            toast.error(`Please Fill in the details. ${response.message}`);
          })
          
          
        } catch (e) {
          console.log("Failed to fetch Certification details", e);
          toast.error("Failed to fetch Certification details");
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
  const onSubmit = async (values: any, onSubmitProps: any) => {
    try {
      if (isEdit) {
        delete values.$databaseId;
        delete values.$collectionId;
        await databases.updateDocument(
          databaseId,
          certificateCollectionId,
          documentId,
          values
        );
        toast.success("Certification Details Updated Successfully");
      } else {
        const promise = databases.createDocument(
          databaseId,
          certificateCollectionId,
          user?.$id,
          values
        );
        promise.then(
          function () {
            // console.log(response);
            toast.success("Certification details Saved Successfully");
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
        certificateCollectionId,
        documentId
      );
      promise.then(
        function () {
          // console.log(response)
          toast.success("Certification etails Deleted Succesfully");
          navigate("/create-resume");
        },
        function ({ error }: any) {
          console.log(error.message);
          toast.error(error);
        }
      );
    } catch (e) {
      console.log("Failed to delete certification Details");
      toast.error("Failed to Delete details");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      <Form className=" relative group  shadow-md shadow-slate-950 rounded-2xl py-6 px-8">
        <FormikControl
          control="textarea"
          name="certificate"
          label="Certification/ Achievements"
          placeholder="Cisco Certification, AWS Cloud Certification"
        />

        <div className="button">
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

export default Certifications;
