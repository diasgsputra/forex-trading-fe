import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ConfigForm from './components/ConfigForm';
import OrderList from './components/OrderList';
import WebhookSender from './components/WebhookSender'; 

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [activeConfig, setActiveConfig] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('config');

    const fetchConfig = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/config`);
            setActiveConfig(response.data);
        } catch (error) {
            console.error('Error fetching configuration:', error);
            setActiveConfig(null);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
        fetchOrders();
    }, [fetchConfig, fetchOrders]); 

    const handleSignalSent = () => {
        fetchOrders(); 
        setActiveTab('orders');
    };

    const handleSaveConfig = async (configData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/config`, configData);
            alert(response.data.message);
            fetchConfig(); 
        } catch (error) {
            console.error('Error saving configuration:', error);
            alert('Failed to save configuration.');
        }
    };

    const handleResetConfig = () => {
        setActiveConfig(null); 
    };

    return (
        <div className="App">
            <header>
                <h1>Trading Strategy Application</h1>
                <nav>
                    <button onClick={() => setActiveTab('config')} className={activeTab === 'config' ? 'active' : ''}>
                        Strategy Configuration
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                        Simulated Orders
                    </button>
                    <button onClick={() => setActiveTab('webhook')} className={activeTab === 'webhook' ? 'active' : ''}> {}
                        Send Webhook
                    </button>
                </nav>
            </header>

            <main>
                {activeTab === 'config' && (
                    <div className="config-section">
                        <h2>Strategy Configuration</h2>
                        <ConfigForm
                            initialConfig={activeConfig}
                            onSave={handleSaveConfig}
                            onReset={handleResetConfig}
                        />
                        {activeConfig && (
                            <div className="active-config-display">
                                <h3>Active Configuration:</h3>
                                <pre>{JSON.stringify(activeConfig, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <h2>Simulated Orders</h2>
                        <OrderList orders={orders} />
                    </div>
                )}

                {activeTab === 'webhook' && ( 
                    <div className="webhook-section">
                        <WebhookSender onSignalSent={handleSignalSent} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;