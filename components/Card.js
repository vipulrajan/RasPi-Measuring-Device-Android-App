import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { getFormattedDate, getAgeString, getCategory } from '../src/DateMethods';
import { useDispatch, useSelector } from 'react-redux';

const Card = props => {

    const age = getAgeString(new Date(props.cardDetails.dateOfLambing));
    const category = getCategory(new Date(props.cardDetails.dateOfLambing));

    return (
        <TouchableOpacity onPress={() => { props.navigationProps.navigate({ routeName: 'Details', params: { lambDetails: props.cardDetails, callBackFunction: props.callBackFunction } }); }} style={{ width: '90%', alignItems: 'center' }}>

            <View style={styles.container} >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingLeft: 15 }}>
                        <Text style={styles.numberText}>{props.cardDetails.id}</Text>
                        <Text style={styles.categoryText}>{'sex: '} <Text style={styles.threatText}>{props.cardDetails.sex}</Text></Text>
                        <Text style={styles.categoryText}>{'category: '} <Text style={styles.threatText}>{category}</Text></Text>
                        <Text style={styles.categoryText}>{'age: '} <Text style={styles.threatText}>{age}</Text></Text>

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