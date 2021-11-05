import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import Colors from './constants/colors';
import SearchScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { createDrawerNavigator } from '@react-navigation/drawer';


import { createStore, combineReducers } from 'redux';
import CardsOnScrollReducer from './store/reducers/CardsOnScrollReducer'
import { Provider } from 'react-redux';


import Navigator from './navigation/Navigator';
import FlashMessage from "react-native-flash-message";
import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import { cos } from 'react-native-reanimated';
import FilterReducer from './store/reducers/FilterReducer'


const rootReducer = combineReducers({ cardsScroll: CardsOnScrollReducer, filterState: FilterReducer });

const store = createStore(rootReducer);

const fetchFonts = () => {
  return Font.loadAsync({
    'primary': require('./assets/fonts/MYRIADPRO-REGULAR.ttf'),
    'primary-bold': require('./assets/fonts/MYRIADPRO-BOLD.ttf')
  }
  );
};

const orientationLock = async () => {
  const deviceType = await Device.getDeviceTypeAsync();
  const deviceModel = Device.modelId;
  const osName = Device.osName;
  if (deviceType === Device.DeviceType.TABLET || (deviceModel !== null && deviceModel.includes("iPad")))
    await ScreenOrientation.unlockAsync();
  else {
    if (osName === "Android")
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    else
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
}



export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);
  const [orientationFetched, setOrientationFetched] = useState(false);

  if (!fontLoaded || !orientationFetched) {
    return (
      <View style={{ backgroundColor: Colors.primary }}>
        <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} onError={console.warn} />
        <AppLoading startAsync={orientationLock} onFinish={() => {
          setOrientationFetched(true);

        }} onError={console.warn} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <Navigator options={configs.navigatorOptions.gestureDirection} />
        <FlashMessage position="bottom" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const configs =
{
  navigatorOptions:
  {
    gestureDirection: 'vertical'
  }
}
