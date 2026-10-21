jest.mock('react-native-bootsplash', () => ({
     __esModule: true,
     default: {
       hide: jest.fn().mockResolvedValue(undefined),
       isVisible: jest.fn().mockResolvedValue(false),
     },
   }));
   
   jest.mock('lucide-react-native', () => ({
     Eye: 'Eye',
     EyeOff: 'EyeOff',
   }));
   
   jest.mock('react-native-safe-area-context', () =>
     require('react-native-safe-area-context/jest/mock').default,
   );