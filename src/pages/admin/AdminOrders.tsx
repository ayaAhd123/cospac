import { useEffect, useMemo, useState } from "react";
import { onValue, ref, remove, update } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseOrder, OrderStatus } from "@/types/rtdb";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

type Row = { id: string; data: FirebaseOrder };

const AdminOrders = () => {
  const { t } = useApp();
  const a = t.admin;
  const [rows, setRows] = useState<Row[]>([]);
  const [statusF, setStatusF] = useState<string>("all");
  const [q, setQ] = useState("");
  const [dateF, setDateF] = useState("");
  const [delId, setDelId] = useState<string | null>(null);

  useEffect(() => {
    const r = ref(db, "orders");
    return onValue(r, (snap) => {
      const val = snap.val() as Record<string, FirebaseOrder> | null;
      if (!val) {
        setRows([]);
        return;
      }
      setRows(
        Object.entries(val)
          .map(([id, data]) => ({ id, data }))
          .sort((x, y) => (y.data.createdAt ?? "").localeCompare(x.data.createdAt ?? "")),
      );
    });
  }, []);

  const filtered = useMemo(() => {
    return rows.filter(({ data }) => {
      if (statusF !== "all" && (data.status ?? "pending") !== statusF) return false;
      if (dateF && !data.createdAt?.startsWith(dateF)) return false;
      const s = `${data.name} ${data.city} ${data.phone}`.toLowerCase();
      if (q && !s.includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rows, statusF, dateF, q]);

  const exportCsv = () => {
    const cols = [a.orderCols.name, a.orderCols.phone, a.orderCols.city, a.orderCols.product, a.orderCols.qty, a.orderCols.notes, a.orderCols.date, a.orderCols.status];
    const lines = [
      cols.join(","),
      ...filtered.map(({ data }) =>
        [data.name, data.phone, data.city, data.productLabel ?? data.product, data.quantity, (data.notes ?? "").replace(/,/g, ";"), data.createdAt, data.status ?? "pending"].join(
          ",",
        ),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleStatus = async (id: string, cur: OrderStatus) => {
    const next: OrderStatus = cur === "pending" ? "validated" : "pending";
    await update(ref(db, `orders/${id}`), { status: next });
  };

  const doDelete = async () => {
    if (!delId) return;
    await remove(ref(db, `orders/${delId}`));
    setDelId(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display">{a.orders}</h1>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{a.filterStatus}</label>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-44 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">—</SelectItem>
              <SelectItem value="pending">{a.statusPending}</SelectItem>
              <SelectItem value="validated">{a.statusValidated}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{a.filterDate}</label>
          <Input type="date" value={dateF} onChange={(e) => setDateF(e.target.value)} className="rounded-xl w-44" />
        </div>
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">{a.search}</label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="rounded-xl" />
        </div>
        <Button type="button" variant="secondary" className="rounded-full" onClick={exportCsv}>
          {a.exportCsv}
        </Button>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-secondary/80 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-start p-3">{a.orderCols.name}</th>
              <th className="text-start p-3">{a.orderCols.phone}</th>
              <th className="text-start p-3">{a.orderCols.city}</th>
              <th className="text-start p-3">{a.orderCols.product}</th>
              <th className="text-start p-3">{a.orderCols.qty}</th>
              <th className="text-start p-3">{a.orderCols.notes}</th>
              <th className="text-start p-3">{a.orderCols.date}</th>
              <th className="text-start p-3">{a.orderCols.status}</th>
              <th className="text-start p-3">{a.orderCols.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ id, data }) => {
              const st = data.status ?? "pending";
              return (
                <tr key={id} className="border-t border-border hover:bg-secondary/40">
                  <td className="p-3 font-semibold">{data.name}</td>
                  <td className="p-3">
                    <a href={`tel:${data.phone}`} className="text-primary hover:underline">
                      {data.phone}
                    </a>
                  </td>
                  <td className="p-3 text-muted-foreground">{data.city}</td>
                  <td className="p-3">{data.productLabel ?? data.product}</td>
                  <td className="p-3 font-bold">{data.quantity}</td>
                  <td className="p-3 max-w-[180px] truncate" title={data.notes}>
                    {data.notes}
                  </td>
                  <td className="p-3 whitespace-nowrap text-muted-foreground">{data.createdAt?.slice(0, 16).replace("T", " ")}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => toggleStatus(id, st)}>
                      <Badge variant={st === "validated" ? "default" : "secondary"} className="rounded-full cursor-pointer">
                        {st === "validated" ? a.statusValidated : a.statusPending}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="destructive" className="rounded-full" onClick={() => setDelId(id)}>
                      {a.delete}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? <div className="p-8 text-center text-muted-foreground">—</div> : null}
      </div>

      <AlertDialog open={!!delId} onOpenChange={() => setDelId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{a.confirmDeleteOrder}</AlertDialogTitle>
            <AlertDialogDescription>{a.confirmDelete}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">{a.cancel}</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-destructive text-destructive-foreground" onClick={doDelete}>
              {a.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrders;
