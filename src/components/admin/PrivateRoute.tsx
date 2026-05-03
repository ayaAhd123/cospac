import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ADMIN_LOGIN_PATH } from "@/lib/adminRoutes";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setOk(!!user);
      setReady(true);
    });
    return () => unsub();
  }, [loc.pathname]);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!ok)
    return (
      <Navigate
        to={ADMIN_LOGIN_PATH}
        replace
        state={{ from: loc.pathname || "/admin" }}
      />
    );
  return <>{children}</>;
}
