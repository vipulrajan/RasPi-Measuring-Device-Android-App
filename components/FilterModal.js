import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, CheckBox } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import CategoryCheckboxes from './CategoryCheckboxes';
import Values from '../constants/Values';
import initialState from '../constants/InitialFilterState';
import { getAllLambs } from '../databases/DataStore';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../src/DateMethods'
import { setFilters } from '../store/actions/FilterActions'


const FilterModal = props => {

    const dispatch = useDispatch();
    const isModalVisible = props.isModalVisible;
    const setIsModalVisible = props.setIsModalVisible;

    const onClear = () => {
        console.log("Called");
        dispatch(setFilters(initialState()));
    };


    const allLambs = useSelector(state => state.cardsScroll.cardsOnScroll.map(x => {
        return { ...x, category: getCategory(new Date(x.dateOfLambing)) }
    }))
    //const filterState = useSelector(state => state.filterState)



    const headersAndValues = () => {
        return Values.filterProperties.map(filterProperty => {
            const distinctValues = new Set(allLambs.map(lamb => lamb[filterProperty]))

            return { header: filterProperty, values: [...distinctValues] }
        })
    }




    return (
        <Modal isVisible={isModalVisible} onBackButtonPress={() => setIsModalVisible(false)} style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }} >
            <View style={styles.modal}>
                <ScrollView style={{ width: '100%', flex: 1, margin: 20, paddingHorizontal: 20 }}>
                    {
                        headersAndValues().map(headerAndValues => {
                            return (<CategoryCheckboxes key={headerAndValues.header} header={headerAndValues.header} values={headerAndValues.values} />);
                        })
                    }
                </ScrollView>

            </View>
            <Button title="Clear Filters" disabledStyle={styles.buttonDisabled} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, marginBottom: 10, width: "100%", marginTop: 20 }} onPress={onClear} />
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
    }
});

export default FilterModal;