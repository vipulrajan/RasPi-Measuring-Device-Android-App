import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import Colors from '../constants/colors';

const SeparatorBar = props => {

    return (<View style={[styles.bar, props.style]}></View>
    );
};

const styles = StyleSheet.create({
    bar: {
        height: 1.5,
        width: '95%',
        backgroundColor: Colors.tertiary,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 2
    }
}
);


export default SeparatorBar;