import { useState } from "react";
import { Link } from "react-router-dom";
import humbleImg from '../assets/humble.png'
import glassesEmoji from '../assets/glassesimoji.png'
import heartEmoji from '../assets/heartemoji.png'
import AnimatedText from "../components/AnimatedText";
const Index = () => {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative w-full h-screen py-20  flex flex-col md:justify-center items-center gap-4">
      <div className="w-full h-screen  absolute top-0 left-0 -z-10 opacity-100">
        <img
          className="w-full h-full object-cover"
          src="https://cdnp1.stackassets.com/762a8c072b98a73cd68b82bbd66376b695b729c3/store/6c1ca47bad8ef3ed461f820237a5202004078112c3323aceef607f3e5b3f/sale_321091_primary_image.jpg"
          alt="/home/image"
        />
      </div>
      <div className=" relative  md:absolute backdrop-blur md:backdrop-blur-none md:backdrop-filter-none backdrop-filter md:top-20 left-0 z-10 px-4 max-w-md  ">
        <AnimatedText className=" text-4xl md:text-6xl capitalize leading-relaxed md:leading-snug font-bold " text="Your personal Ai Assistant for job application."/>
      </div>
      <div className="absolute top-10 right-0 animate-bounce">
        <img src={humbleImg} alt="" />
      </div>
      <div className="absolute bottom-1 left-10 ">
        <img src={glassesEmoji} alt="" />
      </div>
      <div className="absolute bottom-1/4 right-0 animate-pulse">
        <img src={heartEmoji} alt="" />
      </div>
      <div className="max-w-lg relative md:absolute md:right-10 z-10 md:top-1/3 md:mt-20 lg:bottom-1/3 lg:mt-0    bg-slate-900/90 flex w-full  backdrop-blur mx-4 backdrop-filter px-4 py-1.5 text-slate-950 rounded-2xl">
       <AnimatedText className="text-white text-sm md:text-base text-start py-4" text="Build your professional resume effortlessly with our intuitive resume builder. Create a standout resume that highlights your skills, experience, and achievements. Our user-friendly interface makes iteasy to customize your resume to suit your unique career goals. Standout from the competition and increase your chances of landing yourdream job. Start crafting your perfect resume today!"/>
        
      </div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex relative  z-10 items-center my-4 md:mt-80 group bg-transparent backdrop-blur backdrop-filter px-4 rounded-2xl "
      >
        <div
          className={`bg-cyan-950 relative z-10 text-slate-100 rounded-full inline-block p-2`}
        >
          {hover ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </div>
        <Link
          to="/create-resume"
          className="group-hover:bg-slate-950 bg-gradient-to-r from-transparent to-cyan-500 -ml-4 pl-6 pr-3 rounded-r-full py-2 duration-500 ease-in"
        >
          <button className="text-slate-100 outline-none group-hover:text-slate-100 text-sm">
            Build Resume
          </button>
        </Link>
      </div>
      <div className="absolute top-0 left-0 bg-gradient-to-bl from-slate-900/50 to-transparent z-0 w-full h-screen " />
    </div>
  );
};

export default Index;
