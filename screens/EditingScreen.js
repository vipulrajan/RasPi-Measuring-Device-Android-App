import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import SearchBar from '../components/SearchBar'
import Card from '../components/Card';
import TextEntryBox from '../components/TextEntryBox';
import colors from '../constants/colors';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { insertNewLamb, getAllLambs, deleteLamb, getLamb, updateLamb } from '../databases/DataStore';
import CardDetails from '../src/CardDetails';
import { useDispatch } from 'react-redux';
import { fetchCards, setCards } from '../store/actions/CardActions'
import Picker from 'react-native-picker-select';
import { showMessage, hideMessage } from "react-native-flash-message";

import 'intl';
import 'intl/locale-data/jsonp/en';

import { getFormattedDate } from '../src/DateMethods'
import Values from '../constants/Values';

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

const EditingScreen = props => {


    const lambDetails = props.navigation.getParam('lambDetails');

    const callBackFunction = props.navigation.getParam('callBackFunction');

    const dispatch = useDispatch();
    //const [showSubmitButton, setShowSubmitButton] = useState(false);


    const [dameIDIsSubmittable, setDameIDIsSubmittable] = useState(false);
    const [dameID, setDameId] = useState(new entryField(lambDetails.dameId, false));
    const setDameIdFunc = (value, isSet) => {
        setDameId(new entryField(value, isSet));

        setDameIDIsSubmittable(isSet);
    }

    const [sireIDIsSubmittable, setSireIDIsSubmittable] = useState(false);
    const [sireID, setSireId] = useState(new entryField(lambDetails.sireId, false));


    const setSireIdFunc = (value, isSet) => {
        setSireId(new entryField(value, isSet));

        setSireIDIsSubmittable(isSet);
    }

    const [remarksIsSubmittable, setRemarksIsSubmittable] = useState(false);
    const [remarks, setRemarks] = useState(new entryField(lambDetails.remarks, false));

    const setRemarksFunc = (value, isSet) => {
        setRemarks(new entryField(value, isSet));

        setRemarksIsSubmittable(true);
    }

    const [birthWeightIsSubmittable, setBirthWeightIsSubmittable] = useState(false);
    const [birthWeight, setBirthWeight] = useState(new entryField(lambDetails.birthWeight, false));

    const setBirthWeightFunc = (value, isSet) => {
        const intValue = Number(value);
        if (isNaN(intValue)) {
            setBirthWeight(new entryField(intValue, false));

            setBirthWeightIsSubmittable(false);
        }
        else {
            setBirthWeight(new entryField(intValue, isSet));

            setBirthWeightIsSubmittable(isSet);
        }
    }


    const [sex, setSex] = useState(new entryField(lambDetails.sex, false));
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
    const [lambingDate, setLambingDate] = useState(lambDetails.dateOfLambing);

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
    const [matingDate, setMatingDate] = useState(lambDetails.dateOfMating);

    const showMatingDatePicker = () => {
        setMatingDatePickerVisibility(true);
    };

    const hideMatingDatePicker = () => {
        setMatingDatePickerVisibility(false);
    };

    const [isLambingDateSubmittable, setIsLambingDateSubmittable] = useState(false);
    const [isMatingDateSubmittable, setIsMatingDateSubmittable] = useState(false);

    const handleMatingConfirm = (date) => {
        setMatingDate(date);
        hideMatingDatePicker();
        setIsMatingDateSubmittable(true);
    };

    const handleLambingConfirm = (date) => {
        hideLambingDatePicker();
        setLambingDate(date);
        setMatingDate(getRandomMatingDate(date));
        setIsLambingDateSubmittable(true);
    };




    const onSubmit = () => {

        setSubmitButtonText("Saving");
        setIsSubmitButtonDisabled(true);
        const cardi = new CardDetails(lambDetails.id, dameID.value, sireID.value, lambingDate, matingDate, sex.value, birthWeight.value, remarks.value);

        updateLamb(cardi.id, {
            dameId: cardi.dameId,
            sireId: cardi.sireId,
            dateOfLambing: cardi.dateOfLambing,
            dateOfMating: cardi.dateOfMating,
            sex: cardi.sex,
            birthWeight: cardi.birthWeight,
            remarks: cardi.remarks
        }).then(() => {
            showMessage({
                message: "Updated entry: " + lambDetails.id,
                type: "info",
            });
            callBackFunction();
            props.navigation.goBack();
        })

    }


    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const getSubmitButton = () => {
        const showSubmitButton = dameIDIsSubmittable || sireIDIsSubmittable || remarksIsSubmittable || birthWeightIsSubmittable || sexIsSubmittable || isLambingDateSubmittable || isMatingDateSubmittable;
        if (showSubmitButton)
            if (isSubmitButtonDisabled)
                return (<Button title={submitButtonText} disabled onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
            else
                return (<Button title={submitButtonText} onPress={onSubmit} containerStyle={{ alignSelf: 'center' }} buttonStyle={{ backgroundColor: Colors.tertiary }} />);
        else
            return (<View></View>);
    }

    return (
        <View style={styles.container} >
            <Text style={{ ...styles.numberText, fontSize: 40, paddingBottom: 30 }}>{lambDetails.id}</Text>
            <TextEntryBox placeholderText={"Dame ID: " + lambDetails.dameId} valueIsValid={true} fielSetFunc={setDameIdFunc} containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Sire ID: " + lambDetails.sireId} valueIsValid={true} fielSetFunc={setSireIdFunc} containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Birthweight: " + lambDetails.birthWeight} valueIsValid={true} fielSetFunc={setBirthWeightFunc} keyboardType='numeric' containerStyle={styles.inputBox} />
            <TextEntryBox placeholderText={"Remarks: " + lambDetails.remarks} valueIsValid={true} fielSetFunc={setRemarksFunc} containerStyle={styles.inputBox} />
            <Picker
                onValueChange={(value) => setSexFunc(value)}
                useNativeAndroidPickerStyle={false}
                style={customPickerStyles}
                placeholder={{ label: "Sex: " + lambDetails.sex, value: lambDetails.sex }}
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
            {getSubmitButton()}
        </View>
    );
}

EditingScreen.navigationOptions = {
    headerTitle: 'Edit',
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

export default EditingScreen;