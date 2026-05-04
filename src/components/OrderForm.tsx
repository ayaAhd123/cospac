import { useEffect, useMemo, useState } from "react";
import { push, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { X, Check, Minus, Plus, Loader2, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import { sendOrderNotification } from "@/lib/orderNotification";
import { FREE_DELIVERY_CITY, getDeliveryFeeDh, MOROCCO_CITIES } from "@/lib/moroccoCities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const OrderForm = () => {
  const { t, orderOpen, closeOrderForm, selectedProduct, setSelectedProduct, lang } = useApp();
  const { products } = usePublicProducts(lang, t.products.items);
  const [form, setForm] = useState({ name: "", phone: "", city: "", product: "", quantity: 1, notes: "" });
  const [cityOpen, setCityOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const first = products[0]?.id ?? "";
    setForm((f) => ({ ...f, product: f.product || first }));
  }, [products]);

  useEffect(() => {
    if (selectedProduct) setForm((f) => ({ ...f, product: selectedProduct }));
  }, [selectedProduct]);

  useEffect(() => {
    if (!orderOpen) setDone(false);
  }, [orderOpen]);

  const product = products.find((p) => p.id === form.product) ?? products[0];
  const productsSubtotal = (product?.price ?? 0) * form.quantity;
  const deliveryFeeDh = getDeliveryFeeDh(form.city);
  const grandTotalDh = productsSubtotal + deliveryFeeDh;

  const currency = lang === "ar" ? "د.م" : "DH";

  const deliveryRowClass = useMemo(() => {
    if (!form.city.trim()) return "text-muted-foreground";
    if (form.city === FREE_DELIVERY_CITY) return "text-green-600 dark:text-green-400 font-semibold";
    return "text-foreground";
  }, [form.city]);

  if (!orderOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!form.city.trim() || !MOROCCO_CITIES.includes(form.city)) {
      toast.error(lang === "ar" ? "يرجى اختيار المدينة من القائمة" : "Veuillez sélectionner une ville dans la liste.");
      return;
    }
    setSending(true);
    try {
      const orderData = {
        name: form.name,
        phone: form.phone,
        city: form.city,
        product: form.product,
        productLabel: product.name,
        quantity: form.quantity,
        notes: form.notes || "",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        deliveryFee: deliveryFeeDh,
        productsSubtotal: productsSubtotal,
        orderTotal: grandTotalDh,
      };
      const orderRef = await push(ref(db, "orders"), orderData);

      void sendOrderNotification({
        orderId: orderRef.key ?? "",
        name: orderData.name,
        phone: orderData.phone,
        city: orderData.city,
        productLabel: orderData.productLabel ?? orderData.product,
        quantity: orderData.quantity,
        notes: orderData.notes ?? "",
        createdAt: orderData.createdAt,
        deliveryFeeDh: orderData.deliveryFee,
        productsSubtotalDh: orderData.productsSubtotal,
        orderTotalDh: orderData.orderTotal,
      });

      setSending(false);
      setDone(true);
      toast.success(t.form.success);
      setTimeout(() => {
        closeOrderForm();
        setForm({ name: "", phone: "", city: "", product: products[0]?.id ?? "", quantity: 1, notes: "" });
      }, 1800);
    } catch {
      setSending(false);
      toast.error(lang === "ar" ? "تعذر إرسال الطلب" : "Envoi impossible");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/40 backdrop-blur-sm animate-fade-up motion-safe:animate-[fade-in_0.25s_ease-out]"
      onClick={closeOrderForm}
    >
      <div
        className="bg-card w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl p-6 md:p-8 shadow-elegant relative motion-safe:animate-[fade-up_0.35s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeOrderForm}
          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-smooth"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">{t.form.success}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-1">{t.form.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.form.sub}</p>

            <div
              className="mb-5 rounded-2xl border border-green-600/35 bg-green-600/10 px-3.5 py-3 text-sm font-medium text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-100"
              role="status"
            >
              {t.form.deliveryBanner}
            </div>

            <form onSubmit={submit} className="space-y-3">
              <Input label={t.form.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label={t.form.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.city}</label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityOpen}
                      className="h-12 w-full justify-between rounded-2xl border border-border bg-secondary px-4 font-normal hover:bg-secondary hover:text-foreground"
                    >
                      <span className={cn("truncate", !form.city && "text-muted-foreground")}>
                        {form.city || t.form.cityPlaceholder}
                      </span>
                      <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(calc(100vw-2rem),24rem)] p-0" align="start">
                    <Command shouldFilter>
                      <CommandInput placeholder={t.form.cityPlaceholder} className="h-11" />
                      <CommandList>
                        <CommandEmpty>{t.form.cityEmpty}</CommandEmpty>
                        <CommandGroup>
                          {MOROCCO_CITIES.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={() => {
                                setForm((f) => ({ ...f, city }));
                                setCityOpen(false);
                              }}
                            >
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.product}</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="w-full h-12 px-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.qty}</label>
                <div className="flex items-center gap-3 h-12 px-2 rounded-2xl bg-secondary">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                    className="w-9 h-9 rounded-full bg-card flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center font-bold">{form.quantity}</div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
                    className="w-9 h-9 rounded-full bg-card flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.notes}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth resize-none"
                />
              </div>
              <div className="space-y-2 pt-3 border-t border-border text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.form.productsSubtotal}</span>
                  <span className="font-semibold">
                    {productsSubtotal.toFixed(2)} {currency}
                  </span>
                </div>
                <div className={cn("flex items-center justify-between", deliveryRowClass)}>
                  <span>{t.form.deliveryLabel}</span>
                  <span className="font-semibold">
                    {!form.city.trim()
                      ? t.form.deliveryPending
                      : deliveryFeeDh === 0
                        ? t.form.deliveryFree
                        : `20.00 ${currency}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">{t.form.total}</span>
                  <span className="text-2xl font-black text-primary">
                    {grandTotalDh.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
              <button
                disabled={sending}
                type="submit"
                className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {t.form.sending}
                  </>
                ) : (
                  t.form.submit
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth"
    />
  </div>
);
