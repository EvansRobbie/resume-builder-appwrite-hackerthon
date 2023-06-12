import {useEffect, useState} from 'react'
import { toast } from 'react-hot-toast';
import { databases } from '../appWrite/AppwriteConfig';

interface educationProps {
    education: {
        id:string
        course: string;
        school: string;
        grade: string;
        year: string;
      }[];
}

const ListEducationDetails = () => {
    const [educationDetails, seteducationDetails] = useState<educationProps | null>(null)

    useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await databases.listDocuments('648442d60bc9b3a9c1fe','6486477a8cf0791ec632')
              const documents = response.documents
               // console.log(documents)
               if (documents.length > 0) {
                 const document = documents[0]
                 // console.log(document)
                 const updatedInitialValues = { education: JSON.parse(document.education) };
                 seteducationDetails(updatedInitialValues);
               
              }
              
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
            
            {educationDetails?.education.map((educate)=>(
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
  )
}

export default ListEducationDetails