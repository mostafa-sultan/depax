import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setaotp } from '../api/api';
import CustomAlert from './CustomAlert ';
import axios from 'axios';

const Otp = ({ navigation, route }) => {
    const [otp, setotp] = useState(null); 
    const {phone} = route.params||0;
    const handleSubmit = () => {
     if (otp) {
            let data = JSON.stringify({
          "phoneNumber": phone,
          "otp": otp
        });
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://cannula-doctors.onrender.com/doctor-app/register/verify',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios.request(config)
        .then((response) => {
            if (response.data.status=="200") {
                handleShowAlert()
                navigation.navigate('Home',{"id":response.data.id});
                console.log(response.data.id);
            }
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error.response.data);
        });    
     }         
        console.log('Submitted otp:', otp);
    };
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        console.log("nvigate");
        //   navigation.navigate('Price');

        setShowAlert(false);
    };


    return (
        <View style={styles.container}>
            <CustomAlert
                visible={showAlert}
                message="تم تاكيد رقم الهاتف"
                onClose={handleCloseAlert}
            />
            <Text style={styles.title}>اكمال انشاء الحساب</Text>

            {/* otp Input */}
            <Text style={styles.label}>تم ارسال كود تاكيد علي {phone}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input} 
                    value={otp}
                    onChangeText={setotp}
                />

            </View>

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

export default Otp;
