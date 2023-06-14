import {useState, useEffect} from 'react'
import { databases } from '../appWrite/AppwriteConfig';
import { toast } from 'react-hot-toast';
import { databaseId, objectiveCollectionId } from './envExports';
import { useResumeContext } from '../context/ResumeContext';
interface objectiveProps{
    $id:string
    objective: string;
}

const ListObjectiveDetails = () => {
  const { documentId} = useResumeContext()
    const [objectiveDetails, setObjectiveDetails] = useState<objectiveProps| null>(null)
    useEffect(() => {
          const fetchData = async () => {
            try {
              const response =  await databases.getDocument(databaseId, objectiveCollectionId, documentId)
              // console.log(documents[0].name)
                setObjectiveDetails(response);
              
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
    {objectiveDetails &&
        <div key={objectiveDetails.$id}>
        <div className="heading-bg">
          <h1 className="h1">objective</h1>
        </div>
        <div
          style={{ whiteSpace: "pre-line" }}
          className="py-3 text-sm px-4"
        >
          {objectiveDetails.objective}
        </div>
      </div>
    }
    </>
  )
}

export default ListObjectiveDetails