export type OrderStatus = "pending" | "shipping" | "delivered";

export type FirebaseOrder = {
  // ── Core customer fields ─────────────────────────────────────
  name: string;
  phone: string;
  city: string;
  /** Delivery address – required at order submission. */
  address: string;
  product: string;
  productLabel?: string;
  quantity: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;

  // ── Pricing ──────────────────────────────────────────────────
  /** Delivery fee in DH (0 for Tanger, 20 otherwise). */
  deliveryFee?: number;
  /** Product subtotal (unit price × qty) in DH. */
  productsSubtotal?: number;
  /** Grand total including delivery in DH. */
  orderTotal?: number;

  // ── Cathedis delivery fields ──────────────────────────────────
  /** EXPÉDITEUR – always "Cospac beauty". */
  expediteur?: string;
  /** TÉLÉPHONE (sender) – always "00212". */
  expediteurPhone?: string;
  /** SECTEUR – delivery zone; filled by admin after export. */
  sector?: string;
  /** VALEUR DÉCLARÉE – same as orderTotal. */
  declaredValue?: number;
  /** COMMENTAIRE – mirrors the customer notes field. */
  comment?: string;
  /** N° CMD – Firebase push key, patched after creation. */
  numCmd?: string;
  /** NOMBRE DE COLIS – total units ordered. */
  numColis?: number;
  /** TYPE DE PAIEMENT – always "ESPÈCES". */
  typePaiement?: string;
};

export type FirebaseProduct = {
  nameAr: string;
  nameFr: string;
  price: number;
  descAr: string;
  descFr: string;
  imageUrl: string;
  badge: "BEST" | "NEW" | "" | string;
  active: boolean;
};

export type FirebaseVideo = {
  titleAr: string;
  titleFr: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export type FirebaseBeforeAfter = {
  titleAr: string;
  titleFr: string;
  beforeUrl: string;
  afterUrl: string;
  beforePosX?: number;
  beforePosY?: number;
  beforeZoom?: number;
  afterPosX?: number;
  afterPosY?: number;
  afterZoom?: number;
};

export type FirebaseOffer = {
  titleAr: string;
  titleFr: string;
  descAr: string;
  descFr: string;
  imageUrl?: string;
  expiresAt: string;
  popup: boolean;
  active: boolean;
};

export type SiteSettings = {
  whatsappNumber?: string;
  phoneNumber?: string;
  adminPassword?: string;
};
