import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { databases } from "../appWrite/AppwriteConfig";
import { databaseId, projectsCollectionId } from "./envExports";

interface projectProps {
  project: {
    id: string;
    title: string;
    description: string;
  }[];
}
const ListProjectDetails = () => {
  const [projectDetails, setProjectDetails] = useState<projectProps | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          projectsCollectionId
        );
        const documents = response.documents;
        // console.log(documents)
        if (documents.length > 0) {
          const document = documents[0];
          // console.log(document)
          const updatedInitialValues = {
            project: JSON.parse(document.project),
          };
          setProjectDetails(updatedInitialValues);
        }
      } catch (e) {
        console.log("Failed to fetch Projects details", e);
        toast.error("Failed to fetch projects details");
      }
    };
    fetchData();
  }, []);
  //   console.log(projectDetails)
  return (
    <>
      {projectDetails?.project && projectDetails.project.length > 0 && (
        <>
          <div className="heading-bg ">
            <h1 className="h1">Projects</h1>
          </div>
          {projectDetails.project.map((project) => (
            <div key={project.id} className="px-4 py-3 text-xs">
              <h2 className=" font-semibold">{project.title}</h2>
              <p className="" style={{ whiteSpace: "pre-line" }}>
                {project.description}
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListProjectDetails;
