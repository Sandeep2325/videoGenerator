import { theme as baseTheme } from '@chakra-ui/theme'

const customTheme = {
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#cbb2ff',
      200: '#a67fff',
      300: '#804dff',
      400: '#5a1aff',
      500: '#4100e6',
      600: '#3200b4',
      700: '#230082',
      800: '#140051',
      900: '#050021',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
}

export const theme = {
  ...baseTheme,
  ...customTheme,
  components: {
    ...baseTheme.components,
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: 'gray.200',
            _hover: {
              borderColor: 'brand.500',
            },
          },
        },
      },
    },
  },
} 