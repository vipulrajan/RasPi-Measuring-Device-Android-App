import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import CheckBox from './CheckBox';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { getFirstLetterCapitalized } from '../src/StringMethods';
import { acc } from 'react-native-reanimated';

const CategoryCheckboxes = props => {

    return (
        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={styles.headerText}>{props.header}</Text>
            {
                props.values.map(x => <CheckBox key={x} value={x} header={props.header} />)
            }
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

export default CategoryCheckboxes;