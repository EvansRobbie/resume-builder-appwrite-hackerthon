import {useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import { databases } from '../appWrite/AppwriteConfig';
 interface refereeProps{
    referees: {
        id:string
        name: string;
        title: string;
        companyName: string;
        email?: string;
        phone: string;
      }[];
 }
const ListRefereeDetails = () => {
    const [refereeDetails, setRefereeDetails] = useState<refereeProps | null>(null)
  
    useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await databases.listDocuments('648442d60bc9b3a9c1fe','648651f42bddee552e29')
              const documents = response.documents
               // console.log(documents)
               if (documents.length > 0) {
                 const document = documents[0]
                 // console.log(document)
                 const updatedInitialValues = { referees: JSON.parse(document.referees) };
                 setRefereeDetails(updatedInitialValues);
                 
              }
            } catch (e) {
              console.log("Failed to fetch Referee details", e);
              toast.error("Failed to fetch Referee details");
            }
          };
          fetchData();
        
      }, []);
    //   console.log(refereeDetails)
    return (
    <>
    {refereeDetails?.referees && refereeDetails.referees.length > 0 && (
        <>
            <div className="heading-bg">
              <h1 className="h1">Reference</h1>
            </div>
            {
                refereeDetails.referees.map((referee) =>(
                    <div
                    key={referee.id}
                    className="px-4 py-3 text-xs flex flex-col gap-1"
                  >
                    <h2 className=" font-semibold">{referee.name}</h2>
                    <span className="">{referee.companyName}</span>
                    <div className="">{referee.email} </div>
                    <p className="">{referee.phone}</p>
                  </div>
                ))
            }
        </>
    )}
    </>
  )
}

export default ListRefereeDetails