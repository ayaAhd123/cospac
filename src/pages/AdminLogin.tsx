import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const { t } = useApp();
  const a = t.admin;
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? "/admin/orders";
  const adminEmail = ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? "admin@cospac.com").trim();
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) nav("/admin/orders", { replace: true });
    });
    return () => unsub();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, adminEmail, password);
      nav(from.startsWith("/admin") ? from : "/admin/orders", { replace: true });
    } catch {
      setErr(a.badPassword);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-10 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm">
        ← {a.backSite}
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-black">C</div>
          <h1 className="text-2xl font-display font-bold">{a.loginTitle}</h1>
          <p className="text-sm text-muted-foreground">{a.loginSubtitle}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pwd">{a.password}</Label>
            <PasswordInput id="pwd" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-2xl" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="rem" checked={remember} onCheckedChange={(c) => setRemember(c === true)} />
            <Label htmlFor="rem" className="text-sm font-normal cursor-pointer">
              {a.remember}
            </Label>
          </div>
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin me-2" /> {a.loggingIn}
              </>
            ) : (
              a.submit
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
