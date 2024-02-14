

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {   setAuth } from '../redux/reducers/dataSlice';

const Home = ({ navigation,route }) => {
  const token = useSelector(state => state.product.completeAccountToken);
  const {id} = route.params||0
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Password');
 
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://cannula-doctors.onrender.com/test/check-verified/'+id,
        headers: { }, 
      };
      
      axios.request(config)
      .then((response) => {
        if(response.data.completeAccountToken){
          
            dispatch(setAuth({ completeAccountToken }));
            navigation.navigate('Password');
       
        }
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error.response.data);
        navigation.replace('Form');
      });


    }, 10000);
 
    return () => clearTimeout(timer);
  }, []); 
  
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topBar}>
        <Text style={styles.title}>اهلا بيك في كانيولا</Text>
        <TouchableOpacity onPress={() => console.log('Notification pressed')}>
          <Icon name="bell" size={24} />
        </TouchableOpacity>
      </View>

      {/* Center Section */}
      <View style={styles.centerContent}>
        <Image source={require('./home.png')} style={styles.image} />
        <Text style={styles.centerTitle}>عند الموافقه علي طلبك سيتم التواصل معك وبعدها تسطتيع ممارسه عملك كطبيب علي كانيولا</Text>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Icon 1 pressed')}>
          <Icon name="home" size={24} />
          <Text>الرئيسيه</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Icon 2 pressed')}>
          <Icon name="calendar" size={24} />
          <Text>مواعيد</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Icon 3 pressed')}>
          <Icon name="user" size={24} />
          <Text>الملف الشخصي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14, 
    marginTop:13,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  centerTitle: {
    color:"#afa7a7",
    fontSize: 19,
    marginTop: 10,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default Home;
