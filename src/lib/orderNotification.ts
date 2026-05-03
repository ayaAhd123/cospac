type OrderNotificationPayload = {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  productLabel: string;
  quantity: number;
  notes: string;
  createdAt: string;
};

function hasEmailJsConfig() {
  return (
    !!import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    !!import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}

export async function sendOrderNotification(payload: OrderNotificationPayload): Promise<boolean> {
  if (!hasEmailJsConfig()) return false;

  const toEmail = import.meta.env.VITE_ORDER_NOTIFY_EMAIL || "cospacbeauty@gmail.com";

  const body = {
    service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: toEmail,
      order_id: payload.orderId,
      customer_name: payload.name,
      customer_phone: payload.phone,
      city: payload.city,
      product: payload.productLabel,
      quantity: String(payload.quantity),
      notes: payload.notes || "-",
      created_at: payload.createdAt,
    },
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.ok;
}

