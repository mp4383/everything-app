import { useEffect, useRef, memo } from 'react';
import { Box } from '@mui/material';

function TradingViewWidget({ symbol = "BINANCE:BTCUSDT" }) {
  const container = useRef();
  const chartRef = useRef(null);

  useEffect(() => {
    const loadChart = () => {
      if (window.TradingView) {
        // Clean up previous chart if it exists
        if (chartRef.current) {
          container.current.innerHTML = '';
          chartRef.current = null;
        }

        // Create chart container
        const div = document.createElement('div');
        div.id = 'tradingview_chart';
        div.style.width = '100%';
        div.style.height = '100%';
        container.current.appendChild(div);

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
      }
    };

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = loadChart;
      container.current.appendChild(script);
    } else {
      loadChart();
    }

    return () => {
      if (chartRef.current) {
        container.current.innerHTML = '';
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
