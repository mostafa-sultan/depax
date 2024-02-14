import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setaPrice } from '../api/api';
import CustomAlert from './CustomAlert ';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
const Price = ({ navigation }) => {
    const [clinicPrice, setClinicPrice] = useState('');
    const [homePrice, setHomePrice] = useState('');
    const token = useSelector(state => state.product.completeAccountToken);


    const handleSubmit = () => {
 
        let data = JSON.stringify({
            "inClinic": clinicPrice,
            "atHome": homePrice
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://cannula-doctors.onrender.com/doctor-app/complete-account/set-prices',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                if (response.data.msg == "price(s) has been set") {
                    handleShowAlert()
                }
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });

      console.log('Submitted ClinicPrice:', clinicPrice);
    };
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        console.log("nvigate");
        navigation.navigate('Availability');
        setShowAlert(false);
    };

    return (
        <View style={styles.container}>
            <CustomAlert
                visible={showAlert}
                message="تم انشاء سعر الكشف"
                onClose={handleCloseAlert}
            />
            <Text style={styles.title}>سعر الكشف</Text>
            <Text style={styles.label}>الكشف في العياده</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={clinicPrice}
                    onChangeText={setClinicPrice}
                />
                <Text>ج/م</Text>
            </View>
            <Text style={styles.label}>الكشف المنزلي</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={homePrice}
                    onChangeText={setHomePrice}
                />
                <Text>ج/م</Text>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>التالي</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 30,
        color: "#000"
    },
    label: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
    },
    iconContainer: {
        padding: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: 100,
        alignItems: 'center',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '100%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default Price;
