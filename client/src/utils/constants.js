export const API_URL = "http://localhost:5000/api";

export const CATEGORIES = {
  FRIED_CHICKEN: "Fried Chicken",
  BURGERS: "Burgers",
  COMBOS: "Combos",
  BEVERAGES: "Beverages",
};

export const PAYMENT_METHODS = {
  MOMO: "MOMO",
  COD: "Cash on Delivery",
  BANK_CARD: "Bank Card",
  E_WALLET: "E-Wallet",
};

export const ORDER_STATUSES = {
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã giao",
};

export const DISCOUNT_CODES = {
  SUMMER_SALE: {
    code: "SUMMER2023",
    discount: 20, // 20% off
    expires: "2023-09-30",
  },
  WELCOME_OFFER: {
    code: "WELCOME10",
    discount: 10, // 10% off
    expires: "2023-12-31",
  },
};