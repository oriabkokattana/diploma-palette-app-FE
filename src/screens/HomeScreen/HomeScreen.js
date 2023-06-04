import { Provider } from '@react-native-material/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ColorPickerScreen from '../ColorPickerScreen/ColorPickerScreen';
import SavedPalettesScreen from '../SavedPalettesScreen/SavedPalettesScreen';
import PaletteGenerator from '../PaletteGenerator/PaletteGenerator';
import TrendsScreen from '../TrendsScreen/TrendsScreen';
import ColorAnalysisScreen from '../ColorAnalysisScreen/ColorAnalysisScreen';
import { useCustomTheme } from '../../contexts/themeContext';

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen({ user }) {
  const { theme } = useCustomTheme();

  return (
    <Provider theme={theme}>
      <Tab.Navigator
        initialRouteName='Palettes'
        activeColor={theme.palette.secondary?.main || '#390D7F'}
        inactiveColor={theme.typography.caption?.color}
        barStyle={{ backgroundColor: theme.palette.border?.main }}
        shifting
      >
        <Tab.Screen
          name='Palettes'
          options={{
            tabBarLabel: 'Palettes',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='palette' color={color} size={26} />
            ),
          }}
        >
          {(props) => (
            <SavedPalettesScreen
              {...props}
              userId={user.id}
              userName={user.fullName}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name='Color Picker'
          options={{
            tabBarLabel: 'Color Picker',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='invert-colors'
                color={color}
                size={26}
              />
            ),
          }}
        >
          {(props) => <ColorPickerScreen {...props} userId={user.id} />}
        </Tab.Screen>
        <Tab.Screen
          name='Palette Generator'
          options={{
            tabBarLabel: 'Palette Generator',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='brain' color={color} size={26} />
            ),
          }}
        >
          {(props) => <PaletteGenerator {...props} userId={user.id} />}
        </Tab.Screen>
        <Tab.Screen
          name='Trends'
          options={{
            tabBarLabel: 'Trends',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='trending-up'
                color={color}
                size={26}
              />
            ),
          }}
        >
          {(props) => <TrendsScreen {...props} userId={user.id} />}
        </Tab.Screen>
        <Tab.Screen
          name='Analyze'
          options={{
            tabBarLabel: 'Analyze',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='home-analytics'
                size={26}
                color={color}
              />
            ),
          }}
        >
          {(props) => <ColorAnalysisScreen {...props} userId={user.id} />}
        </Tab.Screen>
      </Tab.Navigator>
    </Provider>
  );
}
