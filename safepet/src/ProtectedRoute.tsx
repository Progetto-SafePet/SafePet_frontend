import { Navigate } from "react-router-dom";
import { useUser } from "./Contexts/UserProvider";


type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { usernameGlobal, role } = useUser();


  console.log("ProtectedRoute - role:", role, allowedRoles);
  if ((allowedRoles && !allowedRoles.includes(role)) || !usernameGlobal) {
    console.log(allowedRoles && !allowedRoles.includes(role) ? "Accesso negato: ruolo non autorizzato" : "Accesso negato: utente non autenticato");
    console.log("usernameGlobal:", usernameGlobal);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
