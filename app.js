// Financial Dashboard with AI Stock Predictions
const stockData = {
  "RELIANCE": {
    name: "Reliance Industries",
    price: 2456.75,
    sector: "Oil & Gas",
    market_cap: "16,61,234",
    pe_ratio: 15.2,
    dividend_yield: 0.5,
    historical_prices: []
  },
  "TCS": {
    name: "Tata Consultancy Services",
    price: 3842.30,
    sector: "IT Services",
    market_cap: "14,02,156",
    pe_ratio: 28.1,
    dividend_yield: 1.1,
    historical_prices: []
  },
  "HDFCBANK": {
    name: "HDFC Bank",
    price: 1687.45,
    sector: "Banking",
    market_cap: "12,84,567",
    pe_ratio: 19.3,
    dividend_yield: 1.2,
    historical_prices: []
  },
  "INFY": {
    name: "Infosys",
    price: 1834.20,
    sector: "IT Services",
    market_cap: "7,65,432",
    pe_ratio: 26.4,
    dividend_yield: 2.1,
    historical_prices: []
  },
  "ITC": {
    name: "ITC Limited",
    price: 456.80,
    sector: "FMCG",
    market_cap: "5,67,890",
    pe_ratio: 22.7,
    dividend_yield: 4.2,
    historical_prices: []
  },
  "SBIN": {
    name: "State Bank of India",
    price: 789.35,
    sector: "Banking",
    market_cap: "7,02,156",
    pe_ratio: 12.8,
    dividend_yield: 2.8,
    historical_prices: []
  }
};

const bankingData = {
  "fixed_deposits": {
    "SBI": {"general": [2.75, 6.20], "senior": [3.25, 6.70], "description": "State Bank of India"},
    "HDFC": {"general": [2.75, 7.00], "senior": [3.25, 7.75], "description": "HDFC Bank"},
    "ICICI": {"general": [3.00, 6.90], "senior": [3.50, 7.50], "description": "ICICI Bank"},
    "Axis": {"general": [3.00, 7.00], "senior": [3.50, 7.75], "description": "Axis Bank"},
    "Kotak": {"general": [2.75, 6.20], "senior": [3.25, 6.70], "description": "Kotak Mahindra Bank"},
    "IDFC_First": {"general": [3.00, 7.00], "senior": [3.50, 7.50], "description": "IDFC First Bank"},
    "Bank_of_India": {"general": [3.00, 7.10], "senior": [3.00, 7.25], "description": "Bank of India"},
    "PNB": {"general": [3.50, 6.50], "senior": [4.30, 7.30], "description": "Punjab National Bank"}
  },
  "home_loans": {
    "Bajaj_Housing": {"rate": 7.35, "description": "Bajaj Housing Finance"},
    "SBI": {"rate": [7.50, 8.95], "description": "State Bank of India"},
    "ICICI": {"rate": 7.70, "description": "ICICI Bank"},
    "HDFC": {"rate": 7.90, "description": "HDFC Bank"},
    "Kotak": {"rate": 7.99, "description": "Kotak Mahindra Bank"},
    "Axis": {"rate": [8.35, 11.90], "description": "Axis Bank"},
    "PNB": {"rate": [7.50, 9.35], "description": "Punjab National Bank"}
  },
  "personal_loans": {
    "Axis": {"rate": [9.99, 22.00], "description": "Axis Bank"},
    "HDFC": {"rate": [10.50, 24.00], "description": "HDFC Bank"},
    "ICICI": {"rate": [10.60, 16.50], "description": "ICICI Bank"},
    "Kotak": {"rate": [10.99, 24.00], "description": "Kotak Mahindra Bank"},
    "SBI": {"rate": [11.15, 15.00], "description": "State Bank of India"}
  }
};

const marketIndices = {
  "NIFTY50": { value: 24127.85, change: 156.32, change_percent: 0.65 },
  "SENSEX": { value: 79586.45, change: 498.58, change_percent: 0.63 },
  "BANKNIFTY": { value: 51789.30, change: -234.67, change_percent: -0.45 }
};

class TechnicalAnalysis {
  static calculateSMA(prices, period) {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  static calculateEMA(prices, period, prevEMA = null) {
    if (prices.length === 0) return null;
    const currentPrice = prices[prices.length - 1];
    if (prevEMA === null) {
      return this.calculateSMA(prices.slice(0, period), period);
    }
    const multiplier = 2 / (period + 1);
    return (currentPrice - prevEMA) * multiplier + prevEMA;
  }

  static calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;
    
    let gains = 0, losses = 0;
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  static calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (prices.length < slowPeriod) return null;
    
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    
    if (!fastEMA || !slowEMA) return null;
    
    const macdLine = fastEMA - slowEMA;
    return {
      macd: macdLine,
      signal: macdLine, // Simplified for demo
      histogram: 0
    };
  }

  static calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) return null;
    
    const sma = this.calculateSMA(prices, period);
    if (!sma) return null;
    
    const recentPrices = prices.slice(-period);
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  static generateSupportResistanceLevels(prices, currentPrice) {
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const priceRange = sortedPrices[sortedPrices.length - 1] - sortedPrices[0];
    
    return {
      resistance: [
        { price: currentPrice * 1.05, strength: 'Strong', distance: '+5.02%' },
        { price: currentPrice * 1.025, strength: 'Medium', distance: '+2.58%' }
      ],
      support: [
        { price: currentPrice * 0.985, strength: 'Strong', distance: '-1.50%' },
        { price: currentPrice * 0.97, strength: 'Medium', distance: '-3.12%' }
      ]
    };
  }
}

class PredictionEngine {
  static generatePredictions(symbol) {
    const stock = stockData[symbol];
    const currentPrice = stock.price;
    
    // Generate historical data if not exists
    if (!stock.historical_prices.length) {
      this.generateHistoricalData(symbol, 50);
    }
    
    const prices = stock.historical_prices;
    
    // Calculate technical indicators
    const sma20 = TechnicalAnalysis.calculateSMA(prices, 20);
    const ema20 = TechnicalAnalysis.calculateEMA(prices, 20);
    const rsi = TechnicalAnalysis.calculateRSI(prices);
    const macd = TechnicalAnalysis.calculateMACD(prices);
    const bollinger = TechnicalAnalysis.calculateBollingerBands(prices);
    
    // Multi-factor prediction algorithm
    const trendSignal = this.analyzeTrend(sma20, ema20, currentPrice);
    const momentumSignal = this.analyzeMomentum(rsi, macd);
    const volatilitySignal = this.analyzeVolatility(bollinger, currentPrice);
    
    // Combine signals for prediction
    const overallSignal = this.combineSignals([trendSignal, momentumSignal, volatilitySignal]);
    
    return {
      nextDay: this.generateTimeframePrediction(currentPrice, overallSignal, 0.8, 1),
      nextWeek: this.generateTimeframePrediction(currentPrice, overallSignal, 0.6, 7),
      nextMonth: this.generateTimeframePrediction(currentPrice, overallSignal, 0.4, 30),
      technicalIndicators: {
        sma20: sma20,
        ema20: ema20,
        rsi: rsi,
        macd: macd?.macd || 0,
        bollinger: bollinger
      },
      tradingSignal: this.generateTradingSignal(overallSignal, currentPrice),
      supportResistance: TechnicalAnalysis.generateSupportResistanceLevels(prices, currentPrice)
    };
  }

  static generateHistoricalData(symbol, days) {
    const stock = stockData[symbol];
    const basePrice = stock.price;
    const prices = [];
    
    // Generate realistic price movement
    let currentPrice = basePrice * (0.8 + Math.random() * 0.4); // Start 20% below to above
    
    for (let i = 0; i < days; i++) {
      // Add realistic volatility based on sector
      const volatility = this.getSectorVolatility(stock.sector);
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      currentPrice = Math.max(currentPrice + change, currentPrice * 0.95);
      prices.push(currentPrice);
    }
    
    // Ensure last price is close to current price
    prices[prices.length - 1] = basePrice;
    stock.historical_prices = prices;
  }

  static getSectorVolatility(sector) {
    const volatilityMap = {
      'IT Services': 0.02,
      'Banking': 0.025,
      'Oil & Gas': 0.03,
      'FMCG': 0.015,
      'Telecom': 0.025,
      'Paints': 0.02,
      'Automotive': 0.028,
      'Construction': 0.03
    };
    return volatilityMap[sector] || 0.025;
  }

  static analyzeTrend(sma, ema, currentPrice) {
    if (!sma || !ema) return 0;
    
    let signal = 0;
    if (ema > sma) signal += 0.3; // EMA above SMA is bullish
    if (currentPrice > ema) signal += 0.4; // Price above EMA is bullish
    if (currentPrice > sma) signal += 0.3; // Price above SMA is bullish
    
    return Math.max(-1, Math.min(1, signal - 0.5)); // Normalize to -1 to 1
  }

  static analyzeMomentum(rsi, macd) {
    let signal = 0;
    
    if (rsi) {
      if (rsi > 70) signal -= 0.3; // Overbought
      else if (rsi < 30) signal += 0.3; // Oversold
      else if (rsi > 50) signal += 0.2; // Above neutral
      else signal -= 0.2; // Below neutral
    }
    
    if (macd && macd.macd > 0) signal += 0.3;
    
    return Math.max(-1, Math.min(1, signal));
  }

  static analyzeVolatility(bollinger, currentPrice) {
    if (!bollinger) return 0;
    
    const position = (currentPrice - bollinger.lower) / (bollinger.upper - bollinger.lower);
    
    if (position > 0.8) return -0.3; // Near upper band, potential reversal
    if (position < 0.2) return 0.3; // Near lower band, potential bounce
    return 0; // Near middle, neutral
  }

  static combineSignals(signals) {
    const weights = [0.4, 0.35, 0.25]; // Trend, Momentum, Volatility weights
    return signals.reduce((sum, signal, index) => sum + signal * weights[index], 0);
  }

  static generateTimeframePrediction(currentPrice, signal, confidence, days) {
    const baseChange = signal * 0.1 * Math.sqrt(days); // Scale with time
    const randomFactor = (Math.random() - 0.5) * 0.05; // Add some randomness
    const totalChange = baseChange + randomFactor;
    
    const predictedPrice = currentPrice * (1 + totalChange);
    const change = predictedPrice - currentPrice;
    const changePercent = (change / currentPrice) * 100;
    
    return {
      price: predictedPrice,
      change: change,
      changePercent: changePercent,
      confidence: confidence > 0.7 ? 'High' : confidence > 0.4 ? 'Medium' : 'Low'
    };
  }

  static generateTradingSignal(overallSignal, currentPrice) {
    let signal, confidence;
    
    if (overallSignal > 0.3) {
      signal = 'STRONG BUY';
      confidence = 78;
    } else if (overallSignal > 0.1) {
      signal = 'BUY';
      confidence = 65;
    } else if (overallSignal > -0.1) {
      signal = 'HOLD';
      confidence = 55;
    } else if (overallSignal > -0.3) {
      signal = 'SELL';
      confidence = 65;
    } else {
      signal = 'STRONG SELL';
      confidence = 78;
    }
    
    const targetPrice = currentPrice * (1 + overallSignal * 0.05);
    const stopLoss = currentPrice * (1 - Math.abs(overallSignal) * 0.03);
    
    return {
      signal,
      confidence,
      targetPrice,
      stopLoss,
      riskLevel: Math.abs(overallSignal) > 0.5 ? 'High Risk' : Math.abs(overallSignal) > 0.2 ? 'Medium Risk' : 'Low Risk',
      reasoning: this.generateReasoning(overallSignal)
    };
  }

  static generateReasoning(signal) {
    const reasons = [];
    
    if (signal > 0.2) {
      reasons.push('EMA(10) crossed above EMA(20)');
      reasons.push('RSI recovering from oversold');
      reasons.push('MACD bullish crossover');
      reasons.push('Strong momentum indicators suggest upward movement');
    } else if (signal > 0) {
      reasons.push('Positive technical signals');
      reasons.push('Price above key moving averages');
      reasons.push('Moderate bullish momentum');
    } else if (signal > -0.2) {
      reasons.push('Mixed signals from technical indicators');
      reasons.push('Trading within Bollinger Bands');
      reasons.push('RSI in neutral zone');
    } else {
      reasons.push('Bearish technical signals');
      reasons.push('Price below key support levels');
      reasons.push('Negative momentum indicators');
    }
    
    return reasons.join(', ');
  }
}

class PortfolioManager {
  constructor() {
    this.holdings = [
      { symbol: 'RELIANCE', qty: 50, buyPrice: 2400, currentPrice: 2456.75 },
      { symbol: 'TCS', qty: 30, buyPrice: 3800, currentPrice: 3842.30 },
      { symbol: 'HDFCBANK', qty: 100, buyPrice: 1650, currentPrice: 1687.45 }
    ];
  }

  calculatePortfolioValue() {
    return this.holdings.reduce((total, holding) => {
      return total + (holding.qty * holding.currentPrice);
    }, 0);
  }

  calculatePnL() {
    const totalInvested = this.holdings.reduce((total, holding) => {
      return total + (holding.qty * holding.buyPrice);
    }, 0);
    
    const currentValue = this.calculatePortfolioValue();
    const pnl = currentValue - totalInvested;
    const pnlPercent = (pnl / totalInvested) * 100;
    
    return {
      absolute: pnl,
      percentage: pnlPercent,
      invested: totalInvested,
      current: currentValue
    };
  }

  getAIScore() {
    // Simplified AI score based on diversification and performance
    const sectors = [...new Set(this.holdings.map(h => stockData[h.symbol].sector))];
    const diversificationScore = Math.min(sectors.length * 20, 40);
    const performanceScore = Math.max(0, Math.min(this.calculatePnL().percentage * 2, 60));
    
    return Math.round(diversificationScore + performanceScore);
  }

  addStock(symbol, qty, buyPrice) {
    const existingHolding = this.holdings.find(h => h.symbol === symbol);
    if (existingHolding) {
      // Average the buy price
      const totalQty = existingHolding.qty + qty;
      existingHolding.buyPrice = ((existingHolding.buyPrice * existingHolding.qty) + (buyPrice * qty)) / totalQty;
      existingHolding.qty = totalQty;
    } else {
      this.holdings.push({
        symbol,
        qty,
        buyPrice,
        currentPrice: stockData[symbol].price
      });
    }
  }

  removeStock(symbol) {
    this.holdings = this.holdings.filter(h => h.symbol !== symbol);
  }
}

class FinancialDashboard {
  constructor() {
    this.currentStock = 'RELIANCE';
    this.portfolioManager = new PortfolioManager();
    this.priceChart = null;
    this.portfolioChart = null;
    this.updateInterval = null;
    
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupPredictions();
    this.setupTechnicalAnalysis();
    this.setupPortfolio();
    this.setupBanking();
    this.setupInsights();
    this.setupModals();
    this.startRealTimeUpdates();
    
    // Initialize with default stock
    this.updatePredictions();
    this.updateTechnicalAnalysis();
    this.updatePortfolioDisplay();
    this.updateMarketInsights();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const targetSection = link.getAttribute('data-section');
        
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');
        
        if (targetSection === 'technical') {
          this.initializeTechnicalChart();
        } else if (targetSection === 'portfolio') {
          this.initializePortfolioChart();
        }
      });
    });
  }

  setupPredictions() {
    document.getElementById('prediction-stock').addEventListener('change', (e) => {
      this.currentStock = e.target.value;
      this.updatePredictions();
    });

    document.getElementById('refresh-predictions').addEventListener('click', () => {
      this.updatePredictions();
    });
  }

  updatePredictions() {
    const stock = stockData[this.currentStock];
    const predictions = PredictionEngine.generatePredictions(this.currentStock);
    
    // Update current stock info
    document.getElementById('current-stock-name').textContent = this.currentStock;
    document.getElementById('current-stock-sector').textContent = stock.sector;
    document.getElementById('current-stock-price').textContent = `₹${this.formatNumber(stock.price)}`;
    
    const change = (Math.random() - 0.5) * 50;
    const changePercent = (change / stock.price) * 100;
    const changeEl = document.getElementById('current-stock-change');
    changeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
    changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
    
    // Update metrics
    document.getElementById('stock-market-cap').textContent = `₹${stock.market_cap} Cr`;
    document.getElementById('stock-pe-ratio').textContent = stock.pe_ratio;
    document.getElementById('stock-dividend').textContent = `${stock.dividend_yield}%`;
    
    // Update predictions
    this.updatePredictionTimeframe('next-day', predictions.nextDay);
    this.updatePredictionTimeframe('next-week', predictions.nextWeek);
    this.updatePredictionTimeframe('next-month', predictions.nextMonth);
    
    // Update trading recommendation
    const signal = predictions.tradingSignal;
    document.getElementById('trade-signal').textContent = signal.signal;
    document.getElementById('trade-signal').className = `signal-badge ${signal.signal.includes('BUY') ? 'buy' : signal.signal.includes('SELL') ? 'sell' : 'hold'}`;
    document.getElementById('signal-confidence').textContent = `Confidence: ${signal.confidence}%`;
    document.getElementById('target-price').textContent = `₹${this.formatNumber(signal.targetPrice)}`;
    document.getElementById('stop-loss-price').textContent = `₹${this.formatNumber(signal.stopLoss)}`;
    document.getElementById('risk-level').textContent = signal.riskLevel;
    document.getElementById('recommendation-reason').textContent = signal.reasoning;
  }

  updatePredictionTimeframe(timeframe, prediction) {
    document.getElementById(`${timeframe}-price`).textContent = `₹${this.formatNumber(prediction.price)}`;
    document.getElementById(`${timeframe}-confidence`).textContent = `${prediction.confidence} Confidence`;
    document.getElementById(`${timeframe}-confidence`).className = `confidence-badge ${prediction.confidence.toLowerCase()}`;
    
    const changeEl = document.getElementById(`${timeframe}-change`);
    changeEl.className = `prediction-change ${prediction.change >= 0 ? 'positive' : 'negative'}`;
    changeEl.textContent = `${prediction.change >= 0 ? '+' : ''}${this.formatNumber(prediction.change)} (${prediction.changePercent >= 0 ? '+' : ''}${prediction.changePercent.toFixed(2)}%)`;
  }

  setupTechnicalAnalysis() {
    document.getElementById('chart-stock').addEventListener('change', (e) => {
      this.currentStock = e.target.value;
      this.updateTechnicalAnalysis();
      this.initializeTechnicalChart();
    });

    document.getElementById('chart-timeframe').addEventListener('change', () => {
      this.initializeTechnicalChart();
    });
  }

  updateTechnicalAnalysis() {
    const predictions = PredictionEngine.generatePredictions(this.currentStock);
    const indicators = predictions.technicalIndicators;
    
    document.getElementById('chart-title').textContent = `${this.currentStock} Price Chart with Technical Indicators`;
    
    // Update RSI
    if (indicators.rsi) {
      document.getElementById('rsi-value').textContent = indicators.rsi.toFixed(1);
      document.getElementById('rsi-fill').style.width = `${indicators.rsi}%`;
      document.getElementById('rsi-signal').textContent = indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral';
    }
    
    // Update MACD
    if (indicators.macd) {
      document.getElementById('macd-value').textContent = indicators.macd.toFixed(1);
      document.getElementById('macd-status').textContent = indicators.macd > 0 ? 'Bullish Crossover' : 'Bearish Crossover';
      document.getElementById('macd-status').className = `indicator-status ${indicators.macd > 0 ? 'positive' : 'negative'}`;
    }
    
    // Update Moving Averages
    if (indicators.sma20) {
      document.getElementById('sma20-value').textContent = `₹${this.formatNumber(indicators.sma20)}`;
      document.getElementById('sma20-trend').textContent = '↗';
      document.getElementById('sma20-trend').className = 'ma-trend positive';
    }
    
    if (indicators.ema20) {
      document.getElementById('ema20-value').textContent = `₹${this.formatNumber(indicators.ema20)}`;
      document.getElementById('ema20-trend').textContent = '↗';
      document.getElementById('ema20-trend').className = 'ma-trend positive';
    }
    
    // Update Bollinger Bands
    if (indicators.bollinger) {
      document.getElementById('bb-upper').textContent = `₹${this.formatNumber(indicators.bollinger.upper)}`;
      document.getElementById('bb-lower').textContent = `₹${this.formatNumber(indicators.bollinger.lower)}`;
      document.getElementById('bb-position').textContent = 'Near Middle Band';
    }
    
    // Update Support & Resistance
    const levels = predictions.supportResistance;
    // This would update the support/resistance display
  }

  initializeTechnicalChart() {
    if (this.priceChart) {
      this.priceChart.destroy();
    }

    const ctx = document.getElementById('main-price-chart').getContext('2d');
    const stock = stockData[this.currentStock];
    
    // Generate price data for chart
    const labels = [];
    const priceData = [];
    const smaData = [];
    const emaData = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate() + '/' + (date.getMonth() + 1));
      
      const basePrice = stock.price;
      const variation = (Math.random() - 0.5) * 0.1 * basePrice;
      const price = basePrice + variation;
      priceData.push(price);
      smaData.push(price * (0.98 + Math.random() * 0.04));
      emaData.push(price * (0.985 + Math.random() * 0.03));
    }

    this.priceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Price',
            data: priceData,
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'SMA(20)',
            data: smaData,
            borderColor: '#FFC185',
            backgroundColor: 'transparent',
            borderWidth: 1,
            fill: false
          },
          {
            label: 'EMA(20)',
            data: emaData,
            borderColor: '#B4413C',
            backgroundColor: 'transparent',
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  setupPortfolio() {
    document.getElementById('add-stock-btn').addEventListener('click', () => {
      document.getElementById('add-stock-modal').classList.remove('hidden');
    });

    document.getElementById('rebalance-btn').addEventListener('click', () => {
      this.showRebalanceAlert();
    });
  }

  updatePortfolioDisplay() {
    const pnl = this.portfolioManager.calculatePnL();
    const totalValue = this.portfolioManager.calculatePortfolioValue();
    
    document.getElementById('portfolio-total').textContent = `₹${this.formatNumber(totalValue)}`;
    
    const todayPnL = totalValue * 0.025; // Simulated daily P&L
    document.getElementById('portfolio-pnl').textContent = `+₹${this.formatNumber(todayPnL)} (2.24%)`;
    document.getElementById('portfolio-pnl').className = 'stat-value positive';
    
    document.getElementById('portfolio-returns').textContent = `${pnl.absolute >= 0 ? '+' : ''}₹${this.formatNumber(pnl.absolute)} (${pnl.percentage.toFixed(2)}%)`;
    document.getElementById('portfolio-returns').className = `stat-value ${pnl.absolute >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('portfolio-score').textContent = `${this.portfolioManager.getAIScore()}/100`;
    
    // Update holdings table
    this.updateHoldingsTable();
  }

  updateHoldingsTable() {
    const holdingsBody = document.getElementById('holdings-list');
    holdingsBody.innerHTML = '';
    
    this.portfolioManager.holdings.forEach(holding => {
      const pnl = (holding.currentPrice - holding.buyPrice) * holding.qty;
      const pnlPercent = ((holding.currentPrice - holding.buyPrice) / holding.buyPrice) * 100;
      
      const predictions = PredictionEngine.generatePredictions(holding.symbol);
      const signal = predictions.tradingSignal.signal;
      
      const row = document.createElement('div');
      row.className = 'holdings-row';
      row.innerHTML = `
        <div class="holding-symbol">${holding.symbol}</div>
        <div class="holding-qty">${holding.qty}</div>
        <div class="holding-price">₹${this.formatNumber(holding.currentPrice)}</div>
        <div class="holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}">${pnl >= 0 ? '+' : ''}₹${this.formatNumber(pnl)}</div>
        <div class="holding-signal ${signal.includes('BUY') ? 'buy' : signal.includes('SELL') ? 'sell' : 'hold'}">${signal}</div>
        <div class="holding-action">
          <button class="action-btn sell" onclick="dashboard.sellStock('${holding.symbol}')">Sell</button>
        </div>
      `;
      holdingsBody.appendChild(row);
    });
  }

  initializePortfolioChart() {
    if (this.portfolioChart) {
      this.portfolioChart.destroy();
    }

    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    
    // Generate portfolio performance data
    const labels = [];
    const portfolioData = [];
    const marketData = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate() + '/' + (date.getMonth() + 1));
      
      portfolioData.push(500000 + (Math.random() - 0.3) * 50000 + i * 2000);
      marketData.push(500000 + (Math.random() - 0.4) * 40000 + i * 1500);
    }

    this.portfolioChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Your Portfolio',
            data: portfolioData,
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Market (NIFTY)',
            data: marketData,
            borderColor: '#B4413C',
            backgroundColor: 'transparent',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  setupBanking() {
    // Calculator tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCalc = btn.getAttribute('data-calc');
        
        tabBtns.forEach(tab => tab.classList.remove('active'));
        btn.classList.add('active');
        
        calculatorPanels.forEach(panel => panel.classList.remove('active'));
        const targetPanel = document.getElementById(`${targetCalc}-calculator`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // FD Calculator
    const calcFDBtn = document.getElementById('calc-fd');
    if (calcFDBtn) {
      calcFDBtn.addEventListener('click', () => {
        this.calculateFD();
      });
    }

    // EMI Calculator
    const calcEMIBtn = document.getElementById('calc-emi');
    if (calcEMIBtn) {
      calcEMIBtn.addEventListener('click', () => {
        this.calculateEMI();
      });
      
      const emiTypeSelect = document.getElementById('emi-type');
      if (emiTypeSelect) {
        emiTypeSelect.addEventListener('change', () => {
          this.updateEMIBankOptions();
        });
      }
    }

    // Initialize with default calculations
    setTimeout(() => {
      this.calculateFD();
      this.calculateEMI();
    }, 100);
  }

  calculateFD() {
    const amountEl = document.getElementById('fd-amount');
    const bankEl = document.getElementById('fd-bank');
    const yearsEl = document.getElementById('fd-years');
    const seniorEl = document.getElementById('fd-senior');
    
    if (!amountEl || !bankEl || !yearsEl || !seniorEl) return;

    const amount = parseFloat(amountEl.value) || 0;
    const bank = bankEl.value;
    const years = parseFloat(yearsEl.value) || 0;
    const isSenior = seniorEl.checked;

    if (amount && bank && years) {
      const bankData = bankingData.fixed_deposits[bank];
      const rates = isSenior ? bankData.senior : bankData.general;
      const rate = Array.isArray(rates) ? rates[1] : rates;

      const maturityAmount = amount * Math.pow(1 + rate / 100, years);
      const interest = maturityAmount - amount;

      document.getElementById('fd-principal').textContent = `₹${this.formatNumber(amount)}`;
      document.getElementById('fd-interest').textContent = `₹${this.formatNumber(interest)}`;
      document.getElementById('fd-maturity').textContent = `₹${this.formatNumber(maturityAmount)}`;
      document.getElementById('fd-rate').textContent = `${rate}% p.a.`;
    }
  }

  calculateEMI() {
    const amountEl = document.getElementById('emi-amount');
    const bankEl = document.getElementById('emi-bank');
    const yearsEl = document.getElementById('emi-years');
    const typeEl = document.getElementById('emi-type');
    
    if (!amountEl || !bankEl || !yearsEl || !typeEl) return;

    const amount = parseFloat(amountEl.value) || 0;
    const bank = bankEl.value;
    const years = parseFloat(yearsEl.value) || 0;
    const loanType = typeEl.value;

    if (amount && bank && years) {
      const loanData = loanType === 'home' ? bankingData.home_loans : bankingData.personal_loans;
      const bankData = loanData[bank];
      if (!bankData) return;
      
      const rate = Array.isArray(bankData.rate) ? bankData.rate[0] : bankData.rate;
      
      const monthlyRate = rate / (12 * 100);
      const months = years * 12;
      
      const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - amount;

      document.getElementById('emi-monthly').textContent = `₹${this.formatNumber(emi)}`;
      document.getElementById('emi-principal').textContent = `₹${this.formatNumber(amount)}`;
      document.getElementById('emi-total-interest').textContent = `₹${this.formatNumber(totalInterest)}`;
      document.getElementById('emi-total').textContent = `₹${this.formatNumber(totalPayment)}`;
    }
  }

  updateEMIBankOptions() {
    const loanType = document.getElementById('emi-type').value;
    const bankSelect = document.getElementById('emi-bank');
    
    bankSelect.innerHTML = '';
    
    const loanData = loanType === 'home' ? bankingData.home_loans : bankingData.personal_loans;
    
    Object.entries(loanData).forEach(([bank, data]) => {
      const rate = Array.isArray(data.rate) ? data.rate[0] : data.rate;
      const option = document.createElement('option');
      option.value = bank;
      option.textContent = `${data.description} - ${rate}%`;
      bankSelect.appendChild(option);
    });
  }

  setupInsights() {
    // Market movers tabs
    const moverTabs = document.querySelectorAll('.mover-tab');
    moverTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        moverTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const targetTab = tab.getAttribute('data-tab');
        document.getElementById('gainers-list').classList.toggle('hidden', targetTab !== 'gainers');
        document.getElementById('losers-list').classList.toggle('hidden', targetTab !== 'losers');
      });
    });
  }

  updateMarketInsights() {
    // Update market indices
    Object.entries(marketIndices).forEach(([index, data]) => {
      // Market indices are already displayed in HTML
    });
    
    // Update last update time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    document.getElementById('insights-update-time').textContent = timeString;
  }

  setupModals() {
    // Add stock modal
    document.getElementById('modal-close').addEventListener('click', () => {
      document.getElementById('add-stock-modal').classList.add('hidden');
    });

    document.getElementById('modal-cancel').addEventListener('click', () => {
      document.getElementById('add-stock-modal').classList.add('hidden');
    });

    document.getElementById('modal-add-stock').addEventListener('click', () => {
      const symbol = document.getElementById('modal-stock-select').value;
      const qty = parseInt(document.getElementById('modal-quantity').value);
      const buyPrice = parseFloat(document.getElementById('modal-buy-price').value);
      
      this.portfolioManager.addStock(symbol, qty, buyPrice);
      this.updatePortfolioDisplay();
      document.getElementById('add-stock-modal').classList.add('hidden');
    });

    // Update buy price when stock changes
    document.getElementById('modal-stock-select').addEventListener('change', (e) => {
      const symbol = e.target.value;
      document.getElementById('modal-buy-price').value = stockData[symbol].price;
    });
  }

  sellStock(symbol) {
    this.portfolioManager.removeStock(symbol);
    this.updatePortfolioDisplay();
  }

  showRebalanceAlert() {
    alert('Portfolio rebalancing recommendations:\n\n1. Reduce RELIANCE position by 10%\n2. Increase TCS allocation for better returns\n3. Consider adding INFY for IT sector diversification');
  }

  startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      this.simulateMarketUpdates();
      this.updateTickerContent();
    }, 5000);

    this.updateTickerContent();
  }

  simulateMarketUpdates() {
    // Update stock prices
    Object.keys(stockData).forEach(symbol => {
      const volatility = PredictionEngine.getSectorVolatility(stockData[symbol].sector);
      const change = (Math.random() - 0.5) * volatility * stockData[symbol].price;
      stockData[symbol].price = Math.max(stockData[symbol].price + change, stockData[symbol].price * 0.98);
    });

    // Update market indices
    Object.keys(marketIndices).forEach(index => {
      const change = (Math.random() - 0.5) * 100;
      marketIndices[index].value += change;
      marketIndices[index].change = change;
      marketIndices[index].change_percent = (change / marketIndices[index].value) * 100;
    });

    // Update portfolio manager current prices
    this.portfolioManager.holdings.forEach(holding => {
      holding.currentPrice = stockData[holding.symbol].price;
    });

    // Update displays if on relevant sections
    if (document.getElementById('predictions').classList.contains('active')) {
      // Don't auto-update predictions as they're expensive to calculate
    }
    
    if (document.getElementById('portfolio').classList.contains('active')) {
      this.updatePortfolioDisplay();
    }
  }

  updateTickerContent() {
    const ticker = document.getElementById('ticker-content');
    let content = '';
    
    Object.entries(marketIndices).forEach(([index, data]) => {
      content += `<span class="ticker-item">${index}: ${this.formatNumber(data.value)} (${data.change >= 0 ? '+' : ''}${data.change_percent.toFixed(2)}%)</span>`;
    });
    
    Object.entries(stockData).slice(0, 6).forEach(([symbol, data]) => {
      const change = (Math.random() - 0.5) * 20;
      const changePercent = (change / data.price) * 100;
      content += `<span class="ticker-item">${symbol}: ₹${this.formatNumber(data.price)} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)</span>`;
    });
    
    ticker.innerHTML = content;
  }

  formatNumber(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
}

// Initialize the application
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new FinancialDashboard();
  console.log('FinanceDash Pro initialized successfully!');
});

// Make dashboard globally accessible for button clicks
window.dashboard = dashboard;
