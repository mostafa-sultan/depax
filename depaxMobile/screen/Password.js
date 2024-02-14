import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setaPassword } from '../api/api';
import CustomAlert from './CustomAlert ';
import {  useSelector } from 'react-redux';
import axios from 'axios';
const Password = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rpassword, setRPassword] = useState('');
    const [showRPassword, setShowRPassword] = useState(false);
    const token = useSelector(state => state.product.completeAccountToken);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleRPasswordVisibility = () => {
        setShowRPassword(!showRPassword);
    };

    const handleSubmit = () => {
        if (password == rpassword) {

            let data = JSON.stringify({
                "password": password
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://cannula-doctors.onrender.com/doctor-app/complete-account/set-password',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: data
            }; 
            axios.request(config)
                .then((response) => { 
                    if (response.data.msg == "password has been set") { 
                        handleShowAlert() 
                    }
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error.response.data);
                    navigation.replace('Form');
                });

        }

 
        console.log('Submitted password:', password);
    }; 
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        console.log("nvigate");
        navigation.navigate('Price');

        setShowAlert(false);
    };


    return (
        <View style={styles.container}>
            <CustomAlert
                visible={showAlert}
                message="تم انشاء رقم سري"
                onClose={handleCloseAlert}
            />
            <Text style={styles.title}>اكمال انشاء الحساب</Text>

            {/* Password Input */}
            <Text style={styles.label}>الرقم السري</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                {/* Toggle Show Password */}
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={24} color="#aaa" />
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>تاكيد الرقم السري</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showRPassword}
                    value={rpassword}
                    onChangeText={setRPassword}
                />
                {/* Toggle Show Password */}
                <TouchableOpacity onPress={toggleRPasswordVisibility} style={styles.iconContainer}>
                    <Icon name={showRPassword ? 'eye-slash' : 'eye'} size={24} color="#aaa" />
                </TouchableOpacity>
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

export default Password;
