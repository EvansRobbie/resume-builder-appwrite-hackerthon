import { useState, useEffect } from "react";
import { databases } from "../appWrite/AppwriteConfig";
import { toast } from "react-hot-toast";
import { certificateCollectionId, databaseId } from "./envExports";

interface certificationProps {
  certificate: string;
}
const ListCertificateDetails = () => {
  const [certificateDetails, setCertificateDetails] =
    useState<certificationProps | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          certificateCollectionId
        );
        const documents = response.documents;
        // console.log(documents[0].name)
        if (documents.length > 0) {
          const document = documents[0];
          // console.log(document)
          setCertificateDetails(document);
        }
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
