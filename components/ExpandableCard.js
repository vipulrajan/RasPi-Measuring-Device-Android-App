import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { getFormattedDate, getAgeString, getCategory } from '../src/DateMethods';
import { useDispatch, useSelector } from 'react-redux';
import SeparatorBar from './SeparatorBar';

const ExpandableCard = props => {

    const [cardHeight] = useState(new Animated.Value(props.minHeight));

    useEffect(() => {
        Animated.timing(cardHeight, { useNativeDriver: false, toValue: props.minHeight, timing: 10000 }).start()
    }, [props.minHeight, props.maxHeight]);


    const onPressFunc = () => {

        if (cardHeight._value !== props.minHeight)
            Animated.timing(cardHeight, { useNativeDriver: false, toValue: props.minHeight, timing: 10000 }).start();
        else
            Animated.timing(cardHeight, { useNativeDriver: false, toValue: props.maxHeight, timing: 10000 }).start();

    }


    return (
        <TouchableOpacity onPress={onPressFunc} style={{ width: '90%', alignItems: 'center' }}>

            <Animated.View style={[styles.card, { height: cardHeight, overflow: 'hidden' }]}>
                <Text style={{ ...styles.categoryText, fontSize: 21 }}>{props.header.text + ": "}<Text style={styles.numberText}>{props.header.count}</Text></Text>

                <SeparatorBar ></SeparatorBar>

                {
                    props.subHeadings.map(value => {
                        if (value.text === 'sep')
                            return <SeparatorBar key={value.text + value.count} style={{ width: '70%' }} ></SeparatorBar>
                        else
                            return <Text key={value.text + value.count} style={styles.categoryText}>{value.text + ": "}<Text style={styles.numberText}>{value.count}</Text></Text>
                    })
                }


            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 140,
        borderRadius: 15,
        borderColor: Colors.tertiary,
        padding: 10,
        marginBottom: 10
    },
    card: {
        width: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        paddingLeft: 20,
        paddingTop: 15,
        marginBottom: 15
    },
    numberText:
    {
        color: Colors.textAndSymbols
    },
    categoryText: {
        color: 'gray',
        fontSize: 18
    }
});

export default ExpandableCard;