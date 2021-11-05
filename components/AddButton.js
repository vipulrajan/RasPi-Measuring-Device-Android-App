import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors'
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';


const AddButton = props => {


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { props.navigationProps.navigate({ routeName: 'AddNew', params: { callBackFunction: props.callBackFunction } }); }} style={{ width: '100%', alignItems: 'center' }}>


                <Entypo name="plus" color='white' size={styles.container.height - 10} />


            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 0.6,
        shadowOffset: { height: 2 },
        bottom: 30,
        right: 50,
        elevation: 5,
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

export default AddButton;