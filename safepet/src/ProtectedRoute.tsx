import { Navigate } from "react-router-dom";
import { useUser } from "./Contexts/UserProvider";


type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { usernameGlobal, role } = useUser();



  if ((allowedRoles && !allowedRoles.includes(role)) || !usernameGlobal)
    return <Navigate to="/unauthorized" replace />;

  return children;
}
