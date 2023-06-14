import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { databaseId, educationCollectionId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

interface educationProps {
  education: {
    id: string;
    course: string;
    school: string;
    grade: string;
    year: string;
  }[];
}

const ListEducationDetails = () => {
  const { documentId} = useResumeContext()
  const [educationDetails, seteducationDetails] =
    useState<educationProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise =  databases.getDocument(
          databaseId,
          educationCollectionId,
          documentId
        );
        promise.then((response:any)=>{
          const updatedInitialValues = {
            education: JSON.parse(response.education),
          };
          seteducationDetails(updatedInitialValues);

        }, ({response}:any)=>{
          console.log(response.message)
        })
       
        
      } catch (e) {
        console.log("Failed to fetch Education details", e);
        toast.error("Failed to fetch Education details");
      }
    };
    fetchData();
  }, []);
  //   console.log(educationDetails)
  return (
    <>
      {educationDetails?.education && educationDetails.education.length > 0 && (
        <>
          <div className="heading-bg">
            <h1 className="h1">Education</h1>
          </div>

          {educationDetails?.education.map((educate) => (
            <div key={educate.id} className="px-4 py-3 text-xs">
              <h2 className=" font-semibold">{educate.school}</h2>
              <span className="italic text-xs">{educate.year}</span>
              <div className="">{educate.course} </div>
              <p className="">{educate.grade}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListEducationDetails;
