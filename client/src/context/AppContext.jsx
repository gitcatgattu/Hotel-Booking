import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// ✅ Set global axios base URL once
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);


  const fetchRooms=async()=>{
    try{
      const {data}=await axios.get('/api/rooms/')
        if(data.success){
          setRooms(data.rooms)
        }
        else{
          toast.error(data.message)
        }
    }catch(err){
      toast.error(err.message)
    }
  }
  useEffect(()=>{
    fetchRooms()
  },[])
  // ✅ Fetch user details from backend
  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("No Clerk token found — skipping user fetch");
        return;
      }

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        console.warn("User fetch unsuccessful, retrying in 5s...");
        //for now lets it make 5min
        setTimeout(fetchUser, 50000);
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
      toast.error("Failed to fetch user details");
    }
  };

  // ✅ Fetch user only when Clerk user is ready
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Hook for easy context access
export const useAppContext = () => useContext(AppContext);
