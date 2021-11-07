import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, CheckBox } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import { TouchableOpacity } from 'react-native';
import SeparatorBar from './SeparatorBar';

const DeviceListModal = props => {


    const isModalVisible = props.isModalVisible;
    const setIsModalVisible = props.setIsModalVisible;

    const listOfDevices = props.listOfDevices;
    const callbackFunction = props.callbackFunction;

    return (
        <Modal isVisible={isModalVisible} onBackButtonPress={() => setIsModalVisible(false)} style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }} >
            <View style={styles.modal}>
                <ScrollView style={{ width: '100%', flex: 1, margin: 20, paddingHorizontal: 20 }}>
                    {
                        listOfDevices.map(device => {

                            return (
                                <TouchableOpacity key={device.id} onPress={() => { callbackFunction(device.id) }} style={{ width: '90%', alignItems: 'center' }}>

                                    <Text style={{ ...styles.categoryText, fontSize: 21 }}>  {device.name} </Text>
                                    <SeparatorBar ></SeparatorBar>

                                </TouchableOpacity>
                            );

                        })
                    }

                </ScrollView>

            </View>

            <Button title="Back" titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, marginBottom: 20, width: "100%" }} onPress={() => setIsModalVisible(false)} />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        height: 550,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    container: {
        backgroundColor: Colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '80%',
        height: 50,
        borderRadius: 10,

        borderColor: Colors.tertiary
    },
    input:
    {
        flex: 1,
        height: '100%',
        color: 'white',
        marginHorizontal: 10
    },
    buttonTitle: {
        color: Colors.textAndSymbols
    },
    buttonStyle: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 15
    },
    buttonContainer:
    {
        marginBottom: 25,
        width: "40%"
    },
    categoryText: {
        color: Colors.textAndSymbols,
        fontSize: 18
    }
});

export default DeviceListModal;