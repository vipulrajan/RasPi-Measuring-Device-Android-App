import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Colors from '../constants/colors';
import Values from '../constants/Values';


const Card = props => {


    var sum = 0
    var max = 0
    var min = 0
    var avg = 0

    if (props.cardDetails.measurements === undefined) {
        sum = 0;
        max = 0;
        min = 0;
        avg = 0;

    }
    else {
        const values = Object.values(props.cardDetails.measurements);

        if (values.length > 0) {
            sum = Number(values.reduce((acc, curr) => acc + curr) / Values.unitDivisors[props.cardDetails.unit]).toFixed(3);
            max = Number(Math.max(...values) / Values.unitDivisors[props.cardDetails.unit]).toFixed(3);
            min = Number(Math.min(...values) / Values.unitDivisors[props.cardDetails.unit]).toFixed(3);
            avg = Number(sum / values.length).toFixed(3);
        }
    }

    return (
        <TouchableOpacity onPress={() => { props.navigationProps.navigate({ name: 'Details', params: { cardDetails: props.cardDetails } }); }} style={{ width: '90%', alignItems: 'center' }}>

            <View style={styles.container} >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingLeft: 15 }}>
                        <Text style={styles.numberText}>{props.cardDetails.id}</Text>
                        <Text style={styles.categoryText}>{'sum: '} <Text style={styles.threatText}>{sum.toString() + props.cardDetails.unit}</Text></Text>
                        <Text style={styles.categoryText}>{'avg: '} <Text style={styles.threatText}>{avg.toString() + props.cardDetails.unit}</Text></Text>
                        <Text style={styles.categoryText}>{'max: '} <Text style={styles.threatText}>{max.toString() + props.cardDetails.unit}</Text></Text>
                        <Text style={styles.categoryText}>{'min: '} <Text style={styles.threatText}>{min.toString() + props.cardDetails.unit}</Text></Text>

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
        height: 150,
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