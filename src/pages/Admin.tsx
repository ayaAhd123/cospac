import { useApp, Order } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

const statusColor: Record<Order["status"], string> = {
  pending: "bg-gold/20 text-gold-foreground border-gold/40",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
};

const Admin = () => {
  const { orders, updateStatus, t } = useApp();
  const productName = (id: string) => t.products.items.find((p) => p.id === id)?.name ?? id;

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> Retour
          </Link>
          <h1 className="font-bold flex items-center gap-2"><Package className="w-4 h-4" /> Admin · Commandes</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="bg-card rounded-2xl p-4 border border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{k}</div>
              <div className="text-3xl font-black text-primary">{v}</div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Aucune commande pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-start p-4">Client</th>
                    <th className="text-start p-4">Téléphone</th>
                    <th className="text-start p-4">Ville</th>
                    <th className="text-start p-4">Produit</th>
                    <th className="text-start p-4">Qté</th>
                    <th className="text-start p-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold">{o.name}</td>
                      <td className="p-4"><a href={`tel:${o.phone}`} className="text-primary hover:underline">{o.phone}</a></td>
                      <td className="p-4 text-muted-foreground">{o.city}</td>
                      <td className="p-4">{productName(o.product)}</td>
                      <td className="p-4 font-bold">{o.quantity}</td>
                      <td className="p-4">
                        <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as Order["status"])}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${statusColor[o.status]}`}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
