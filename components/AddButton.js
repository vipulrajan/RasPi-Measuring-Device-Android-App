import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors'
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import BluetoothSerial, {
    withSubscription
} from "react-native-bluetooth-serial-next";
import { showMessage, hideMessage } from "react-native-flash-message";
import DeviceListModal from './DeviceListModal';


const AddButton = props => {

    const [isConnected, setIsConnected] = useState(false);
    const [listOfDevices, setListOfDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

    async function getStatusAndDevices() {
        const [isEnabled, devices] = await Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list()
        ]);

        setListOfDevices(devices);
        setIsBluetoothEnabled(isEnabled);

    }

    useEffect(getStatusAndDevices, []);

    const disconnectBluetooth = () => {

        async function disconnection() {
            await BluetoothSerial.device(connectedDevice).disconnect();
            setIsConnected(false);
            setConnectedDevice(null);
        }

        disconnection();
    }

    const connectToBluetooth = (deviceID) => {

        async function getDevices() {
            try {

                console.log(deviceID);
                getStatusAndDevices()
                if (isBluetoothEnabled) {
                    showMessage({
                        message: "connecting",
                        type: "info",
                    });

                    var connected = false

                    try {
                        await BluetoothSerial.device(deviceID).connect();
                        connected = true;
                    }
                    catch (e) {
                        console.log(e);
                    }


                    if (connected) {

                        showMessage({
                            message: "connected",
                            type: "info",
                        });
                        setIsConnected(true);
                        setConnectedDevice(deviceID);
                    }
                    else {
                        showMessage({
                            message: "couldn't connect",
                            type: "warn",
                        });
                        setIsConnected(false);
                    }
                }
                else {
                    showMessage({
                        message: "Please turn on bluetooth first",
                        type: "warn",
                    });
                }


            } catch (e) {
                Toast.showShortBottom(e.message);
            }
        }

        toggleFilterModal();
        getDevices();

        props.events.on("connectionLost", ({ device }) => {
            if (device) {
                showMessage({
                    message: "connection has been lost",
                    type: "warn",
                });
                setIsConnected(false);
            }
        });
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleFilterModal = () => {
        getStatusAndDevices();
        if (isBluetoothEnabled) {
            setIsModalVisible(!isModalVisible);
        }
        else {
            showMessage({
                message: "Please turn on bluetooth first",
                type: "warn",
            });
        }
    }



    const getBluetoothIcon = () => {
        if (!isConnected) {
            return (
                <TouchableOpacity onPress={toggleFilterModal} style={{ width: '100%', alignItems: 'center' }}>
                    <Ionicons name="md-bluetooth-outline" color='white' size={styles.container.height - 25} />
                </TouchableOpacity>);
        }
        else {
            return (
                <TouchableOpacity onPress={disconnectBluetooth} style={{ width: '100%', alignItems: 'center' }}>
                    <MaterialIcons name="bluetooth-connected" color='white' size={styles.container.height - 25} />
                </TouchableOpacity>);
        }
    };


    return (
        <View style={styles.outerContainer}>
            <View style={{ ...styles.container, marginRight: 25 }}>
                {getBluetoothIcon()}
            </View>

            <View style={styles.container}>
                <TouchableOpacity onPress={() => { props.navigationProps.navigate({ name: 'AddNew' }); }} style={{ width: '100%', alignItems: 'center' }}>
                    <Entypo name="plus" color='white' size={styles.container.height - 10} />
                </TouchableOpacity>
            </View>
            <DeviceListModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} listOfDevices={listOfDevices} callbackFunction={connectToBluetooth} />
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: 30,
        right: 50,
        elevation: 5,
        flexDirection: 'row'
    },
    container: {
        elevation: 5,
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 0.6,
        shadowOffset: { height: 2 },
        height: 60,
        width: 60,
        backgroundColor: Colors.accents,
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default withSubscription({ subscriptionName: "events" })(AddButton);