import React from 'react';

function OrderList({ orders }) {
    if (!orders || orders.length === 0) {
        return <p>No simulated orders yet.</p>;
    }

    return (
        <div className="order-list">
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Symbol</th>
                        <th>Action</th>
                        <th>Entry Price</th>
                        <th>TP Price</th>
                        <th>SL Price</th>
                        <th>Leverage</th>
                        <th>Timeframe</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{new Date(order.timestamp).toLocaleString()}</td>
                            <td>{order.symbol}</td>
                            <td>{order.action}</td>
                            <td>{order.price_entry}</td>
                            <td>{order.tp_price}</td>
                            <td>{order.sl_price}</td>
                            <td>{order.leverage}</td>
                            <td>{order.timeframe}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;