import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 

function WebhookSender({ onSignalSent }) {
    const [signalData, setSignalData] = useState({
        symbol: "BTCUSDT",
        plusDI: 30.0,
        minusDI: 15.0,
        adx: 30.0,
        timeframe: "5m"
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value, type } = e.target;
        setSignalData(prevData => ({
            ...prevData,
            [id]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/webhook`, signalData);
            setMessage(`Success: ${response.data.message}`);
            console.log('Webhook response:', response.data);
            // Panggil callback untuk me-refresh daftar order
            if (onSignalSent) {
                onSignalSent();
            }
        } catch (error) {
            console.error('Error sending webhook:', error);
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="webhook-sender">
            <h3>Manually Send Webhook Signal</h3>
            <p>Use this to test your strategy directly from the frontend.</p>
            <form onSubmit={handleSubmit} className="webhook-form">
                <label htmlFor="symbol">Symbol:</label>
                <input type="text" id="symbol" value={signalData.symbol} onChange={handleChange} required />

                <label htmlFor="plusDI">Positive DI:</label>
                <input type="number" id="plusDI" value={signalData.plusDI} onChange={handleChange} step="0.1" required />

                <label htmlFor="minusDI">Negative DI:</label>
                <input type="number" id="minusDI" value={signalData.minusDI} onChange={handleChange} step="0.1" required />

                <label htmlFor="adx">ADX:</label>
                <input type="number" id="adx" value={signalData.adx} onChange={handleChange} step="0.1" required />

                <label htmlFor="timeframe">Timeframe:</label>
                <input type="text" id="timeframe" value={signalData.timeframe} onChange={handleChange} required />

                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Signal'}
                </button>
            </form>
            {message && <p className={`webhook-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
        </div>
    );
}

export default WebhookSender;