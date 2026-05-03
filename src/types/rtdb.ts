export type OrderStatus = "pending" | "validated";

export type FirebaseOrder = {
  name: string;
  phone: string;
  city: string;
  product: string;
  productLabel?: string;
  quantity: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
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
