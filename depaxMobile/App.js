import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import Home from './screen/Home';
import Password from './screen/Password';
import Price from './screen/Price';
import Availability from './screen/Availability';
import Reduxscreen from './screen/Reduxscreen';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './redux/store/store';
import Form from './screen/Form';
import Otp from './screen/Otp';
const App = () => {
const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName={'Form'}>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
          <Stack.Screen name="Form" component={Form} options={{ headerShown: false }} />
          <Stack.Screen name="Password" component={Password} options={{ headerShown: false }} />
          <Stack.Screen name="Price" component={Price} options={{ headerShown: false }} />
          <Stack.Screen name="Availability" component={Availability} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider >
  )
};

export default App;
