import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import FilterModal from './FilterModal';

const SearchBar = props => {

    const [outerViewHeight, setOuterViewHeight] = useState(null);

    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');

    const setSearchAndEnteredValue = (value) => {
        setEnteredValue(value);
        props.setSearchText(value);
    }

    const setSearchAndEnteredValueHasText = (bool) => {
        setHasText(bool);
        props.setSearchHasText(bool);
    }
    const clearInputFunc = () => { setSearchAndEnteredValue(''); setSearchAndEnteredValueHasText(false); };
    const backFunc = () => { setIsFocused(false); Keyboard.dismiss(); };

    const onFocusFunc = () => {
        props.onFocus();
        setIsFocused(true);
    };

    const onEndEditingFunc = () => {
        props.onEndEditing();
        setIsFocused(false);
    };

    const onChangeTextFunc = (text) => {
        setSearchAndEnteredValue(text);
        if (text.length > 0)
            setSearchAndEnteredValueHasText(true);
        else
            setSearchAndEnteredValueHasText(false);
    };

    const getLeftIcons = () => {
        if (!isFocused) {
            return (
                <TouchableOpacity onPress={() => props.navigationProps.toggleDrawer()}>
                    <FontAwesome name="bars" color='black' size={outerViewHeight - 20} />
                </TouchableOpacity>);
        }
        else {
            return (
                <TouchableOpacity onPress={backFunc}>
                    <AntDesign name="arrowleft" color='black' size={outerViewHeight - 25} />
                </TouchableOpacity>);
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

    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleFilterModal = () => {
        setIsModalVisible(!isModalVisible);
    }


    return (
        <Animated.View style={{ ...styles.container, ...props.containerStyle }} onLayout={(event) => {
            setOuterViewHeight(parseInt(event.nativeEvent.layout.height));
        }} >

            {getLeftIcons()}

            <TextInput
                placeholder={props.placeholderText}
                placeholderTextColor={Colors.placeholderText}
                keyboardAppearance='dark'
                onFocus={onFocusFunc}
                onEndEditing={onEndEditingFunc}
                onChangeText={onChangeTextFunc}
                value={enteredValue}
                style={{ ...styles.input, fontSize: outerViewHeight - 30, ...styles.inputStyle }} />
            {getCrossIcon()}
            <TouchableOpacity>
                <Ionicons name="filter" color='black' size={outerViewHeight - 20} onPress={toggleFilterModal} />
            </TouchableOpacity>

            <FilterModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </Animated.View>
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

export default SearchBar;