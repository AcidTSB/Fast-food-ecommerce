import React from 'react';

const PaymentMethods = ({ onSelectPaymentMethod }) => {
    const paymentMethods = [
        { id: 'credit-card', name: 'Credit Card' },
        { id: 'momo', name: 'MOMO' },
        { id: 'cod', name: 'Cash on Delivery' },
        { id: 'bank-transfer', name: 'Bank Transfer' },
        { id: 'e-wallet', name: 'E-Wallet' },
    ];

    return (
        <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <ul className="payment-method-list">
                {paymentMethods.map(method => (
                    <li key={method.id} className="payment-method-item">
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                onChange={() => onSelectPaymentMethod(method.id)}
                            />
                            {method.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentMethods;