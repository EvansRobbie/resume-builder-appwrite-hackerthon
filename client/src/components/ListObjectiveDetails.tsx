import {useState, useEffect} from 'react'
import { databases } from '../appWrite/AppwriteConfig';
import { toast } from 'react-hot-toast';
import { databaseId, objectiveCollectionId } from './envExports';
interface objectiveProps{
    $id:string
    objective: string;
}

const ListObjectiveDetails = () => {
    const [objectiveDetails, setObjectiveDetails] = useState<objectiveProps[]| null>(null)
    useEffect(() => {
          const fetchData = async () => {
            try {
              const response =  await databases.listDocuments(databaseId, objectiveCollectionId)
              const documents = response.documents;
              // console.log(documents[0].name)
              if (documents.length > 0) {
                
                // console.log(document)
                setObjectiveDetails(documents);
              }
            } catch (e) {
              console.log("Failed to fetch Objective details", e);
              toast.error("Failed to fetch Objective details");
            }
          };
          fetchData();
      }, []);
    //   console.log(objectiveDetails)
    return (
    <>
    {objectiveDetails && objectiveDetails.length > 0 &&
        <div key={objectiveDetails[0].$id}>
        <div className="heading-bg">
          <h1 className="h1">objective</h1>
        </div>
        <div
          style={{ whiteSpace: "pre-line" }}
          className="py-3 text-sm px-4"
        >
          {objectiveDetails[0].objective}
        </div>
      </div>
    }
    </>
  )
}

export default ListObjectiveDetails