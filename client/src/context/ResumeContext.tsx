import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { account } from "../appWrite/AppwriteConfig";
interface contextProp {
  user: { name: string, $id:string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string, $id:string } | null>>;
  ready: boolean;
  handleLogout: () => void;
}
const ResumeContext = createContext({} as contextProp);
const ResumeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string, $id:string  } | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
          const promise =  account.get();
          promise.then((response:any)=>{
            setUser(response);
            // console.log(response)
         
            setReady(true)
          }, ({response}:any)=>{
                console.log(response)
          })
      }
    };
    fetchUser();
  }, []);
  // localStorage.setItem('userId', user?.userId);

  // console.log(userId)
  const handleLogout = async () => {
    try{
      const promise = account.deleteSessions();
      promise.then(()=>{
        setUser(null);
        toast.success('Logged out Successfully')
        navigate("/");
      }, ({response}:any)=>{
          console.log(response.message)
      })

    }catch(e){
      console.log('Failed to logout', e)
      toast.error('Failed to logout')
    }
  };
  return (
    <ResumeContext.Provider value={{ user, setUser, ready, handleLogout }}>
      {children}
    </ResumeContext.Provider>
  );
};
export const useResumeContext = () => useContext(ResumeContext);
export default ResumeContextProvider;
