import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import SearchBar from '../components/SearchBar'
import Card from '../components/Card';
import TextEntryBox from '../components/TextEntryBox';
import colors from '../constants/colors';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { insertNewLamb, getAllLambs, deleteLamb, getLamb } from '../databases/DataStore';
import CardDetails from '../src/CardDetails';
import { useDispatch } from 'react-redux';
import { fetchCards, setCards } from '../store/actions/CardActions'
import Picker from 'react-native-picker-select';
import { showMessage, hideMessage } from "react-native-flash-message";
import Values from '../constants/Values';

import 'intl';
import 'intl/locale-data/jsonp/en';

import { getFormattedDate } from '../src/DateMethods'

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

    const dispatch = useDispatch();


    useEffect(() => {
        const callBackFunction = props.navigation.getParam('callBackFunction');
        if (callBackFunction !== undefined)
            return callBackFunction;
    }, [])
    //const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [idIsSubmittable, setIdIsSubmittable] = useState(false);
    const [idIsValid, setIdIsValid] = useState(true);

    const [id, setId] = useState(new entryField('', false));

    const setIdFunc = (value, isSet) => {

        setId(new entryField(value, isSet));
        setIdIsValid(isSet);
        setIdIsSubmittable(isSet);
    }

    const [dameIDIsSubmittable, setDameIDIsSubmittable] = useState(false);
    const [dameIDIsValid, setDameIDIsValid] = useState(true);

    const [dameID, setDameId] = useState(new entryField('', false));
    const setDameIdFunc = (value, isSet) => {
        setDameId(new entryField(value, isSet));
        setDameIDIsValid(isSet);
        setDameIDIsSubmittable(isSet);
    }

    const [sireIDIsSubmittable, setSireIDIsSubmittable] = useState(false);
    const [sireIDIsValid, setSireIDIsValid] = useState(true);
    const [sireID, setSireId] = useState(new entryField('', false));


    const setSireIdFunc = (value, isSet) => {
        setSireId(new entryField(value, isSet));
        setSireIDIsValid(isSet);
        setSireIDIsSubmittable(isSet);
    }

    const [remarksIsSubmittable, setRemarksIsSubmittable] = useState(true);
    const [remarksIsValid, setRemarksIDIsValid] = useState(true);
    const [remarks, setRemarks] = useState(new entryField('', false));

    const setRemarksFunc = (value, isSet) => {
        setRemarks(new entryField(value, isSet));
        setRemarksIDIsValid(true);
        setRemarksIsSubmittable(true);
    }

    const [birthWeightIsSubmittable, setBirthWeightIsSubmittable] = useState(false);
    const [birthWeightIsValid, setBirthWeightIDIsValid] = useState(true);
    const [birthWeight, setBirthWeight] = useState(new entryField(-1, false));

    const setBirthWeightFunc = (value, isSet) => {
        const intValue = Number(value);
        if (isNaN(intValue)) {
            setBirthWeight(new entryField(intValue, false));
            setBirthWeightIDIsValid(false);
            setBirthWeightIsSubmittable(false);
        }
        else {
            setBirthWeight(new entryField(intValue, isSet));
            setBirthWeightIDIsValid(isSet);
            setBirthWeightIsSubmittable(isSet);
        }
    }


    const [sex, setSex] = useState(new entryField(null, false));
    const [sexIsSubmittable, setSexIsSubmittable] = useState(false);

    const setSexFunc = (value) => {

        if (value === null) {
            setSex(new entryField(null, false));
            setSexIsSubmittable(false);
        }
        else {
            setSex(new entryField(value, true));
            setSexIsSubmittable(true);
        }
    }

    const [isLambingDatePickerVisible, setLambingDatePickerVisibility] = useState(false);
    const [lambingDate, setLambingDate] = useState(new Date(new Date().toDateString()));

    const getRandomMatingDate = (date) => {
        const retDate = new Date(new Date(date).setDate(date.getDate() - (Math.random() * 5 + 148)));
        return retDate;
    }



    const showLambingDatePicker = () => {
        setLambingDatePickerVisibility(true);
    };

    const hideLambingDatePicker = () => {
        setLambingDatePickerVisibility(false);
    };






    const [isMatingDatePickerVisible, setMatingDatePickerVisibility] = useState(false);
    const [matingDate, setMatingDate] = useState(getRandomMatingDate(new Date()));

    const showMatingDatePicker = () => {
        setMatingDatePickerVisibility(true);
    };

    const hideMatingDatePicker = () => {
        setMatingDatePickerVisibility(false);
    };

    const handleMatingConfirm = (date) => {
        setMatingDate(date);
        hideMatingDatePicker();
    };

    const handleLambingConfirm = (date) => {
        hideLambingDatePicker();
        setLambingDate(date);
        setMatingDate(getRandomMatingDate(date));
    };


    const onSubmit = () => {

        setSubmitButtonText("Saving");
        setIsSubmitButtonDisabled(true);
        const cardi = new CardDetails(id.value, dameID.value, sireID.value, lambingDate, matingDate, sex.value, birthWeight.value, remarks.value, Values.status.ACTIVE, null);

        getLamb(id.value).then(value => {
            if (value === null) {
                insertNewLamb(cardi.id, cardi.toJSON()).then(() => {
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


    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const getSubmitButton = () => {
        const showSubmitButton = idIsSubmittable && dameIDIsSubmittable && sireIDIsSubmittable && remarksIsSubmittable && birthWeightIsSubmittable && sexIsSubmittable;
        if (showSubmitButton)
            if (isSubmitButtonDisabled)
                return (<Button title={submitButtonText} disabled onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
            else
                return (<Button title={submitButtonText} onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
        else
            return (<View></View>);
    }

    return (<ScrollView alwaysBounceVertical='false' style={{ backgroundColor: Colors.primary }}>
        <View style={styles.container} >

            <TextEntryBox placeholderText={"ID"} valueIsValid={idIsValid} fielSetFunc={setIdFunc} containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Dame ID"} valueIsValid={dameIDIsValid} fielSetFunc={setDameIdFunc} containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Sire ID"} valueIsValid={sireIDIsValid} fielSetFunc={setSireIdFunc} containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Birthweight In Grams"} valueIsValid={birthWeightIsValid} fielSetFunc={setBirthWeightFunc} keyboardType='numeric' containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Remarks"} valueIsValid={remarksIsValid} fielSetFunc={setRemarksFunc} containerStyle={styles.inputBox} />
            <Picker
                onValueChange={(value) => setSexFunc(value)}
                useNativeAndroidPickerStyle={false}
                style={customPickerStyles}
                placeholder={{ label: "Sex", value: null }}
                items={[
                    { label: Values.sex.MALE, value: Values.sex.MALE },
                    { label: Values.sex.FEMALE, value: Values.sex.FEMALE }
                ]}
            />
            <Button onPress={showLambingDatePicker} title={"Date of Birth: " + getFormattedDate(lambingDate)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
            <Button onPress={showMatingDatePicker} title={"Date of Mating: " + getFormattedDate(matingDate)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />

            <DateTimePickerModal
                isVisible={isLambingDatePickerVisible}
                mode="date"
                date={lambingDate}
                onConfirm={handleLambingConfirm}
                onCancel={hideLambingDatePicker}
            />
            <DateTimePickerModal
                isVisible={isMatingDatePickerVisible}
                mode="date"
                date={matingDate}
                maximumDate={lambingDate}
                onConfirm={handleMatingConfirm}
                onCancel={hideMatingDatePicker}
            />

        </View>
        {getSubmitButton()}
    </ScrollView>
    );
}

AddNewScreen.navigationOptions = {
    headerTitle: 'Add New',
    headerStyle: { backgroundColor: Colors.secondary },
    headerTintColor: Colors.textAndSymbols
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: Colors.primary,
        paddingTop: 30,
        paddingLeft: 30
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

export default AddNewScreen;