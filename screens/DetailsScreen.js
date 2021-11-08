import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import SearchBar from '../components/SearchBar'
import Card from '../components/Card';
import { getFormattedDate, getAgeString, getCategory } from '../src/DateMethods';
import { insertNewCard, cardExists, updateCard, getAllCards, deleteCard, getCard } from '../databases/DataStore';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch } from 'react-redux';
import { setCards } from '../store/actions/CardActions';
import Values from '../constants/Values';
import Modal from 'react-native-modal';
import Picker from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const DetailsScreen = props => {

  const cardId = props.route.params.cardDetails.id;

  useEffect(() => {
    props.navigation.setOptions(
      {
        title: 'Details',
        headerStyle: { backgroundColor: Colors.secondary },
        headerTintColor: Colors.textAndSymbols
      }
    )
  }, []);

  const [cardDetails, setCardDetails] = useState({});
  const [measuredValues, setMeasuredValues] = useState({});
  const [unit, setUnit] = useState({});

  const fetchAndSetDetails = () => {
    getCard(cardId).then(value => {
      setCardDetails(value);
      setMeasuredValues(value.measurements);
      setUnit(value.unit);
    })
  }
  useEffect(fetchAndSetDetails, []);

  const dispatch = useDispatch();



  const deleteEntryFunc = (id) => {
    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteCard(id).then((status) => {
              if (status) {
                showMessage({
                  message: "Deleted Entry: " + id,
                  type: "info",
                });
                getAllCards().then(cards => {
                  dispatch(setCards(cards));
                  props.navigation.goBack();
                });
              }
              else {
                showMessage({
                  message: "Delete Failed: " + id,
                  type: "info",
                });
              }
            });
          }
        },
        {
          text: "No",
          onPress: () => { }
        }
      ],
      { cancelable: false }
    );

  };




  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const onSubmit = () => {

    var updatedObj = {}
    updatedObj["id"] = cardId;
    updatedObj["unit"] = unit;
    updatedObj["measurements"] = measuredValues;

    updateCard(cardId, updatedObj).then(
      () => {

        setSubmitButtonDisabled(true);

        showMessage({
          message: "Updated entry: " + cardId,
          type: "info",
        });
        fetchAndSetDetails();
        props.navigation.goBack();
      }
    )
  }

  const getSubmitButton = () => {
    if (submitButtonDisabled)
      return <Button title="Submit" disabled disabledStyle={styles.buttonDisabled} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} onPress={onSubmit} />
    else
      return <Button title="Submit" disabledStyle={styles.buttonDisabled} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} onPress={onSubmit} />
  }




  const getMeasurements = () => {

    return Object.keys(measuredValues).map(key => {
      return (<View key={key} style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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


  const onUnitChange = (value) => {
    setUnit(value)
  }





  return (

    <View style={styles.container} >

      <Text style={{ ...styles.numberText, fontSize: 40, paddingBottom: 10 }}>{cardDetails.id}</Text>
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

      <ScrollView style={{ width: '100%' }}>
        {getMeasurements()}
      </ScrollView>


      <Button title={"Delete"} onPress={() => deleteEntryFunc(cardId)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
      {getSubmitButton()}

    </View>

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
    paddingTop: 55,
    paddingRight: 55,
    paddingLeft: 30
  },
  modal: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  numberText: {
    color: Colors.textAndSymbols,
    fontSize: 23,
    marginBottom: 10
  },
  categoryText: {
    color: Colors.placeholderText,
    fontSize: 23,
    marginBottom: 10
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
    width: "40%",
    marginBottom: 10,
    width: "100%"
  },
  buttonDisabled:
  {
    backgroundColor: 'gray'
  }
});

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 23,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 8,
    width: "90%",
    color: Colors.textAndSymbols,
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 25,
    backgroundColor: Colors.secondary,
    alignSelf: 'center'
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
    alignSelf: 'center'
  },
  placeholder: {
    color: Colors.placeholderText,
  }
});
export default DetailsScreen;