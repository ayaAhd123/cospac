import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { X, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const OrderForm = () => {
  const { t, orderOpen, setOrderOpen, selectedProduct, setSelectedProduct, addOrder } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", city: "", product: "dark-brown", quantity: 1 });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (selectedProduct) setForm((f) => ({ ...f, product: selectedProduct }));
  }, [selectedProduct]);

  useEffect(() => {
    if (!orderOpen) { setDone(false); }
  }, [orderOpen]);

  if (!orderOpen) return null;

  const product = t.products.items.find((p) => p.id === form.product) || t.products.items[0];
  const total = product.price * form.quantity;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate email/API
    await new Promise((r) => setTimeout(r, 900));
    addOrder(form);
    setSending(false);
    setDone(true);
    toast.success(t.form.success);
    setTimeout(() => { setOrderOpen(false); setSelectedProduct(null); setForm({ name: "", phone: "", city: "", product: "dark-brown", quantity: 1 }); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/40 backdrop-blur-sm animate-fade-up" onClick={() => setOrderOpen(false)}>
      <div className="bg-card w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 md:p-8 shadow-elegant relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOrderOpen(false)} className="absolute top-4 end-4 w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-smooth">
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">✓</h3>
            <p className="text-muted-foreground">{t.form.success}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-1">{t.form.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t.form.sub}</p>
            <form onSubmit={submit} className="space-y-3">
              <Input label={t.form.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label={t.form.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
              <Input label={t.form.city} value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.product}</label>
                <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="w-full h-12 px-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth">
                  {t.products.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.qty}</label>
                <div className="flex items-center gap-3 h-12 px-2 rounded-2xl bg-secondary">
                  <button type="button" onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })} className="w-9 h-9 rounded-full bg-card flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                  <div className="flex-1 text-center font-bold">{form.quantity}</div>
                  <button type="button" onClick={() => setForm({ ...form, quantity: form.quantity + 1 })} className="w-9 h-9 rounded-full bg-card flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">{t.form.total}</span>
                <span className="text-2xl font-black text-primary">{total} MAD</span>
              </div>
              <button disabled={sending} type="submit" className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60">
                {sending ? t.form.sending : t.form.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
    <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth" />
  </div>
);
