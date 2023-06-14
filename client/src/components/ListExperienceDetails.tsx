import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { databaseId, experienceCollectionId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

interface experiencesProps {
  experiences: {
    id: string;
    companyName: string;
    jobTitle: string;
    start: string;
    end: string;
    details: string;
  }[];
}
const ListExperienceDetails = () => {
  const { documentId } = useResumeContext();
  const [experienceDetails, setExperienceeDetails] =
    useState<experiencesProps | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise =  databases.getDocument(
          databaseId,
          experienceCollectionId,
          documentId
        );
        promise.then((response:any)=>{
          // console.log(response)
            const updatedInitialValues = {
              experiences: JSON.parse(response.experiences),
            };
            setExperienceeDetails(updatedInitialValues);

        }, ({response}:any)=>{
          console.log(response.message)
        })
        
      } catch (e) {
        console.log("Failed to fetch Experience details", e);
        toast.error("Failed to fetch Experience details");
      }
    };
    fetchData();
  }, []);
  //   console.log(experienceDetails)
  return (
    <>
      {experienceDetails?.experiences &&
        experienceDetails.experiences.length > 0 && (
          <>
            <div className="heading-bg">
              <h1 className="h1">Experience</h1>
            </div>
            {experienceDetails?.experiences.map((experience) => (
              <div key={experience.id} className="px-4 py-3 text-sm">
                <h2 className=" font-semibold">{experience.companyName}</h2>
                <span className="italic">
                  {experience.start}- {experience.end}
                </span>
                <div className="">{experience.jobTitle} </div>
                <p className="" style={{ whiteSpace: "pre-line" }}>
                  {experience.details}
                </p>
              </div>
            ))}
          </>
        )}
    </>
  );
};

export default ListExperienceDetails;
