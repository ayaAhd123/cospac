export type Lang = "fr" | "ar";

export const translations = {
  fr: {
    nav: { products: "Produits", benefits: "Avantages", reviews: "Avis", order: "Commander" },
    hero: {
      badge: "Nouveau · Édition Macadamia",
      title: "Coloration Bubble à la Macadamia",
      subtitle: "Couleur naturelle en 10 minutes. Sans taches, sans ammoniaque. Inspiré de la beauté méditerranéenne.",
      cta: "Commander Maintenant",
      ctaSecondary: "Voir la vidéo",
      stats: [
        { num: "+10K", label: "Clientes satisfaites" },
        { num: "98%", label: "Taux de satisfaction" },
        { num: "10 min", label: "Application" },
      ],
    },
    video: { title: "Voir la magie en action", sub: "Application en 60 secondes" },
    products: {
      title: "Nos Couleurs",
      sub: "Choisissez votre nuance idéale",
      orderBtn: "Commander",
      items: [
        { id: "dark-brown", name: "Marron Foncé", desc: "Brun profond et brillant, idéal pour un look naturel et élégant.", price: 249 },
        { id: "black", name: "Noir Intense", desc: "Noir riche et lumineux, couvre 100% des cheveux blancs.", price: 249 },
      ],
    },
    benefits: {
      title: "Pourquoi COSPAC ?",
      items: [
        { icon: "⚡", title: "Coloration Rapide", desc: "Résultat visible en 10 minutes seulement." },
        { icon: "🌿", title: "Résultat Naturel", desc: "Formule enrichie à l'huile de macadamia." },
        { icon: "✨", title: "Facile à Utiliser", desc: "Application en mousse, comme un shampoing." },
        { icon: "🛡️", title: "Sans Taches", desc: "Ne tache ni la peau ni les vêtements." },
      ],
    },
    beforeAfter: { title: "Avant & Après", sub: "Des résultats qui parlent d'eux-mêmes" },
    testimonials: {
      title: "Elles nous adorent",
      items: [
        { name: "Salma · Casablanca", text: "Incroyable ! En 10 minutes mes cheveux blancs ont disparu. Je recommande à 100%." },
        { name: "Yasmine · Rabat", text: "La couleur est super naturelle et tient longtemps. Le parfum est divin." },
        { name: "Nora · Tanger", text: "J'ai testé tellement de produits, COSPAC est de loin le meilleur." },
      ],
    },
    offer: { tag: "Offre Limitée", title: "Achetez 2 = -20%", sub: "Stock limité — Livraison partout au Maroc", cta: "Profiter de l'offre" },
    form: {
      title: "Finalisez votre commande",
      sub: "Paiement à la livraison · Livraison 24-48h",
      name: "Nom complet", phone: "Téléphone", city: "Ville",
      product: "Produit", qty: "Quantité",
      submit: "Confirmer la commande",
      sending: "Envoi...",
      success: "Commande reçue ! Nous vous appellerons sous peu.",
      total: "Total",
    },
    footer: { rights: "Tous droits réservés", contact: "Contact" },
    sticky: "Commander Maintenant",
  },
  ar: {
    nav: { products: "المنتجات", benefits: "المميزات", reviews: "الآراء", order: "اطلب" },
    hero: {
      badge: "جديد · إصدار الماكاداميا",
      title: "صبغة الفقاعات بالماكاداميا",
      subtitle: "لون طبيعي في 10 دقائق. بدون بقع، بدون أمونياك. جمال متوسطي أصيل.",
      cta: "اطلب الآن",
      ctaSecondary: "شاهد الفيديو",
      stats: [
        { num: "+10K", label: "عميلة سعيدة" },
        { num: "98%", label: "نسبة الرضا" },
        { num: "10 د", label: "للتطبيق" },
      ],
    },
    video: { title: "شاهد السحر بعينيك", sub: "التطبيق في 60 ثانية" },
    products: {
      title: "ألواننا",
      sub: "اختاري لونك المفضل",
      orderBtn: "اطلب الآن",
      items: [
        { id: "dark-brown", name: "بني داكن", desc: "بني عميق ولامع، مثالي لإطلالة طبيعية وأنيقة.", price: 249 },
        { id: "black", name: "أسود فاحم", desc: "أسود غني ولامع، يغطي 100% من الشعر الأبيض.", price: 249 },
      ],
    },
    benefits: {
      title: "لماذا COSPAC؟",
      items: [
        { icon: "⚡", title: "صبغ سريع", desc: "نتيجة واضحة في 10 دقائق فقط." },
        { icon: "🌿", title: "نتيجة طبيعية", desc: "تركيبة غنية بزيت الماكاداميا." },
        { icon: "✨", title: "سهل الاستخدام", desc: "يُطبَّق كرغوة شامبو عادي." },
        { icon: "🛡️", title: "بدون بقع", desc: "لا يترك أثراً على البشرة أو الملابس." },
      ],
    },
    beforeAfter: { title: "قبل وبعد", sub: "نتائج تتحدث عن نفسها" },
    testimonials: {
      title: "آراء عميلاتنا",
      items: [
        { name: "سلمى · الدار البيضاء", text: "رائع! في 10 دقائق اختفى الشعر الأبيض. أنصح به 100%." },
        { name: "ياسمين · الرباط", text: "اللون طبيعي جداً ويدوم طويلاً. الرائحة جميلة." },
        { name: "نورا · طنجة", text: "جربت منتجات كثيرة، COSPAC هو الأفضل بلا شك." },
      ],
    },
    offer: { tag: "عرض محدود", title: "اشترِ 2 واحصل على -20%", sub: "الكمية محدودة — التوصيل لجميع المدن", cta: "استفد من العرض" },
    form: {
      title: "أكمل طلبك",
      sub: "الدفع عند الاستلام · التوصيل خلال 24-48 ساعة",
      name: "الاسم الكامل", phone: "رقم الهاتف", city: "المدينة",
      product: "المنتج", qty: "الكمية",
      submit: "تأكيد الطلب",
      sending: "جاري الإرسال...",
      success: "تم استلام طلبك! سنتصل بك قريباً.",
      total: "المجموع",
    },
    footer: { rights: "جميع الحقوق محفوظة", contact: "اتصل بنا" },
    sticky: "اطلب الآن",
  },
} as const;
