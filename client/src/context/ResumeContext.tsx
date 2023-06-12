import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { account } from "../appWrite/AppwriteConfig";
interface contextProp {
  user: { name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
  ready: boolean;
  handleLogout: () => void;
}
const ResumeContext = createContext({} as contextProp);
const ResumeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
          const response = await account.get();
          setUser(response);
          setReady(true)
      }
    };
    fetchUser();
  }, []);
  console.log(user?.name)
  const handleLogout = async () => {
    try{
      await account.deleteSession("current");
      setUser(null);
      toast.success('Logged out Successfully')
      navigate("/");

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
