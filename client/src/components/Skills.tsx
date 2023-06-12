import { useState, useEffect } from "react";
import Editor from "./Editor";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./DeleteButton";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import {v4 as uuidv4} from 'uuid'

const Skills = () => {
  const { subpages } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [documentId, setDocumentId] = useState<string>('')
  useEffect(() => {
    if (subpages === "skills") {
      const fetchData = async () => {
        try {
          const response =  await databases.listDocuments('648442d60bc9b3a9c1fe','6484b5b4852c36436637')
          const documents = response.documents;
          // console.log(documents[0].name)
          if (documents.length > 0) {
            const document = documents[0] 
            // console.log(document.content)
            setContent(document.content);
            setDocumentId(document.$id)
            setIsEdit(true);
          }
        } catch (e) {
          console.log("Failed to fetch Skills details", e);
          toast.error("Failed to fetch Skills details");
        }
      };
      fetchData();
    }
  }, [subpages]);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // delete values.$databaseId;
        // delete values.$collectionId;
        await databases.updateDocument('648442d60bc9b3a9c1fe','6484b5b4852c36436637', documentId, {content})
        toast.success("Skills Details Updated Successfully");
        navigate("/create-resume");
      } else {
        const promise = databases.createDocument('648442d60bc9b3a9c1fe','6484b5b4852c36436637', uuidv4(), {content});
        promise.then(function () {
          // console.log(response);
          toast.success("Skills details Saved Successfully");
          navigate("/create-resume");
          setContent('')
        }, function (error:any) {
          console.log(error);
          toast.error(error.message);
        });
      } 
      
    } catch (e) {
      console.log("Failed To Submit Details", e);
      toast.error("Failed To Submit Details");
    }
  };
  const handleDelete = async () => {
    try {
      const promise = databases.deleteDocument("648442d60bc9b3a9c1fe",'6484b5b4852c36436637', documentId);
      promise.then(function(){
        // console.log(response)
        toast.success("Skills details Deleted Succesfully");
        navigate("/create-resume");
      },
      function({error}:any){
        console.log(error.message)
      })
    } catch (e) {
      console.log("Failed to delete skills Details");
      toast.error("Failed to Delete skills details");
    }
  };
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 relative group  shadow-md shadow-slate-950 rounded-2xl my-20 flex flex-col max-w-7xl mx-auto gap-4"
    >
      <h4 className="font-semibold flex justify-center">Skills</h4>
      <Editor value={content} onChange={setContent} />
      <div className=" button">
        <button
          className="text-slate-200 font-bold uppercase text-sm "
          type="submit"
        >
          {isEdit ? "update" : "save"}
        </button>
      </div>
      {isEdit && <Button handleDelete={handleDelete} />}
    </form>
  );
};

export default Skills;
