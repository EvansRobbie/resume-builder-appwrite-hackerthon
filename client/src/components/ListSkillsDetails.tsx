import { useState, useEffect } from "react";
import { databases } from "../appWrite/AppwriteConfig";
import { toast } from "react-hot-toast";
import { databaseId, skillsCollectionId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

interface skillsProps {
  content: string;
}
const ListSkillsDetails = () => {
  const { documentId} = useResumeContext()
  const [skillsDetails, setSkillsDetails] = useState<skillsProps[] | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise = databases.getDocument(
          databaseId,
          skillsCollectionId,
          documentId
        );
        promise.then((response:any)=>{
          setSkillsDetails(response.content);

        }, ({response}:any)=>{
          console.log(response.message)
        })
        
      } catch (e) {
        console.log("Failed to fetch Skills details", e);
        toast.error("Failed to fetch Skills details");
      }
    };
    fetchData();
  }, []);
  // console.log(skillsDetails)
  return (
    <>
      {skillsDetails && skillsDetails.length > 0 && (
        <>
          <div className="heading-bg">
            <h1 className="h1">Skills</h1>
          </div>
          <div
            className="py-3 text-sm px-4"
            dangerouslySetInnerHTML={{
              __html: skillsDetails || "",
            }}
          />
        </>
      )}
    </>
  );
};

export default ListSkillsDetails;
