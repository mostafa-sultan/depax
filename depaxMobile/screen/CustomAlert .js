import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomAlert = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 28, borderRadius: 10, alignItems: 'center' }}>
                    <Icon name="check" size={64} />
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>{message}</Text>
                    <TouchableOpacity onPress={onClose} style={{ borderRadius: 15, backgroundColor: "#7386d8", paddingVertical: 10, paddingHorizontal: 59 }}>
                        <Text style={{ fontSize: 16,color:"#fff" }}>الصفحة الرئيسية</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
