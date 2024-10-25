import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, BarChart2, AlertTriangle, Clock, Star } from 'lucide-react';

const WarehouseOptimizer = () => {
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState(30);
  const [stockAccuracy, setStockAccuracy] = useState(100);
  const [alerts, setAlerts] = useState([]);
  
  const [inventory, setInventory] = useState({
    electronics: { stock: 50, demand: 10, optimal: 50, warning: false },
    apparel: { stock: 50, demand: 8, optimal: 50, warning: false },
    accessories: { stock: 50, demand: 15, optimal: 50, warning: false }
  });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setDay(1);
    setTime(30);
    setStockAccuracy(100);
    setAlerts([]);
    setInventory({
      electronics: { stock: 50, demand: 10, optimal: 50, warning: false },
      apparel: { stock: 50, demand: 8, optimal: 50, warning: false },
      accessories: { stock: 50, demand: 15, optimal: 50, warning: false }
    });
  };

  // Handle inventory adjustments
  const adjustStock = (category, amount) => {
    if (gameState !== 'playing') return;

    setInventory(prev => {
      const newInventory = { ...prev };
      const item = newInventory[category];
      
      // Update stock with limits
      item.stock = Math.max(0, Math.min(100, item.stock + amount));
      
      // Check if we're moving closer to optimal
      const prevDiff = Math.abs(prev[category].stock - item.optimal);
      const newDiff = Math.abs(item.stock - item.optimal);
      
      if (newDiff < prevDiff) {
        setScore(prev => prev + 5);
      }
      
      // Update warning status
      item.warning = item.stock < item.demand * 2 || item.stock > item.optimal * 1.5;
      
      return newInventory;
    });
  };

  // Process daily demand
  const processDemand = () => {
    setInventory(prev => {
      const newInventory = { ...prev };
      let newAlerts = [];
      let accuracyImpact = 0;
      
      Object.entries(newInventory).forEach(([category, item]) => {
        // Random demand fluctuation
        const dailyDemand = item.demand + Math.floor(Math.random() * 5 - 2);
        
        // Process stock reduction
        if (item.stock >= dailyDemand) {
          item.stock -= dailyDemand;
          accuracyImpact += 1;
        } else {
          newAlerts.push(`Stockout: ${category}`);
          accuracyImpact -= 2;
          setScore(prev => Math.max(0, prev - 10));
        }
        
        // Check overstock
        if (item.stock > item.optimal * 1.5) {
          newAlerts.push(`Overstock: ${category}`);
          accuracyImpact -= 1;
          setScore(prev => Math.max(0, prev - 5));
        }
        
        // Update warning status
        item.warning = item.stock < item.demand * 2 || item.stock > item.optimal * 1.5;
      });
      
      // Update accuracy
      setStockAccuracy(prev => Math.min(100, Math.max(0, prev + accuracyImpact)));
      
      // Update alerts
      setAlerts(newAlerts);
      
      return newInventory;
    });
  };

  // Game timer
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          return prev - 1;
        });
        processDemand();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, time]);

  return (
    <div style={{
      backgroundColor: '#0A192F',
      color: 'white',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '1024px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Warehouse Optimizer
        </h2>
        
        {gameState === 'intro' && (
          <div>
            <p style={{ color: '#94A3B8', marginBottom: '24px' }}>
              Optimize your warehouse inventory levels and maintain perfect stock accuracy!
              Balance demand with stock levels while avoiding stockouts and overstock situations.
            </p>
            <button
              onClick={startGame}
              style={{
                backgroundColor: '#00B4D8',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#0096B4'}
              onMouseOut={e => e.target.style.backgroundColor = '#00B4D8'}
            >
              Start Optimizing
            </button>
          </div>
        )}
        
        {gameState !== 'intro' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock style={{ color: '#00B4D8' }} />
              <div>Time: {time}s</div>
            </div>
            <div style={{ 
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Star style={{ color: '#00B4D8' }} />
              <div>Score: {score}</div>
            </div>
            <div style={{ 
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BarChart2 style={{ color: '#00B4D8' }} />
              <div>Accuracy: {stockAccuracy}%</div>
            </div>
            <div style={{ 
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle style={{ color: alerts.length ? '#FFA500' : '#00B4D8' }} />
              <div>{alerts.length} Alerts</div>
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(inventory).map(([category, data]) => (
            <div
              key={category}
              style={{
                backgroundColor: '#1E2A3B',
                padding: '16px',
                borderRadius: '8px',
                border: data.warning ? '2px solid #FFA500' : '2px solid transparent'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package style={{ color: '#00B4D8' }} />
                  {category}
                </h3>
                <div style={{ color: '#94A3B8' }}>
                  Stock: {data.stock} | Demand: {data.demand}/day
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <button
                  onClick={() => adjustStock(category, -10)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
                  onMouseOut={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                >
                  -10
                </button>
                <button
                  onClick={() => adjustStock(category, -1)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
                  onMouseOut={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                >
                  -1
                </button>
                <div style={{
                  backgroundColor: '#2A3B4D',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  width: '100%',
                  height: '12px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    height: '100%',
                    width: `${(data.stock / 100) * 100}%`,
                    backgroundColor: data.warning ? '#FFA500' : '#00B4D8',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease'
                  }} />
                </div>
                <button
                  onClick={() => adjustStock(category, 1)}
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'}
                  onMouseOut={e => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}
                >
                  +1
                </button>
                <button
                  onClick={() => adjustStock(category, 10)}
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'}
                  onMouseOut={e => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}
                >
                  +10
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {gameState === 'ended' && (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Game Over!</h3>
          <p style={{ color: '#94A3B8', marginBottom: '12px' }}>Final Score: {score}</p>
          <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Stock Accuracy: {stockAccuracy}%</p>
          <button
            onClick={startGame}
            style={{
              backgroundColor: '#00B4D8',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.125rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#0096B4'}
            onMouseOut={e => e.target.style.backgroundColor = '#00B4D8'}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseOptimizer;
