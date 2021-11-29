import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DetailsScreen from '../screens/DetailsScreen';
import SearchScreen from '../screens/MainScreen';
import AddNewScreen from '../screens/AddNewScreen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';



const StackNavigator = createStackNavigator();
const DrawerNavigator = createDrawerNavigator();



function DrawerContents({ navigation }) {

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>Nosey, you are, young padawan</Text>
            <Text style={styles.logoText}>{" "}</Text>
            <Text style={styles.logoText}>The measurer App </Text>
            <Text style={styles.logoText}>{" "}</Text>
            <Text style={styles.logoText}>Copyright no one really, go crazy</Text>

        </View>);
}
/*const mainNavigator = createDrawerNavigator({
    searchScreen: Navigator,
    statsScreen: StatsScreen
}, {
    drawerBackgroundColor: 'transparent',
    contentComponent: drawerContents
});*/


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.drawerBackgroundColor,
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: 55,
        paddingLeft: 20
    },
    logoText: {
        color: Colors.textAndSymbols,
        fontSize: 30
    },
    screenText: {
        color: Colors.textAndSymbols,
        fontSize: 24
    }
})

function Stack() {
    return (
        <StackNavigator.Navigator initialRouteName="Home">
            <StackNavigator.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
            <StackNavigator.Screen name="Details" component={DetailsScreen} />
            <StackNavigator.Screen name="AddNew" component={AddNewScreen} />
        </StackNavigator.Navigator>
    );
}
export default function App() {

    /*{
        Search: { screen: SearchScreen, navigationOptions: { headerShown: false } },
        Details: { screen: DetailsScreen, navigationOptions: { gestureEnabled: true, gestureDirection: 'horizontal' } },
        AddNew: { screen: AddNewScreen, navigationOptions: { gestureEnabled: true, gestureDirection: 'horizontal' } },
        Editing: { screen: EditingScreen, navigationOptions: { gestureEnabled: true, gestureDirection: 'horizontal' } }
    }*/

    return (
        <NavigationContainer>
            <DrawerNavigator.Navigator initialRouteName="Home" screenOptions={{
                drawerStyle: {
                    backgroundColor: 'transparent',
                    width: 240,
                },
            }} drawerContent={(props) => <DrawerContents {...props} />} >
                <DrawerNavigator.Screen name="Home" component={Stack} options={{ headerShown: false }} />
            </DrawerNavigator.Navigator>
        </NavigationContainer >
    );
}