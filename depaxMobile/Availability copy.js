import React, { useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';
import { restState, addProduct, removeProduct, updateProduct, fetchContent, updateAppointments, addTimeInput,selectDurationAppointment } from './redux/reducers/dataSlice';

const AdditionalInput = ({ index, dayIndex, onChangeText, onAdd, onRemove, time, startTime, endTime, appointments }) => {
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
    const [timeInputs, setTimeInputs] = useState([0]);
    const [time, setTime] = useState('');
    const [appointments, setAppointments] = useState([
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
    ]);

    const appointmentsState = useSelector(state => state.product.appointments);
    const dispatch = useDispatch();
    const handleTimeChange = (text, index, dayIndex, type) => {
        dispatch(updateAppointments({ text, index, dayIndex, type }))

        // const cleanedInput = text.replace(/\D/g, '');
        // if (cleanedInput.length <= 2) {
        //     setTime(cleanedInput);
        // } else if (cleanedInput.length <= 4) {
        //     // setAppointments(`${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`)
        //     if (type == "f") {
        //         setAppointments(prevAppointments => {
        //             const updatedAppointments = [...prevAppointments];
        //             updatedAppointments[dayIndex].appointments[index].from = `${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`
        //             // updatedAppointments[dayIndex] = { appointments: [...prevAppointments[dayIndex].appointments[0],{"from": cleanedInput,"to":"gu"}]};
        //             console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
        //             return updatedAppointments;

        //         });

        //     } else if (type == "t") {
        //         setAppointments(prevAppointments => {
        //             const updatedAppointments = [...prevAppointments];
        //             updatedAppointments[dayIndex].appointments[index].to = `${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`
        //             // updatedAppointments[dayIndex] = { appointments: [...prevAppointments[dayIndex].appointments[0],{"from": cleanedInput,"to":"gu"}]};
        //             console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
        //             return updatedAppointments;

        //         });

        //     }

        //     setTime(`${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`);
        // }
        // // const newInputs = [...inputs];
        // // newInputs[index] = { text };
        // // setInputs(newInputs);
    };
    const toggleSwitch = () => {
        setExpanded(!expanded);
    };

    const addTimeInput = (dayIndex) => {
        console.log(timeInputs);
        setTimeInputs([...timeInputs, {}]);
        setAppointments(prevAppointments => {
            const updatedAppointments = [...prevAppointments];
            updatedAppointments[dayIndex] = { appointments: [...prevAppointments[dayIndex].appointments, { "from": [], "to": [] }] };
            console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
            return updatedAppointments;

        });
        // setAppointments([...appointments, {}])
               const result = convertAppointments(appointments);
          console.log(JSON.stringify(result));
    };
    // const [selectedOption, setSelectedOption] = useState(null);

    const handleSelectDuration = (value, dayIndex) => {
        setAppointments(prevAppointments => {
            const updatedAppointments = [...prevAppointments];
             examinationDuration = value.value
            console.log(updatedAppointments[dayIndex] );
            console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
            return updatedAppointments;

        });



     
        //   const result = convertAppointments(appointments);
        //   console.log(JSON.stringify(result));
          
     
    };
   const convertAppointments = (data) => {
            const convertedData = {};
          
            data.forEach((dayData, index) => {
              const dayOfWeek = ['sun','mon', 'tue', 'wed', 'thu'][index]; // Assuming data corresponds to Monday to Friday
          
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
          
            return convertedData;
          };
          
    const options = [
        { label: '30 دقيقه', value: '30' },
        { label: '60 دقيقه', value: '60' },
        { label: '15 دقيقه', value: '15' },
    ];
    return (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text>{item.name}</Text>
                <Switch value={expanded} onValueChange={toggleSwitch} />
            </View>
            {expanded && (
                <View style={styles.expandedContainer}>
                    {timeInputs.map((input, index) => (
                        <AdditionalInput
                            key={index}
                            index={index}
                            dayIndex={item.id}
                            onChangeText={handleTimeChange}
                            onAdd={addTimeInput}
                            appointments={appointmentsState}
                        />
                    ))}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <DropdownSelect options={options} onSelect={(option)=>handleSelectDuration(option, item.id)} />
                        {/* <Text>Selected Option: {selectedOption ? selectedOption.label : 'None'}</Text> */}
                    </View>
                </View>
            )}
        </View>
    );
};

const App = () => {
    const data = [
        { id: 0, name: 'الاحد' },
        { id: 1, name: 'الاثنين' },
        { id: 2, name: 'الثلاثاء' },
        { id: 3, name: 'الاربعاء' },
        { id: 4, name: 'الخميس' },
    ];
    const [appointments, setAppointments] = useState([
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
        { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
    ]);

    const modifyAppointments = (item) => {
        setAppointments(item);
      };
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => <ListItem item={item} edit={modifyAppointments} appointments={appointments} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    itemContainer: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

export default App;
