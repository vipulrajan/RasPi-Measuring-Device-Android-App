import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';

import TextEntryBox from '../components/TextEntryBox';

import { insertNewCard, getAllCards, deleteCard, getCard } from '../databases/DataStore';
import CardDetails from '../src/CardDetails';
import { useDispatch } from 'react-redux';
import { fetchCards, setCards } from '../store/actions/CardActions'
import Picker from 'react-native-picker-select';
import { showMessage, hideMessage } from "react-native-flash-message";
import Values from '../constants/Values';
import BluetoothSerial, {
    withSubscription
} from "react-native-bluetooth-serial-next";


import 'intl';
import 'intl/locale-data/jsonp/en';

class entryField {
    constructor(value, isSet) {
        this.value = value;
        this.isSet = isSet;
    }

    setValue(value, isSet) {
        this.value = value;
        this.isSet = isSet;
    }
}

const AddNewScreen = props => {


    const [stopReading, setStopReading] = useState(false);
    const [recievedValue, setRecievedValue] = useState(0);

    useEffect(() => {

        BluetoothSerial.read((data, subscription) => {

            setRecievedValue(Number(data.trim()))
            if (stopReading && subscription) {
                BluetoothSerial.removeSubscription(subscription);
            }

        }, "\r\n");

        return () => { setStopReading(true) };
    }, [])


    useEffect(() => {
        props.navigation.setOptions(
            {
                title: 'Add New',
                headerStyle: { backgroundColor: Colors.secondary },
                headerTintColor: Colors.textAndSymbols
            }
        )
    }, []);



    //const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [idIsSubmittable, setIdIsSubmittable] = useState(false);
    const [idIsValid, setIdIsValid] = useState(true);

    const [id, setId] = useState(new entryField('', false));

    const setIdFunc = (value, isSet) => {

        setId(new entryField(value, isSet));
        setIdIsValid(isSet);
        setIdIsSubmittable(isSet);
    }



    const [unit, setUnit] = useState(Values.units.cm)
    const onUnitChange = (value) => {
        setUnit(value)
    }

    const [measuredValues, setMeasuredValues] = useState({});

    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const onSubmit = () => {

        setSubmitButtonText("Saving");
        setIsSubmitButtonDisabled(true);
        const cardi = new CardDetails(id.value, unit, measuredValues);

        getCard(id.value).then(value => {
            if (value === null) {
                insertNewCard(cardi.id, cardi.toJSON()).then(() => {
                    showMessage({
                        message: "Added a new entry",
                        type: "info",
                    });
                    props.navigation.goBack();
                })
            }
            else {
                showMessage({
                    message: "Entry already exists",
                    type: "info",
                });
                setIdIsValid(false);
                setIdIsSubmittable(false);
                setSubmitButtonText("Submit");
                setIsSubmitButtonDisabled(false);
            }
        })



    }




    //const startWidth = 
    const [viewWidth, setViewWidth] = useState(0)
    const [buttonWidth, setButtonWidth] = useState(viewWidth);

    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurementNumber, setMeasurementNumber] = useState(1);

    const onPressFunc = () => {
        if (!isMeasuring) {
            Animated.timing(buttonWidth, { useNativeDriver: false, toValue: 100, timing: 10000 }).start();
            setIsMeasuring(true);
        }
        else {

            setMeasuredValues(value => {
                value[measurementNumber] = recievedValue;
                return value;
            })

            setMeasurementNumber(value => value + 1);
        }
    }

    const getSubmitButton = () => {
        const showSubmitButton = idIsSubmittable;
        if (showSubmitButton)
            if (isSubmitButtonDisabled)
                return (<Button title={submitButtonText} disabled onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
            else
                return (<Button title={submitButtonText} onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
        else
            return (<View></View>);
    }



    const getMeasurementArea = () => {

        return (<View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setViewWidth(width);
            if (!isMeasuring)
                setButtonWidth(new Animated.Value(width));
        }}>
            <Animated.View style={{ backgroundColor: Colors.secondary, flex: 1, borderRadius: 10, marginRight: 10, height: 52, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.textAndSymbols, fontSize: 21 }}>{Number(recievedValue / Values.unitDivisors[unit]).toFixed(3)}</Text>
            </Animated.View>
            <Animated.View style={{ width: buttonWidth }}>
                <Button onPress={onPressFunc} title={"Add"} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
            </Animated.View>
        </View>);
    }

    const getMeasurements = () => {

        return Object.keys(measuredValues).map(key => {
            return (<View key={key} style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between' }}>
                <Text style={styles.categoryText} >
                    {key.toString() + ": " + Number(measuredValues[key] / Values.unitDivisors[unit]).toFixed(3)}
                </Text>
                <Button onPress={() => {
                    setMeasuredValues(value => {
                        var newObj = { ...value };
                        delete newObj[key];
                        return newObj;
                    })
                }} title={"X"} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.buttonStyle, padding: 5 }} containerStyle={{ ...styles.buttonContainer, width: 70 }} />

            </View>);
        })

    }

    return (<ScrollView alwaysBounceVertical='false' style={{ backgroundColor: Colors.primary }}>
        <View style={styles.container} >

            <TextEntryBox placeholderText={"ID"} valueIsValid={idIsValid} fielSetFunc={setIdFunc} containerStyle={styles.inputBox} />
            <Picker
                onValueChange={(value) => onUnitChange(value)}
                useNativeAndroidPickerStyle={false}
                style={customPickerStyles}
                placeholder={{ label: "Unit" }}
                value={unit}
                items={[
                    { label: Values.units.cm, value: Values.units.cm },
                    { label: Values.units.in, value: Values.units.in },
                    { label: Values.units.ft, value: Values.units.ft },
                    { label: Values.units.m, value: Values.units.m }
                ]}
            />

            {getMeasurements()}

            {getMeasurementArea()}

        </View>
        {getSubmitButton()}
    </ScrollView >
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: Colors.primary,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30
    },
    numberText: {
        color: Colors.textAndSymbols,
        fontSize: 23,
        marginBottom: 10
    },
    inputBox: {
        marginBottom: 25
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
        alignSelf: 'flex-end',
        width: '100%'
    },
    categoryText: {
        color: Colors.textAndSymbols,
        fontSize: 21,
        marginBottom: 25
    }
});

const customPickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 23,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 8,
        width: "80%",
        color: Colors.textAndSymbols,
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 25,
        backgroundColor: Colors.secondary,
    },
    inputAndroid: {
        fontSize: 23,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 8,
        color: Colors.textAndSymbols,
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 25,
        backgroundColor: Colors.secondary,
    },
    placeholder: {
        color: Colors.placeholderText,
    }
});

export default withSubscription({ subscriptionName: "events" })(AddNewScreen);