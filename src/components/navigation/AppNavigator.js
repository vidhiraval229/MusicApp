import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import SOngLIstScreen from '../../screens/SongListSCreen';
import VoiceInputSettings from '../../services/VoiceInputSettings';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SongList">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SongList" component={SOngLIstScreen} options={{headerShown:false}}/>
        <Stack.Screen name="VoiceInput" component={VoiceInputSettings} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
