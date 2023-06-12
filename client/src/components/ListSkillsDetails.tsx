import {useState, useEffect} from 'react'
import { databases } from '../appWrite/AppwriteConfig';
import { toast } from 'react-hot-toast';

interface skillsProps{
    content: string;
}
const ListSkillsDetails = () => {
    const [skillsDetails, setSkillsDetails] = useState<skillsProps[]| null>(null)
    useEffect(() => {
          const fetchData = async () => {
            try {
              const response =  await databases.listDocuments('648442d60bc9b3a9c1fe','6484b5b4852c36436637')
              const documents = response.documents;
              // console.log(documents[0].name)
              if (documents.length > 0) {
                const document = documents[0] 
                // console.log(document.content)
                setSkillsDetails(document.content);
                
              }
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
        ) }
    </>
  )
}

export default ListSkillsDetails