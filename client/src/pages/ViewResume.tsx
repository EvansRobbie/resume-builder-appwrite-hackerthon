import html2pdf from "html2pdf.js";
import { useResumeContext } from "../context/ResumeContext";
import ListPersonalDetails from "../components/ListPersonalDetails";
import ListObjectiveDetails from "../components/ListObjectiveDetails";
import ListExperienceDetails from "../components/ListExperienceDetails";
import ListEducationDetails from "../components/ListEducationDetails";
import ListSkillsDetails from "../components/ListSkillsDetails";
import ListProjectDetails from "../components/ListProjectDetails";
import ListCertificateDetails from "../components/ListCertificateDetails";
import ListRefereeDetails from "../components/ListRefereeDetails";


const ViewResume = ({ handleModal }: { handleModal: () => void }) => {
  const { user } = useResumeContext();
  const handleDownload = () => {
    const element = document.getElementById("resume");
    // generate pdf from the resume
    html2pdf().from(element).save(`${user?.name}.pdf`);
  };
  return (
    <div className="w-full min-h-screen  max-h-[400vh] absolute top-0 left-0 opacity-100 z-20 py-4 px-20 bg-slate-200">
      <div
        onClick={handleModal}
        className="fixed top-10 left-10 opacity-100 z-30 cursor-pointer bg-slate-100 p-2 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="relative  max-w-3xl mx-auto " id="resume">
       <ListPersonalDetails/>

        <ListObjectiveDetails/>

        <ListExperienceDetails/>
        
        <ListEducationDetails/>
      
        <ListSkillsDetails/>

        <ListProjectDetails/>
        
       <ListCertificateDetails/>

       <ListRefereeDetails/>
       
      </div>
      <button
        onClick={handleDownload}
        className="bg-cyan-500 px-4 py-1 flex justify-center items-center hover:bg-slate-950 duration-300 ease-in active:scale-105 max-w-sm mx-auto rounded-md text-slate-200 text-sm"
      >
        Download
      </button>
    </div>
  );
};

export default ViewResume;
