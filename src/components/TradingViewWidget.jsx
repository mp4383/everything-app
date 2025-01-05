import { useEffect, useRef, memo } from 'react';
import { Box } from '@mui/material';

function TradingViewWidget({ symbol = "BINANCE:BTCUSDT" }) {
  const container = useRef();
  const chartRef = useRef(null);

  useEffect(() => {
    let script = null;
    let chartContainer = null;

    const loadChart = () => {
      if (!container.current || !window.TradingView) return;

      // Clean up previous chart
      if (container.current.firstChild) {
        container.current.innerHTML = '';
      }

      // Create chart container
      chartContainer = document.createElement('div');
      chartContainer.id = 'tradingview_chart';
      chartContainer.style.width = '100%';
      chartContainer.style.height = '100%';
      container.current.appendChild(chartContainer);

      // Create new chart
      chartRef.current = new window.TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart"
      });
    };

    const initializeChart = () => {
      if (!window.TradingView) {
        script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = loadChart;
        document.body.appendChild(script);
      } else {
        loadChart();
      }
    };

    initializeChart();

    return () => {
      // Clean up
      if (container.current) {
        container.current.innerHTML = '';
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (chartRef.current) {
        chartRef.current = null;
      }
    };
  }, [symbol]);

  return (
    <Box 
      ref={container} 
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}

export default memo(TradingViewWidget);
