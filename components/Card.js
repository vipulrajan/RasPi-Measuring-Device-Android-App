import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { getFormattedDate, getAgeString, getCategory } from '../src/DateMethods';
import { useDispatch, useSelector } from 'react-redux';

const Card = props => {


    console.log(props.cardDetails);
    const values = Object.values(props.cardDetails.measurements);
    var sum = values.reduce((acc, curr) => acc + curr);
    var max = Math.max(...values);
    var min = Math.min(...values);
    var avg = sum / values.length;

    return (
        <TouchableOpacity onPress={() => { props.navigationProps.navigate({ routeName: 'Details', params: { lambDetails: props.cardDetails, callBackFunction: props.callBackFunction } }); }} style={{ width: '90%', alignItems: 'center' }}>

            <View style={styles.container} >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingLeft: 15 }}>
                        <Text style={styles.numberText}>{props.cardDetails.id}</Text>
                        <Text style={styles.categoryText}>{'sum: '} <Text style={styles.threatText}>{sum}</Text></Text>
                        <Text style={styles.categoryText}>{'avg: '} <Text style={styles.threatText}>{avg}</Text></Text>
                        <Text style={styles.categoryText}>{'max: '} <Text style={styles.threatText}>{max}</Text></Text>
                        <Text style={styles.categoryText}>{'min: '} <Text style={styles.threatText}>{min}</Text></Text>

                    </View>
                </View>
            </View>
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
    numberText: {
        color: Colors.textAndSymbols,
        fontSize: 23,
        marginBottom: 10
    },
    threatText:
    {
        color: Colors.textAndSymbols,
        fontSize: 17
    },
    categoryText: {
        color: 'gray',
        fontSize: 17
    }
});

export default Card;