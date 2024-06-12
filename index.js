import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import HomeScreen from './src/screens/HomeScreen';
import SongListScreen from './src/screens/SongListSCreen';

console.log('Registering the App component with AppRegistry'); // Add this line
AppRegistry.registerComponent(appName, () => App);
