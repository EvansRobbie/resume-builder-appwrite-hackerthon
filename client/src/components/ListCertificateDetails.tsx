import { useState, useEffect } from "react";
import { databases } from "../appWrite/AppwriteConfig";
import { toast } from "react-hot-toast";
import { certificateCollectionId, databaseId } from "./envExports";
import { useResumeContext } from "../context/ResumeContext";

interface certificationProps {
  certificate: string;
}
const ListCertificateDetails = () => {
  const { documentId} = useResumeContext()
  const [certificateDetails, setCertificateDetails] =
    useState<certificationProps | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise =  databases.getDocument(
          databaseId,
          certificateCollectionId, 
          documentId
        );
        promise.then((response:any)=>{
          setCertificateDetails(response);

        }, ({response}:any)=>{
          console.log(response.message)
        })
        
      } catch (e) {
        console.log("Failed to fetch Certification details", e);
        toast.error("Failed to fetch Certification details");
      }
    };
    fetchData();
  }, []);
  //   console.log(certificateDetails)
  return (
    <>
      {certificateDetails?.certificate &&
        certificateDetails.certificate.length > 0 && (
          <>
            <div className="heading-bg">
              <h1 className="h1">certifications & Achievements</h1>
            </div>
            <div
              className="py-3 text-sm px-4"
              style={{ whiteSpace: "pre-line" }}
            >
              {certificateDetails.certificate}
            </div>
          </>
        )}
    </>
  );
};

export default ListCertificateDetails;
