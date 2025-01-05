const generateMessageId = () => Math.random().toString(36).substring(7);

class TradingViewService {
  constructor() {
    this.socket = null;
    this.session = null;
    this.messageHandlers = new Map();
    this.connected = false;
    this.connectionPromise = null;
  }

  connect() {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = new WebSocket('wss://data.tradingview.com/socket.io/websocket');

      this.socket.onopen = () => {
        this.connected = true;
        this.session = generateMessageId();
        
        // Initialize session
        this.sendMessage('set_auth_token', ['unauthorized_user_token']);
        this.sendMessage('quote_create_session', [this.session]);
        this.sendMessage('quote_set_fields', [this.session, 'lp', 'ch', 'chp', 'description', 'exchange', 'short_name']);
        
        resolve();
      };

      this.socket.onmessage = (event) => {
        const messages = event.data.split(/~m~\d+~m~/);
        messages.forEach(msg => {
          if (msg) {
            try {
              // Handle ping messages
              if (msg.startsWith('~h~')) {
                this.socket.send(`~m~${msg.length}~m~${msg}`);
                return;
              }

              const data = JSON.parse(msg);
              console.log('Received message:', data);

              // Handle different message types
              switch (data.m) {
                case 'qsd':
                  // Quote symbol data
                  const symbol = data.p[1].n;
                  const price = data.p[1].v.lp;
                  const change = data.p[1].v.ch;
                  const changePercent = data.p[1].v.chp;
                  
                  const handler = this.messageHandlers.get(symbol);
                  if (handler) {
                    handler({
                      symbol,
                      price,
                      change,
                      changePercent
                    });
                  }
                  break;
              }
            } catch (e) {
              console.log('Error parsing message:', e, msg);
            }
          }
        });
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
        this.connected = false;
        this.connectionPromise = null;
        this.session = null;
      };
    });

    return this.connectionPromise;
  }

  sendMessage(method, params = []) {
    if (!this.connected) return;
    const message = JSON.stringify({ m: method, p: params });
    this.socket.send(`~m~${message.length}~m~${message}`);
  }

  async subscribeTicker(symbol, callback) {
    await this.connect();

    console.log('Subscribing to:', symbol);
    this.messageHandlers.set(symbol, callback);
    this.sendMessage('quote_add_symbols', [this.session, symbol]);
    this.sendMessage('quote_fast_symbols', [this.session, symbol]);

    return () => {
      console.log('Unsubscribing from:', symbol);
      this.messageHandlers.delete(symbol);
      this.sendMessage('quote_remove_symbols', [this.session, symbol]);
    };
  }

  async subscribeMultipleTickers(symbols, callback) {
    await this.connect();

    console.log('Subscribing to multiple symbols:', symbols);
    
    // Subscribe to all symbols at once
    this.sendMessage('quote_add_symbols', [this.session, ...symbols]);
    this.sendMessage('quote_fast_symbols', [this.session, ...symbols]);

    // Set up handlers for each symbol
    symbols.forEach(symbol => {
      this.messageHandlers.set(symbol, (data) => {
        callback(data);
      });
    });

    return () => {
      console.log('Unsubscribing from multiple symbols');
      symbols.forEach(symbol => {
        this.messageHandlers.delete(symbol);
      });
      this.sendMessage('quote_remove_symbols', [this.session, ...symbols]);
    };
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.close();
    }
  }
}

export const tradingViewService = new TradingViewService();
