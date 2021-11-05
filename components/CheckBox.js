import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { getFirstLetterCapitalized } from '../src/StringMethods';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilter } from '../store/actions/FilterActions'

const Checkbox = props => {

    const dispatch = useDispatch();



    const switchScaleIos = 0.7;

    const isActive = useSelector(state => {
        return state.filterState[props.header].includes(props.value)
    })

    const toggleSwitch = () => {
        dispatch(updateFilter(props.header, props.value));
    }

    const getSwitchComponent = () => {
        if (Platform.OS === "ios") {
            return (<Switch
                style={{ marginRight: 10, transform: [{ scaleX: switchScaleIos }, { scaleY: switchScaleIos }] }}
                trackColor={{ false: Colors.tertiary, true: Colors.accents }}
                thumbColor={isActive ? Colors.textAndSymbols : Colors.placeholderText}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isActive}
            />);
        }
        else {
            return (<Switch
                style={{ marginRight: 10 }}
                trackColor={{ false: Colors.tertiary, true: Colors.accents }}
                thumbColor={isActive ? Colors.textAndSymbols : Colors.placeholderText}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isActive}
            />);
        }
    };

    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            {getSwitchComponent()}
            <Text style={styles.filterText}>{props.value}</Text>
        </View>
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
    filterText:
    {
        color: Colors.textAndSymbols,
        fontSize: 16
    }, headerText: {
        color: Colors.textAndSymbols,
        fontSize: 23,
        marginBottom: 10
    }
});

export default Checkbox;