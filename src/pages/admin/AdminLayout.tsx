import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Video, Images, Gift, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { AdminHeaderExtras } from "@/pages/admin/AdminHeaderExtras";
import { ADMIN_LOGIN_PATH } from "@/lib/adminRoutes";

const links = [
  { to: "/admin/orders", labelKey: "orders" as const, icon: ShoppingBag },
  { to: "/admin/products", labelKey: "products" as const, icon: Package },
  { to: "/admin/videos", labelKey: "videos" as const, icon: Video },
  { to: "/admin/before-after", labelKey: "beforeAfter" as const, icon: Images },
  { to: "/admin/offers", labelKey: "offers" as const, icon: Gift },
  { to: "/admin/settings", labelKey: "settings" as const, icon: Settings },
];

const AdminLayout = () => {
  const { t } = useApp();
  const a = t.admin;
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const Side = (
    <nav className="flex flex-col gap-1 p-4">
      {links.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-smooth ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"}`
          }
        >
          <Icon className="w-4 h-4" />
          {a[labelKey]}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-60 flex-col border-e border-border bg-card/50">
        <div className="h-16 flex items-center px-4 border-b border-border font-display font-bold">
          COSPAC <span className="text-primary ms-1">Admin</span>
        </div>
        {Side}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 lg:h-16 border-b border-border bg-card/80 backdrop-blur flex items-center gap-3 px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-card">
              <div className="h-14 flex items-center px-4 border-b border-border font-bold">{a.dashboard}</div>
              {Side}
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex items-center justify-between gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary hidden sm:inline">
              {a.backSite}
            </Link>
            <AdminHeaderExtras />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await signOut(auth);
                nav(ADMIN_LOGIN_PATH, { replace: true });
              }}
            >
              <LogOut className="w-4 h-4 me-1 rtl:ms-1 rtl:me-0" />
              {a.logout}
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
