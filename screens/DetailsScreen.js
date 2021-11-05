import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import SearchBar from '../components/SearchBar'
import Card from '../components/Card';
import { getFormattedDate, getAgeString, getCategory } from '../src/DateMethods';
import { insertNewLamb, lambExists, updateLamb, getAllLambs, deleteLamb, getLamb } from '../databases/DataStore';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch } from 'react-redux';
import { setCards } from '../store/actions/CardActions';
import Values from '../constants/Values';
import Modal from 'react-native-modal';
import Picker from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const DetailsScreen = props => {

  const lambId = props.navigation.getParam('lambDetails').id;
  const callBackFunction = props.navigation.getParam('callBackFunction');

  useEffect(() => {
    if (callBackFunction !== undefined)
      return callBackFunction;
  }, [])
  const [lambDetails, setLambDetails] = useState({});

  const fetchAndSetDetails = () => {
    getLamb(lambId).then(value => {
      const lambingDate = getFormattedDate(new Date(value.dateOfLambing));
      const matingDate = getFormattedDate(new Date(value.dateOfMating));
      const age = getAgeString(new Date(value.dateOfLambing));
      const category = getCategory(new Date(value.dateOfLambing));
      const status = value.status;

      if (status == Values.status.ACTIVE)
        setLambDetails({
          ...value,
          dateOfLambing: lambingDate,
          dateOfMating: matingDate,
          age: age,
          category: category,
          status: status
        });
      else {
        const disposalDate = getFormattedDate(new Date(value.dateOfDisposal));
        setLambDetails({
          ...value,
          dateOfLambing: lambingDate,
          dateOfMating: matingDate,
          age: getAgeString(new Date(value.dateOfLambing), new Date(value.dateOfDisposal)),
          category: getCategory(new Date(value.dateOfLambing), new Date(value.dateOfDisposal)),
          status: status,
          dateOfDisposal: disposalDate
        });
      }
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
            deleteLamb(id).then((status) => {
              if (status) {
                showMessage({
                  message: "Deleted Entry: " + id,
                  type: "info",
                });
                getAllLambs().then(cards => {
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

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const thirdButtonFunction = (status) => {

    if (status === Values.status.ACTIVE)
      toggleModal();
    else {
      updateLamb(lambId, { status: Values.status.ACTIVE, dateOfDisposal: null }).then(() => {
        showMessage({
          message: "Reactivity entry: " + lambId,
          type: "info",
        });
        fetchAndSetDetails();
      })
    }

  }


  const [isDisposalDatePickerVisible, setDisposalDatePickerVisibility] = useState(false);
  const [disposalDate, setDisposalDate] = useState(new Date(new Date().toDateString()));

  const showDisposalDatePicker = () => {
    setDisposalDatePickerVisibility(true);
  };

  const hideDisposalDatePicker = () => {
    setDisposalDatePickerVisibility(false);
  };

  const handleDisposalConfirm = (date) => {
    setDisposalDate(date);
    hideDisposalDatePicker();
  };



  const getStatusDetails = (status) => {
    if (status !== Values.status.ACTIVE)
      return (
        <View>
          <Text style={styles.categoryText}>{'Status: '} <Text style={styles.numberText}>{lambDetails.status}</Text></Text>
          <Text style={styles.categoryText}>{'Date of Disposal: '} <Text style={styles.numberText}>{lambDetails.dateOfDisposal}</Text></Text>
        </View>
      );
  }

  const getThirdButtonText = (status) => {

    if (status !== Values.status.ACTIVE)
      return "Reactivate";
    else
      return "Disposal"
  }
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const onSubmit = () => {
    updateLamb(lambId, { status: modalStatus, dateOfDisposal: disposalDate }).then(
      () => {
        setModalStatus(null);
        setSubmitButtonDisabled(true);
        setDisposalDate(new Date());
        showMessage({
          message: "Updated entry: " + lambId,
          type: "info",
        });
        fetchAndSetDetails();
        setModalVisible(false);
      }
    )
  }

  const getSubmitButton = () => {
    if (submitButtonDisabled)
      return <Button title="Submit" disabled disabledStyle={styles.buttonDisabled} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, marginBottom: 10, width: "100%", marginTop: 20 }} onPress={onSubmit} />
    else
      return <Button title="Submit" disabledStyle={styles.buttonDisabled} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, marginBottom: 10, width: "100%", marginTop: 20 }} onPress={onSubmit} />
  }

  const [modalStatus, setModalStatus] = useState(lambDetails.status);

  const onModalStatusValueChange = (value) => {
    setModalStatus(value);
    if (value !== null)
      setSubmitButtonDisabled(false)
    else
      setSubmitButtonDisabled(true)
  }

  const navigateToEditingFunction = () => {

    getLamb(lambId).then(value => {
      props.navigation.navigate({
        routeName: 'Editing', params: {
          callBackFunction: fetchAndSetDetails,
          lambDetails: {
            ...value,
            dateOfLambing: new Date(value.dateOfLambing),
            dateOfMating: new Date(value.dateOfMating)
          }
        }
      });
    }
    )

  }

  const onIdPress = (id) => {
    lambExists(id).then(bool => {
      if (bool)
        props.navigation.push('Details', { lambDetails: { id: id } });

      else
        showMessage({
          message: "No entry exists for id: " + id,
          type: "warn",
        });
    }
    )
  }

  return (
    <View style={styles.container} >

      <Text style={{ ...styles.numberText, fontSize: 40, paddingBottom: 10 }}>{lambDetails.id}</Text>
      <View style={{ height: '60%' }}>
        <ScrollView alwaysBounceVertical='false'>
          <Text style={styles.categoryText}>{'Sex: '} <Text style={styles.numberText}>{lambDetails.sex}</Text></Text>
          <Text style={styles.categoryText}>{'Category: '} <Text style={styles.numberText}>{lambDetails.category}</Text></Text>
          <Text style={styles.categoryText}>{'Age: '} <Text style={styles.numberText}>{lambDetails.age}</Text></Text>
          <TouchableOpacity onPress={() => onIdPress(lambDetails.dameId)}><Text style={styles.categoryText}>{'Dame ID: '} <Text style={[styles.numberText, { fontWeight: 'bold', color: 'white' }]}> {lambDetails.dameId}</Text> </Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onIdPress(lambDetails.sireId)}><Text style={styles.categoryText}>{'Sire ID: '} <Text style={[styles.numberText, { fontWeight: 'bold', color: 'white' }]}> {lambDetails.sireId}</Text></Text></TouchableOpacity>
          <Text style={styles.categoryText}>{'Date of Birth: '} <Text style={styles.numberText}>{lambDetails.dateOfLambing}</Text></Text>
          <Text style={styles.categoryText}>{'Date of Mating: '} <Text style={styles.numberText}>{lambDetails.dateOfMating}</Text></Text>
          <Text style={styles.categoryText}>{'Birth Weight: '} <Text style={styles.numberText}>{(lambDetails.birthWeight / 1000).toFixed(2) + 'kg'}</Text></Text>
          {getStatusDetails(lambDetails.status)}
          <Text style={styles.categoryText}>{'Remarks: '}<Text style={styles.numberText}>{lambDetails.remarks}</Text></Text>
        </ScrollView>
      </View>
      <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-around', paddingRight: 35, paddingTop: 15 }}>
        <Button title={"Edit"} onPress={navigateToEditingFunction} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
        <Button title={"Delete"} onPress={() => deleteEntryFunc(lambId)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
      </View>
      <View style={{ alignSelf: 'center', width: "100%", alignItems: 'center', paddingRight: 35 }}>
        <Button onPress={() => thirdButtonFunction(lambDetails.status)} title={getThirdButtonText(lambDetails.status)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
        <Modal onBackButtonPress={() => setModalVisible(false)} isVisible={isModalVisible} style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={styles.modal}>
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Picker
                onValueChange={onModalStatusValueChange}
                useNativeAndroidPickerStyle={false}
                style={customPickerStyles}
                placeholder={{ label: "Status", value: null }}
                items={[
                  { label: Values.status.AUCTIONED, value: Values.status.AUCTIONED },
                  { label: Values.status.CULLED, value: Values.status.CULLED },
                  { label: Values.status.DIED, value: Values.status.DIED },
                  { label: Values.status.LOST, value: Values.status.LOST },
                  { label: Values.status.SOLD, value: Values.status.SOLD },
                  { label: Values.status.TRANSFERRED, value: Values.status.TRANSFERRED },
                  { label: Values.status.OTHER, value: Values.status.OTHER }
                ]}
              />

              <Button onPress={showDisposalDatePicker} title={"Date of Disposal: " + getFormattedDate(disposalDate)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, width: "90%" }} />
              <DateTimePickerModal
                isVisible={isDisposalDatePickerVisible}
                mode="date"
                date={disposalDate}
                onConfirm={handleDisposalConfirm}
                onCancel={hideDisposalDatePicker}
              />

            </View>
          </View>
          {getSubmitButton()}
          <Button title="Cancel" titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={{ ...styles.buttonContainer, marginBottom: 20, width: "100%" }} onPress={toggleModal} />

        </Modal>
      </View>

    </View>
  );
}

DetailsScreen.navigationOptions = {
  headerTitle: 'Details',
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
    paddingTop: 55,
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
    width: "40%"
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