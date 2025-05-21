
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { authState } = useAuth();
  
  // Redirect to dashboard if authenticated or to login if not
  if (authState.user) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Index;
