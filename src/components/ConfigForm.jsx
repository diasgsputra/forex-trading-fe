import React, { useState, useEffect } from 'react';

const DEFAULT_CONFIG = {
    symbol: "BTCUSDT",
    timeframe: "5m",
    plusDI_threshold: 25,
    normalDI_threshold: 20, 
    adx_minimum: 20,
    take_profit_percent: 2,
    stop_loss_percent: 1,
    leverage: 10
};

function ConfigForm({ initialConfig, onSave, onReset }) {
    const [config, setConfig] = useState(initialConfig || {
        ...DEFAULT_CONFIG,
        minusDI_threshold: DEFAULT_CONFIG.normalDI_threshold 
    });

    useEffect(() => {
        if (initialConfig) {
             setConfig({
                ...initialConfig,
                normalDI_threshold: initialConfig.minusDI_threshold 
             });
        } else {
            setConfig({
                ...DEFAULT_CONFIG,
                minusDI_threshold: DEFAULT_CONFIG.normalDI_threshold
            });
        }
    }, [initialConfig]);

    const handleChange = (e) => {
        const { id, value, type } = e.target;
        const key = id === 'normalDI_threshold' ? 'minusDI_threshold' : id;
        setConfig(prevConfig => ({
            ...prevConfig,
            [key]: type === 'number' ? parseFloat(value) : value,
            ...(id === 'normalDI_threshold' && { normalDI_threshold: type === 'number' ? parseFloat(value) : value })
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const configToSend = { ...config };
        if (configToSend.normalDI_threshold !== undefined) {
            configToSend.minusDI_threshold = configToSend.normalDI_threshold;
            delete configToSend.normalDI_threshold;
        }
        onSave(configToSend);
    };

    const handleReset = () => {
        setConfig({
            ...DEFAULT_CONFIG,
            minusDI_threshold: DEFAULT_CONFIG.normalDI_threshold
        });
        onReset();
    };

    return (
        <form onSubmit={handleSubmit} className="config-form">
            <label htmlFor="symbol">Symbol:</label>
            <input type="text" id="symbol" value={config.symbol || ''} onChange={handleChange} required />

            <label htmlFor="timeframe">Timeframe:</label>
            <input type="text" id="timeframe" value={config.timeframe || ''} onChange={handleChange} required />

            <label htmlFor="plusDI_threshold">Positive DI Threshold:</label>
            <input type="number" id="plusDI_threshold" value={config.plusDI_threshold || ''} onChange={handleChange} step="0.1" required />

            {}
            <label htmlFor="normalDI_threshold">Negative DI Threshold:</label>
            <input type="number" id="normalDI_threshold" value={config.normalDI_threshold || ''} onChange={handleChange} step="0.1" required />

            <label htmlFor="adx_minimum">ADX Minimum:</label>
            <input type="number" id="adx_minimum" value={config.adx_minimum || ''} onChange={handleChange} step="0.1" required />

            <label htmlFor="take_profit_percent">Take Profit (%):</label>
            <input type="number" id="take_profit_percent" value={config.take_profit_percent || ''} onChange={handleChange} step="0.1" required />

            <label htmlFor="stop_loss_percent">Stop Loss (%):</label>
            <input type="number" id="stop_loss_percent" value={config.stop_loss_percent || ''} onChange={handleChange} step="0.1" required />

            <label htmlFor="leverage">Leverage (x):</label>
            <input type="number" id="leverage" value={config.leverage || ''} onChange={handleChange} required />

            <div className="form-actions">
                <button type="submit">Save Configuration</button>
                <button type="button" onClick={handleReset}>Reset/Change Configuration</button>
            </div>
        </form>
    );
}

export default ConfigForm;