import React, { useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointments, addTimeInput, selectDurationAppointment, setAuth } from '../redux/reducers/dataSlice'; 
import CustomAlert from './CustomAlert ';

const AdditionalInput = ({ index, dayIndex, onChangeText, onAdd, appointments }) => {
    return (
        <View style={styles.additionalInputContainer}>
            <View style={styles.dropdownButton}>
                <Icon name="caret-down" size={20} color="#000" />
            </View>
            <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={appointments[dayIndex].appointments[index].from}
                // onChangeText={(text) => console.log("dayIndex="+dayIndex+"----index="+index) }
                onChangeText={(text) => onChangeText(text, index, dayIndex, "f")}
                keyboardType="numeric"
                maxLength={5}
            />
            <View style={styles.dropdownButton}>
                <Icon name="caret-down" size={20} color="#000" />
            </View>
            <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={appointments[dayIndex].appointments[index].to}
                onChangeText={(text) => onChangeText(text, index, dayIndex, "t")}
                keyboardType="numeric"
                maxLength={5}
            />
            <Icon name="plus" size={30} onPress={() => onAdd(dayIndex)} color="#4d4d4d" backgroundColor="#e4dddd" />
        </View>
    );
};


const ListItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const appointmentsState = useSelector(state => state.product.appointments);
    const dayInputLenth = useSelector(state => state.product.dayInputLenth);
    const dispatch = useDispatch();

    const handleTimeChange = (text, index, dayIndex, type) => {
        dispatch(updateAppointments({ text, index, dayIndex, type }))

    };
    const toggleSwitch = () => {
        setExpanded(!expanded);
    };

    const handleAddTimeInput = (dayIndex) => {
        dispatch(addTimeInput({ dayIndex }));
    };


    const handleSelectDuration = (value, dayIndex) => {
        dispatch(selectDurationAppointment({ dayIndex: dayIndex, duration: value.value }));
    };


    const options = [
        { label: '30 دقيقه', value: '30' },
        { label: '60 دقيقه', value: '60' },
        { label: '15 دقيقه', value: '15' },
    ];
    return (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.day}>{item.name}</Text>
                <Switch value={expanded} onValueChange={toggleSwitch} />
            </View>
            {expanded && (
                <View style={styles.expandedContainer}>
                    {dayInputLenth[item.id].map((input, index) => (
                        <AdditionalInput
                            key={index}
                            index={index}
                            dayIndex={item.id}
                            onChangeText={handleTimeChange}
                            onAdd={handleAddTimeInput}
                            appointments={appointmentsState}
                        />
                    ))}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <DropdownSelect options={options} onSelect={(option) => handleSelectDuration(option, item.id)} />
                    </View>
                </View>
            )}
        </View>
    );
};

const Availability = ({ navigation }) => {

    const token = useSelector(state => state.product.completeAccountToken);


    const data = [
        { id: 0, name: 'الاحد' },
        { id: 1, name: 'الاثنين' },
        { id: 2, name: 'الثلاثاء' },
        { id: 3, name: 'الاربعاء' },
        { id: 4, name: 'الخميس' },
    ];
    const appointmentsState = useSelector(state => state.product.appointments);

    const convertAppointments = async (data) => {
        const convertedData = {};

        data.forEach((dayData, index) => {
            const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu'][index]; // Assuming data corresponds to Monday to Friday

            const appointments = dayData.appointments.map(appointment => {
                const from = typeof appointment.from === 'string' ? appointment.from.split(':').map(Number) : [];
                const to = typeof appointment.to === 'string' ? appointment.to.split(':').map(Number) : [];
                return { from, to };
            }).filter(appointment => appointment.from.length > 0 && appointment.to.length > 0);

            if (appointments.length > 0) {
                convertedData[dayOfWeek] = {
                    appointments,
                    examinationDuration: Number(dayData.examinationDuration)
                };
            }
        });
        console.log(JSON.stringify(convertedData));


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://cannula-doctors.onrender.com/doctor-app/complete-account/set-appointments/inClinic',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: convertedData
        };
        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                if (response.data.msg == "inClinic appointments has been set") {
                    dispatch(setAuth({ "completeAccountToken": result.loginToken }));
                    navigation.navigate('Home');
                }
            })
            .catch((error) => {
                navigation.replace('Form');
                console.log(error.response.data);
            });


        return convertedData;
    };
    const ItemSeparator = () => (
        <View
            style={{
                height: 1,
                width: '100%',
                backgroundColor: '#ccc',
            }}
        />
    );
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        console.log("nvigate");
        navigation.navigate('Home');
        setShowAlert(false);
    };

    return (
        <View style={styles.container}>
            <CustomAlert
                visible={showAlert}
                message="تم تسجيل المواعيد المتاحه"
                onClose={handleCloseAlert}
            />
            <Text style={styles.title}>المواعيد المتاحه</Text>
            <Image source={require('./av.png')} style={styles.image} />
            <FlatList
                style={styles.flatList}
                data={data}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={ItemSeparator}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { convertAppointments(appointmentsState) }}>
                    <Text style={styles.buttonText}>التالي</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: "#ffffff",

    },
    flatList: {
        flex: 1,
        marginTop: 50,
        marginBottom: 40,
        backgroundColor: "#ffffff",

    },
    buttonContainer: {
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
    itemContainer: {
        backgroundColor: "#ffffff",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: "100%", // Adjust the width as needed
        height: 100, // Adjust the height as needed
        resizeMode: 'contain', // Or adjust resizeMode based on your requirements
    },
    day: {
        fontSize: 30,
        padding: 12
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 30,
        color: "#000"
    },
    expandedContainer: {
        marginTop: 10,
    },
    additionalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,

    },
    input: {
        flex: 1,
        backgroundColor: "#e4dddd",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        height: 40,
        marginRight: 10,
    },
    dropdownButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e4dddd",
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5,
        width: 40,
        height: 40,
    },
    addIcon: {

    }
});

const DropdownSelect = ({ options, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsVisible(false);
    };

    return (
        <View style={styles1.container}>
            <TouchableOpacity onPress={toggleDropdown} style={styles1.selectContainer}>
                <Text>{selectedOption ? selectedOption.label : 'Select an option'}</Text>
            </TouchableOpacity>
            {isVisible && (
                <View style={styles1.optionsContainer}>
                    {options.map(option => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles1.option}
                            onPress={() => handleSelect(option)}
                        >
                            <Text>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles1 = StyleSheet.create({
    container: {
        backgroundColor: '#f0dede',
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
        padding: 12
    },
    selectContainer: {
        width: "100%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: "100%",
        marginTop: 5,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Availability;
