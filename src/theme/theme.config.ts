import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gradient: {
      start: '#0ea5e9',
      end: '#7c3aed',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
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
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, gradient.start, gradient.end)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, gradient.end, gradient.start)',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: 'container.xl',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'xl',
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 2px brand.100',
          },
        },
      },
    },
  },
})

export default theme 