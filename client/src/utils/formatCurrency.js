export const formatCurrency = (amount, currency = 'VND') => {
  if (!amount && amount !== 0) return '0 ₫';
  
  // Đảm bảo amount là số
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // LUÔN LUÔN format là VND, không convert
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

// Helper function để parse price từ string (GIỮ NGUYÊN GIÁ TRỊ)
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  
  // Chỉ remove ký tự không phải số, KHÔNG convert currency
  const cleaned = priceString
    .toString()
    .replace(/[₫$,\s]/g, '')
    .replace(/\./g, '');
    
  return parseFloat(cleaned) || 0;
};

// Bỏ hàm convertCurrency để tránh nhầm lẫn