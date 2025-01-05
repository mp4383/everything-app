import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'purple',
      },
    },
  },
  colors: {
    brand: {
      50: '#f5e9ff',
      100: '#dbc1ff',
      200: '#c199ff',
      300: '#a770ff',
      400: '#8d48ff',
      500: '#742fff',
      600: '#5a24cc',
      700: '#411a99',
      800: '#291066',
      900: '#120633',
    },
  },
});

export default theme;
