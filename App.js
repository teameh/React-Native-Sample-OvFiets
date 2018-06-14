import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListView from './src/ListView';
import { createStackNavigator } from 'react-navigation';
import { COLORS } from './src/consts';
import DetailView from './src/DetailView';

const Stack = createStackNavigator({ ListView, DetailView }, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: COLORS.BLUE,
    },
    headerTintColor: COLORS.YELLOW
  }
});

const App = () => <Stack />;
export default App;
