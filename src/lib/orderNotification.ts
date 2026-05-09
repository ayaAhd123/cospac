import emailjs from '@emailjs/browser';

type OrderNotificationPayload = {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  productLabel: string;
  quantity: number;
  notes: string;
  createdAt: string;
  deliveryFeeDh: number;
  productsSubtotalDh: number;
  orderTotalDh: number;
};

export async function sendOrderNotification(payload: OrderNotificationPayload): Promise<boolean> {
  console.log("[EmailJS] Starting notification process for order:", payload.orderId);

  const SERVICE_ID = "service_5hq8rf9";
  const TEMPLATE_ID = "template_l6omb0z";
  const PUBLIC_KEY = "ipg_YLZ4pm6-HlKBz";
  const TO_EMAIL = "cospacbeauty@gmail.com";
  const DASHBOARD_URL = "https://cospac.netlify.app/x9k4m7p2-c8q-cospac-prv-access";

  const templateParams = {
    to_email: TO_EMAIL,
    customer_name: payload.name,
    product: payload.productLabel,
    city: payload.city,
    order_id: payload.orderId,
    dashboard_url: DASHBOARD_URL,
    // Keep other fields in case the template uses them
    customer_phone: payload.phone,
    address: payload.address,
    quantity: String(payload.quantity),
    notes: payload.notes || "-",
    created_at: payload.createdAt,
    delivery_fee: String(payload.deliveryFeeDh),
    products_subtotal: String(payload.productsSubtotalDh),
    order_total: String(payload.orderTotalDh),
  };

  console.log("[EmailJS] Sending with params:", templateParams);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("[EmailJS] SUCCESS!", response.status, response.text);
    return true;
  } catch (error) {
    console.error("[EmailJS] FAILED...", error);
    return false;
  }
}

