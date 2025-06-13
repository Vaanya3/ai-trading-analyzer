import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Brain, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AdvancedTradingAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [marketData, setMarketData] = useState([]);
  const [orderFlowData, setOrderFlowData] = useState([]);
  const [volumeProfile, setVolumeProfile] = useState([]);
  const [marketProfile, setMarketProfile] = useState([]);
  const [aiSignals, setAiSignals] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('5m');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Time frame configurations
  const timeframes = {
    '1m': { label: '1 Minute', interval: 60000, dataPoints: 100 },
    '5m': { label: '5 Minutes', interval: 300000, dataPoints: 100 },
    '15m': { label: '15 Minutes', interval: 900000, dataPoints: 96 },
    '1h': { label: '1 Hour', interval: 3600000, dataPoints: 72 },
    '4h': { label: '4 Hours', interval: 14400000, dataPoints: 48 },
    '1d': { label: '1 Day', interval: 86400000, dataPoints: 30 }
  };

  // Stock symbol configurations with realistic price ranges
  const stockConfigs = {
    'AAPL': { basePrice: 175, volatility: 2.5, name: 'Apple Inc.' },
    'TSLA': { basePrice: 240, volatility: 8.0, name: 'Tesla Inc.' },
    'MSFT': { basePrice: 340, volatility: 3.0, name: 'Microsoft Corp.' },
    'GOOGL': { basePrice: 140, volatility: 4.0, name: 'Alphabet Inc.' },
    'AMZN': { basePrice: 155, volatility: 3.5, name: 'Amazon.com Inc.' },
    'NVDA': { basePrice: 450, volatility: 12.0, name: 'NVIDIA Corp.' },
    'META': { basePrice: 320, volatility: 5.0, name: 'Meta Platforms Inc.' },
    'NFLX': { basePrice: 420, volatility: 6.0, name: 'Netflix Inc.' },
    'SPY': { basePrice: 430, volatility: 1.5, name: 'SPDR S&P 500 ETF' },
    'QQQ': { basePrice: 380, volatility: 2.0, name: 'Invesco QQQ Trust' }
  };

  // Load data for selected symbol and timeframe
  const loadMarketData = async (newSymbol = symbol, newTimeframe = timeframe) => {
    setIsDataLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const config = stockConfigs[newSymbol] || stockConfigs['AAPL'];
    const tfConfig = timeframes[newTimeframe];
    
    let currentSimulatedPrice = config.basePrice + (Math.random() - 0.5) * 10;

    const generateMarketData = () => {
      const data = [];
      const now = new Date();
      const volatilityFactor = config.volatility / 100;
      
      for (let i = 0; i < tfConfig.dataPoints; i++) {
        const timestamp = new Date(now.getTime() - (tfConfig.dataPoints - 1 - i) * tfConfig.interval);
        const priceChange = (Math.random() - 0.5) * volatilityFactor * currentSimulatedPrice;
        currentSimulatedPrice += priceChange;
        
        
        const volume = Math.floor(Math.random() * 50000) + 5000;
        const buyVolume = Math.floor(volume * (0.3 + Math.random() * 0.4));
        const sellVolume = volume - buyVolume;
        
        data.push({
          time: newTimeframe === '1d' ? timestamp.toLocaleDateString() : timestamp.toLocaleTimeString(),
          fullTime: timestamp,
          price: parseFloat(currentSimulatedPrice.toFixed(2)),
          volume,
          buyVolume,
          sellVolume,
          rsi: 30 + Math.random() * 40,
          macd: (Math.random() - 0.5) * 2,
          bollinger_upper: currentSimulatedPrice + (currentSimulatedPrice * volatilityFactor * 2),
          bollinger_lower: currentSimulatedPrice - (currentSimulatedPrice * volatilityFactor * 2),
          orderFlow: buyVolume - sellVolume,
          vwap: currentSimulatedPrice + (Math.random() - 0.5) * (currentSimulatedPrice * 0.001)
        });
      }
      return data;
    };

    const generateOrderFlowData = () => {
      const data = [];
      const price = currentSimulatedPrice || config.basePrice;
      const priceStep = (price * 0.001);
      
      for (let i = 0; i < 30; i++) {
        const levelPrice = price - (15 * priceStep) + (i * priceStep);
        const bidSize = Math.floor(Math.random() * 10000) + 1000;
        const askSize = Math.floor(Math.random() * 10000) + 1000;
        const delta = bidSize - askSize;
        
        data.push({
          price: levelPrice.toFixed(2),
          bidSize,
          askSize,
          delta,
          cumulative: data.length > 0 ? data[data.length - 1].cumulative + delta : delta,
          intensity: Math.abs(delta) / Math.max(bidSize, askSize)
        });
      }
      return data.reverse(); // Show highest prices first
    };

    const generateVolumeProfile = () => {
      const data = [];
      const price = currentSimulatedPrice || config.basePrice;
      const priceStep = (price * 0.002);
      
      for (let i = 0; i < 40; i++) {
        const levelPrice = price - (20 * priceStep) + (i * priceStep);
        const volume = Math.floor(Math.random() * 15000) + 2000;
        const poc = i === 20; // Point of Control in the middle
        
        data.push({
          price: levelPrice.toFixed(2),
          volume,
          isPOC: poc,
          valueArea: i >= 15 && i <= 25
        });
      }
      return data.reverse();
    };

    const generateMarketProfile = () => {
      const data = [];
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const price = currentSimulatedPrice || config.basePrice;
      
      for (let i = 0; i < Math.min(24, tfConfig.dataPoints); i++) {
        const profilePrice = price + (Math.random() - 0.5) * (price * 0.02);
        const tpo = Math.floor(Math.random() * 15) + 1;
        
        data.push({
          time: letters[i],
          price: profilePrice.toFixed(2),
          tpo,
          volume: Math.floor(Math.random() * 8000) + 1500
        });
      }
      return data;
    };

    const newMarketData = generateMarketData();
    setMarketData(newMarketData);
    setOrderFlowData(generateOrderFlowData());
    setVolumeProfile(generateVolumeProfile());
    setMarketProfile(generateMarketProfile());
    setLastUpdate(new Date());
    setIsDataLoading(false);
  };

  // Initial data load and real-time updates
  useEffect(() => {
    loadMarketData();
    
    const updateInterval = timeframes[timeframe].interval / 10; // Update 10 times per timeframe
    const interval = setInterval(() => {
      if (!isDataLoading) {
        loadMarketData();
      }
    }, Math.max(updateInterval, 5000)); // Minimum 5 second updates

    return () => clearInterval(interval);
  }, [symbol, timeframe, isDataLoading]); // Added isDataLoading to dependencies

  // Handle symbol change
  const handleSymbolChange = (newSymbol) => {
    setSymbol(newSymbol);
    setAiSignals(null); // Reset AI signals when symbol changes
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setAiSignals(null); // Reset AI signals when timeframe changes
  }; // Added closing brace here

  // AI Analysis Engine
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentData = marketData[marketData.length - 1];
    if (!currentData) return;

    // Advanced ML-based signal generation
    const rsiSignal = currentData.rsi < 30 ? 1 : currentData.rsi > 70 ? -1 : 0;
    const macdSignal = currentData.macd > 0 ? 1 : -1;
    const orderFlowSignal = currentData.orderFlow > 1000 ? 1 : currentData.orderFlow < -1000 ? -1 : 0;
    const volumeSignal = currentData.volume > 5000 ? 1 : -1;
    
    // Weighted ensemble prediction
    const signals = [
      { name: 'RSI', value: rsiSignal, weight: 0.2 },
      { name: 'MACD', value: macdSignal, weight: 0.25 },
      { name: 'Order Flow', value: orderFlowSignal, weight: 0.3 },
      { name: 'Volume Analysis', value: volumeSignal, weight: 0.15 },
      { name: 'Market Profile', value: Math.random() > 0.5 ? 1 : -1, weight: 0.1 }
    ];
    
    const compositeScore = signals.reduce((sum, signal) => 
      sum + (signal.value * signal.weight), 0);
    
    const confidence = Math.min(Math.abs(compositeScore) * 100, 95);
    const action = compositeScore > 0.2 ? 'BUY' : compositeScore < -0.2 ? 'SELL' : 'HOLD';
    
    // Risk assessment
    const volatility = Math.abs(currentData.price - currentData.vwap) / currentData.vwap;
    const riskLevel = volatility > 0.02 ? 'HIGH' : volatility > 0.01 ? 'MEDIUM' : 'LOW';
    
    setAiSignals({
      action,
      confidence: confidence.toFixed(1),
      compositeScore: compositeScore.toFixed(3),
      signals,
      riskLevel,
      currentPrice: currentData.price,
      targetPrice: action === 'BUY' ? currentData.price * 1.02 : 
                   action === 'SELL' ? currentData.price * 0.98 : currentData.price,
      stopLoss: action === 'BUY' ? currentData.price * 0.99 : 
                action === 'SELL' ? currentData.price * 1.01 : currentData.price,
      recommendations: generateRecommendations(action, confidence, riskLevel)
    });
    
    setIsAnalyzing(false);
  };

  const generateRecommendations = (action, confidence, risk) => {
    const recs = [];
    
    if (action === 'BUY') {
      recs.push('Strong bullish momentum detected');
      recs.push('Consider scaling into position');
      if (risk === 'HIGH') recs.push('Use smaller position size due to high volatility');
    } else if (action === 'SELL') {
      recs.push('Bearish pressure increasing');
      recs.push('Consider profit-taking or hedging');
      if (risk === 'HIGH') recs.push('Exit positions quickly if volatility persists');
    } else {
      recs.push('Market showing consolidation patterns');
      recs.push('Wait for clearer directional bias');
    }
    
    if (confidence < 60) {
      recs.push('Low confidence - consider waiting for stronger signals');
    }
    
    return recs;
  };

  const SignalCard = ({ signal }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-700">{signal.name}</span>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
          signal.value > 0 ? 'bg-green-100 text-green-800' :
          signal.value < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {signal.value > 0 ? 'BULLISH' : signal.value < 0 ? 'BEARISH' : 'NEUTRAL'}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Weight: {(signal.weight * 100).toFixed(0)}% | 
        Impact: {(signal.value * signal.weight).toFixed(3)}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'AI Dashboard', icon: Brain },
    { id: 'orderflow', name: 'Order Flow', icon: Activity },
    { id: 'volume', name: 'Volume Profile', icon: TrendingUp },
    { id: 'market', name: 'Market Profile', icon: Target }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* AI Analysis Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Brain className="mr-2 text-blue-600" size={20} />
            AI Trading Analysis Engine
          </h3>
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </div>
        
        {aiSignals && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Signal */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold mb-2 ${
                  aiSignals.action === 'BUY' ? 'bg-green-100 text-green-800' :
                  aiSignals.action === 'SELL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {aiSignals.action === 'BUY' ? <TrendingUp className="mr-2" size={20} /> :
                   aiSignals.action === 'SELL' ? <TrendingDown className="mr-2" size={20} /> :
                   <Activity className="mr-2" size={20} />}
                  {aiSignals.action}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {aiSignals.confidence}% Confidence
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Composite Score: {aiSignals.compositeScore}
                </div>
              </div>
            </div>

            {/* Price Targets */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-3">Price Targets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-mono font-bold">${aiSignals.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className={`font-mono font-bold ${
                    aiSignals.targetPrice > aiSignals.currentPrice ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${aiSignals.targetPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stop Loss:</span>
                  <span className="font-mono font-bold text-red-600">
                    ${aiSignals.stopLoss.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-3">Risk Assessment</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                aiSignals.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                aiSignals.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {aiSignals.riskLevel === 'HIGH' ? <AlertTriangle size={16} className="mr-1" /> :
                 aiSignals.riskLevel === 'MEDIUM' ? <Activity size={16} className="mr-1" /> :
                 <CheckCircle size={16} className="mr-1" />}
                {aiSignals.riskLevel} RISK
              </div>
              <div className="space-y-1">
                {aiSignals.recommendations.map((rec, idx) => (
                  <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Individual Signals */}
        {aiSignals && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Component Signals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiSignals.signals.map((signal, idx) => (
                <SignalCard key={idx} signal={signal} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {symbol} Price Action & Technical Indicators ({timeframes[timeframe].label})
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Data Points: {marketData.length}</span>
            <span>Volatility: {stockConfigs[symbol]?.volatility.toFixed(1)}%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="Price" />
            <Line type="monotone" dataKey="bollinger_upper" stroke="#ef4444" strokeDasharray="5 5" name="BB Upper" />
            <Line type="monotone" dataKey="bollinger_lower" stroke="#ef4444" strokeDasharray="5 5" name="BB Lower" />
            <Line type="monotone" dataKey="vwap" stroke="#f59e0b" strokeWidth={2} name="VWAP" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderOrderFlow = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Flow Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={orderFlowData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="price" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="bidSize" fill="#10b981" name="Bid Size" />
              <Bar dataKey="askSize" fill="#ef4444" name="Ask Size" />
            </BarChart>
          </ResponsiveContainer>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={orderFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="price" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="delta" stroke="#8b5cf6" strokeWidth={2} name="Order Flow Delta" />
              <Line type="monotone" dataKey="cumulative" stroke="#f59e0b" strokeWidth={2} name="Cumulative Delta" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderVolumeProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume Profile Analysis</h3>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={volumeProfile} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="price" type="category" />
            <Tooltip />
            <Bar dataKey="volume" name="Volume">
              {volumeProfile.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={
                  entry.isPOC ? '#dc2626' : 
                  entry.valueArea ? '#2563eb' : '#94a3b8'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Point of Control (POC)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span>Value Area</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-400 rounded mr-2"></div>
            <span>Low Volume</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Profile (TPO Chart)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={marketProfile}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis dataKey="price" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Tooltip />
            <Scatter dataKey="tpo" fill="#2563eb" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">AI Trading Analyzer</h1>
            </div>
            
            {/* Symbol and Timeframe Controls */}
            <div className="flex items-center space-x-4">
              {/* Stock Symbol Input */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Symbol:</label>
                <select
                  value={symbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  disabled={isDataLoading}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {Object.entries(stockConfigs).map(([sym, config]) => (
                    <option key={sym} value={sym}>
                      {sym} - {config.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Timeframe:</label>
                <select
                  value={timeframe}
                  onChange={(e) => handleTimeframeChange(e.target.value)}
                  disabled={isDataLoading}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {Object.entries(timeframes).map(([tf, config]) => (
                    <option key={tf} value={tf}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Last Update: {lastUpdate.toLocaleTimeString()}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isDataLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                  <span className={`text-sm font-medium ${isDataLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isDataLoading ? 'Loading...' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Price Display */}
          <div className="pb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {symbol}
                </span>
                <span className="text-lg text-gray-600">
                  {stockConfigs[symbol]?.name}
                </span>
              </div>
              
              {marketData.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold font-mono text-blue-600">
                    ${marketData[marketData.length - 1].price}
                  </span>
                  <div className={`px-2 py-1 rounded text-sm font-medium ${
                    marketData.length > 1 && marketData[marketData.length - 1].price > marketData[marketData.length - 2].price
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {marketData.length > 1 && (
                      <>
                        {marketData[marketData.length - 1].price > marketData[marketData.length - 2].price ? '↗' : '↘'}
                        {Math.abs(marketData[marketData.length - 1].price - marketData[marketData.length - 2].price).toFixed(2)}
                        ({((marketData[marketData.length - 1].price - marketData[marketData.length - 2].price) / marketData[marketData.length - 2].price * 100).toFixed(2)}%)
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Vol: {marketData[marketData.length - 1].volume.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orderflow' && renderOrderFlow()}
        {activeTab === 'volume' && renderVolumeProfile()}
        {activeTab === 'market' && renderMarketProfile()}
      </div>
    </div>
  );
};

export default AdvancedTradingAnalyzer;
