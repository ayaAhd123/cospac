import { useEffect, useMemo, useState } from "react";
import { push, ref, update } from "firebase/database";
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
import {
  validateName,
  validatePhone,
  validateAddress,
  sanitizeNotes,
  checkRateLimit,
} from "@/lib/validation";

export const OrderForm = () => {
  const { t, orderOpen, closeOrderForm, selectedProduct, setSelectedProduct, lang } = useApp();
  const { products } = usePublicProducts(lang, t.products.items);
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cityOpen, setCityOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "address", string>>>({});

  useEffect(() => {
    if (orderOpen) {
      setDone(false);
      setErrors({});
      setQuantities((prev) => {
        if (selectedProduct) {
          return { ...prev, [selectedProduct]: Math.max(1, prev[selectedProduct] || 1) };
        }
        if (Object.keys(prev).length === 0 && products.length > 0) {
          return { [products[0].id]: 1 };
        }
        return prev;
      });
    }
  }, [orderOpen, selectedProduct, products]);

  const selectedVariants = products.filter((p) => (quantities[p.id] || 0) > 0);
  const productsSubtotal = selectedVariants.reduce((sum, p) => sum + p.price * (quantities[p.id] || 0), 0);
  const totalQuantity = selectedVariants.reduce((sum, p) => sum + (quantities[p.id] || 0), 0);

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

    // ── Rate limiting (15 s cool-down) ─────────────────────────
    if (!checkRateLimit("orderForm", 15_000)) {
      toast.error(lang === "ar" ? "يرجى الانتظار قبل إعادة الإرسال" : "Veuillez patienter avant de renvoyer.");
      return;
    }

    // ── Field validation ────────────────────────────────────────
    const newErrors: typeof errors = {};

    if (!validateName(form.name)) {
      newErrors.name =
        lang === "ar"
          ? "الاسم يجب أن يحتوي على أحرف فقط (لا أرقام أو رموز)"
          : "Le nom ne doit contenir que des lettres.";
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone =
        lang === "ar"
          ? "رقم هاتف مغربي غير صالح (مثال: 0612345678)"
          : "Numéro de téléphone marocain invalide (ex: 0612345678).";
    }
    if (!validateAddress(form.address)) {
      newErrors.address =
        lang === "ar"
          ? "يرجى إدخال عنوان صحيح (6 أحرف على الأقل)"
          : "Adresse invalide (6 caractères minimum).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    if (selectedVariants.length === 0) {
      toast.error(lang === "ar" ? "يرجى اختيار منتج واحد على الأقل" : "Veuillez sélectionner au moins un produit.");
      return;
    }
    if (!form.city.trim() || !MOROCCO_CITIES.includes(form.city)) {
      toast.error(lang === "ar" ? "يرجى اختيار المدينة من القائمة" : "Veuillez sélectionner une ville dans la liste.");
      return;
    }

    setSending(true);
    try {
      const productIds = selectedVariants.map((p) => p.id).join(", ");
      const productLabels = selectedVariants.map((p) => `${p.name} (x${quantities[p.id]})`).join(" + ");
      const cleanNotes = sanitizeNotes(form.notes);

      const orderData = {
        // ── Core customer data ──────────────────────────────
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city,
        address: form.address.trim(),
        product: productIds,
        productLabel: productLabels,
        quantity: totalQuantity,
        notes: cleanNotes,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        deliveryFee: deliveryFeeDh,
        productsSubtotal,
        orderTotal: grandTotalDh,

        // ── Cathedis delivery fields (auto-filled) ──────────
        expediteur: "Cospac beauty",      // EXPÉDITEUR
        expediteurPhone: form.phone.trim(), // TÉLÉPHONE (sender/user)
        sector: "",                        // SECTEUR – admin fills post-export
        declaredValue: grandTotalDh,       // VALEUR DÉCLARÉE
        comment: cleanNotes,              // COMMENTAIRE
        numColis: totalQuantity,           // NOMBRE DE COLIS
        typePaiement: "ESPÈCES",          // TYPE DE PAIEMENT
        // numCmd is patched below with the Firebase key
      };

      const orderRef = await push(ref(db, "orders"), orderData);

      // Patch N° CMD with the Firebase-assigned key
      if (orderRef.key) {
        await update(ref(db, `orders/${orderRef.key}`), { numCmd: orderRef.key });
      }

      console.log("[OrderForm] Order created successfully. Triggering notification...");
      
      try {
        await sendOrderNotification({
          orderId: orderRef.key ?? "",
          name: orderData.name,
          phone: orderData.phone,
          city: orderData.city,
          address: orderData.address,
          productLabel: orderData.productLabel,
          quantity: orderData.quantity,
          notes: orderData.notes ?? "",
          createdAt: orderData.createdAt,
          deliveryFeeDh: orderData.deliveryFee,
          productsSubtotalDh: orderData.productsSubtotal,
          orderTotalDh: orderData.orderTotal,
        });
        console.log("[OrderForm] Notification call completed.");
      } catch (err) {
        console.error("[OrderForm] Notification failed to execute:", err);
      }

      setSending(false);
      setDone(true);
      toast.success(t.form.success);
      setTimeout(() => {
        closeOrderForm();
        setForm({ name: "", phone: "", city: "", address: "", notes: "" });
        setQuantities({});
      }, 1800);
    } catch (error) {
      console.error("Form submission error:", error);
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
        className="bg-card w-full max-w-[24rem] max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-elegant relative motion-safe:animate-[fade-up_0.35s_ease-out]"
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

            <form onSubmit={submit} className="space-y-2.5">
              <Input label={t.form.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required error={errors.name} />
              <Input label={t.form.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" error={errors.phone} />

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.city}</label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityOpen}
                      className="h-11 w-full justify-between rounded-2xl border border-border bg-secondary px-4 font-normal hover:bg-secondary hover:text-foreground"
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

              <Input label={(t.form as any).address || (lang === "ar" ? "العنوان" : "Adresse")} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required error={errors.address} />

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-3 block">{t.form.product}</label>
                <div className="space-y-2.5">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-secondary border border-transparent">
                      <div className="flex-1 font-medium text-sm text-foreground">
                        {p.name}
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {p.price} {currency}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 h-10 px-1 rounded-xl bg-card border border-border/50 shadow-sm" dir="ltr">
                        <button
                          type="button"
                          onClick={() => setQuantities({ ...quantities, [p.id]: Math.max(0, (quantities[p.id] || 0) - 1) })}
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-5 text-center font-bold text-sm">{quantities[p.id] || 0}</div>
                        <button
                          type="button"
                          onClick={() => setQuantities({ ...quantities, [p.id]: (quantities[p.id] || 0) + 1 })}
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t.form.notes}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-smooth resize-none"
                />
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">{t.form.total}</span>
                  <span className="text-2xl font-black text-primary">
                    {grandTotalDh.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
              <button
                disabled={sending}
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60 inline-flex items-center justify-center gap-2"
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
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      className={`w-full h-11 px-4 rounded-2xl bg-secondary border focus:bg-card outline-none transition-smooth ${
        error ? "border-destructive" : "border-transparent focus:border-primary"
      }`}
    />
    {error && (
      <p role="alert" className="mt-1 text-xs text-destructive font-medium">
        {error}
      </p>
    )}
  </div>
);
