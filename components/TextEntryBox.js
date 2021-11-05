import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';


const TextEntryBox = props => {
    const [hasText, setHasText] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [outerViewHeight, setOuterViewHeight] = useState(null);

    const keyboardType = () => {

        if (props.keyboardType !== undefined)
            return props.keyboardType
        else
            return 'default'
    };

    const clearInputFunc = () => {
        setEnteredValue('');
        setHasText(false);
        props.fielSetFunc('', false);
    };

    const onChangeTextFunc = (text) => {
        setEnteredValue(text);
        if (text.length > 0) {
            setHasText(true);
            props.fielSetFunc(text, true);
        }
        else {
            setHasText(false);
            props.fielSetFunc(text, false);
        }
    };

    const getCrossIcon = () => {
        if (!hasText) {
            return (<View></View>);
        }
        else {
            return (
                <TouchableOpacity onPress={clearInputFunc}>
                    <AntDesign name="close" color='black' size={outerViewHeight - 25} style={{ marginRight: 10 }} />
                </TouchableOpacity>
            );
        }
    };

    const getExclamation = () => {
        if (props.valueIsValid) {
            return (<View></View>);
        }
        else {
            return (
                <AntDesign name="exclamationcircleo" color='red' size={outerViewHeight - 25} style={{ marginLeft: 10 }} />
            );
        }

    }

    return (
        <View style={{ ...styles.container, ...props.containerStyle }} onLayout={(event) => {
            setOuterViewHeight(parseInt(event.nativeEvent.layout.height));
        }}>

            <TextInput
                placeholder={props.placeholderText}
                placeholderTextColor={Colors.placeholderText}
                keyboardAppearance='dark'
                onChangeText={onChangeTextFunc}
                keyboardType={keyboardType()}
                value={enteredValue}
                style={{ ...styles.input, fontSize: outerViewHeight - 30, ...styles.inputStyle }} />
            {getCrossIcon()}
            {getExclamation()}

        </View>
    );
}


const styles = StyleSheet.create({
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
    }
});

export default TextEntryBox;