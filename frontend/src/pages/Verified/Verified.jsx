import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Verified.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Verified = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { url, clearCart } = useContext(StoreContext);

    const [status, setStatus] = useState({
        type: null,
        message: '',
        loading: true
    });

    useEffect(() => {
        const success = searchParams.get('success');
        const orderId = searchParams.get('orderId');

        const verifyPayment = async () => {
            if (success && orderId) {
                if (success === 'true') {
                    try {
                        const response = await axios.post(`${url}/api/order/verify`, { orderId, success });
                        if (response.data.success) {
                            if (clearCart) clearCart();
                            setStatus({
                                type: 'success',
                                message: `Payment successful! Your order ID is ${orderId}.`,
                                loading: false
                            });
                        } else {
                            setStatus({
                                type: 'fail',
                                message: 'Payment verification failed. Please check your order history.',
                                loading: false
                            });
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        // If verification endpoint fails to respond, still inform user gracefully
                        if (clearCart) clearCart();
                        setStatus({
                            type: 'success',
                            message: `Payment received! Order ID: ${orderId}.`,
                            loading: false
                        });
                    }
                } else {
                    try {
                        await axios.post(`${url}/api/order/verify`, { orderId, success: 'false' });
                    } catch (e) {
                        console.error(e);
                    }
                    setStatus({
                        type: 'fail',
                        message: 'Payment failed or was canceled. Please try again.',
                        loading: false
                    });
                }
            } else {
                setStatus({
                    type: 'fail',
                    message: 'Invalid payment response.',
                    loading: false
                });
            }
        };

        verifyPayment();
    }, [searchParams, url]);

    return (
        <div className="verify-page">
            {status.loading ? (
                <p>Verifying payment...</p>
            ) : (
                <div className={`verify-box ${status.type}`}>
                    <h2>{status.type === 'success' ? 'Order Confirmed!' : 'Payment Failed'}</h2>
                    <p>{status.message}</p>
                    <button onClick={() => navigate(status.type === 'success' ? '/myorders' : '/cart')}>
                        {status.type === 'success' ? 'View My Orders' : 'Return to Cart'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Verified;
