import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomAlert from './CustomAlert ';

const Form = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorates, setGovernorates] = useState('');
  const [governorateCites, setGovernorateCites] = useState('');
  const [address, setAddress] = useState('');
  const [inClinic, setInClinic] = useState(false);
  const [atHome, setAtHome] = useState(false);
  const [image, setImage] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState([]);
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [governoratesOptions, setGovernoratesOptions] = useState([]);
  const [governorateCitesOptions, setGovernorateCitesOptions] = useState([]);

  useEffect(() => {
    fetchOptionsFromAPI();
  }, []);
  const fetchOptionsFromAPI = async () => {
    var myHeaders = new Headers();
    myHeaders.append("X-CSCAPI-KEY", "b1lSMTZRUzNiN0ZoVzlMUUh3NTloSE9KNnRaQndjR3BpeXVScnNicA==");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    try {
      // Fetch options from your API
      const response = await fetch('https://api.npoint.io/99d95f3a1c6f37e7ec76');
      const data = await response.json();
      // Assuming the data is an array of options [{label: 'Option 1', value: 'option1'}, ...]
      setOptions(data);

      const specializationsOptionsRes = await fetch('https://cannula-doctors.onrender.com/doctor-app/register/specializations', requestOptions);
      const specializationsOptionsData = await specializationsOptionsRes.json();
      setSpecializationsOptions(specializationsOptionsData.specializations);

      const setGovernoratesOptionsRes = await fetch('https://api.countrystatecity.in/v1/countries/eg/states', requestOptions);
      const governoratesOptionsData = await setGovernoratesOptionsRes.json();
      setGovernoratesOptions(governoratesOptionsData);

      const setGovernorateCitesOptionsRes = await fetch('https://api.countrystatecity.in/v1/countries/eg/states/DK/cities', requestOptions);
      const governorateCitesOptionsData = await setGovernorateCitesOptionsRes.json();
      setGovernorateCitesOptions(governorateCitesOptionsData);
      // Set the selected value to the first option initially
      // if (data.length > 0) {
      //   setSelectedValue(data[0].value);
      // }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(res);
      setImage(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown Error: ', err);
      }
    }
  };

  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(res);
      setFileUri(res[0].uri);
      setFile(res[0]);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown Error: ', err);
      }
    }
  };
  const handleSubmitImageProfile = async () => {
    try {
      var formdata = new FormData();
      if (image) {
        const imageFile = {
          uri: image,
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
        formdata.append('image', imageFile);
      }
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      const response = await fetch("https://cannula-doctors.onrender.com/doctor-app/register/upload/profile-image", requestOptions);
      const result = await response.json();

      const uploadedImage = result.image;
      console.log('uploadedImage:', uploadedImage);

      return uploadedImage;
    } catch (error) {
      console.error('Error submitting data:', error);
      // Optionally, show error message
      return ('Error submitting image')
      alert('Error submitting data. Please try again later.');
    }
  };
  const handleSubmitFile = async () => {
    try {
      var formdata = new FormData();
      if (fileUri) {
        const file = {
          uri: fileUri,
          type: '*/*',
          name: 'file.pdf',
        };
        formdata.append('file', file);
      }
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      const response = await fetch("https://cannula-doctors.onrender.com/doctor-app/register/upload/syndicateId", requestOptions)

      const result = await response.json();

      const syndicateId = result.syndicateId;
      console.log('syndicateId:', syndicateId);

      return syndicateId;
    } catch (error) {
      console.error('Error submitting data:', error);
      // Optionally, show error message
      return ("Error submitting file")
    }

  };

  const handleSubmitForm = async () => {
    setSubmit(!submit)
    const imageProfile = await handleSubmitImageProfile();
    const syndicateId = await handleSubmitFile();
    console.log('imageProfile' + imageProfile);
    console.log('certificate' + syndicateId);
    try {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "name": firstName + " " + lastName,
        "image": imageProfile,
        "specialization": specializations,
        "governorate": governorates,
        "city": governorateCites,
        "address": address,
        "syndicateId": syndicateId,
        "nationalId": "https://cannula-frontend-task.s3.eu-west-1.wasabisys.com/nationalIds/1707304739773_image.png",
        "certificate": "https://cannula-frontend-task.s3.eu-west-1.wasabisys.com/certificates/1707304849320_image.png",
        "phoneNumber": phone,
        "email": email,
        "inClinic": inClinic,
        "atHome": atHome,
        "pushToken": "catonkeyboard"
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      await fetch("https://cannula-doctors.onrender.com/doctor-app/register/join-request/sms", requestOptions)
        .then(response => response.json())
        .then(result =>{
          console.log(result.status)
          console.log(result)
          setMssage(result.msg)
          if (result.status=="200") {
            handleShowAlert()
          }
        } )
        .catch(error => {console.log('error', error.response.data);setMssage(error.response.data)});
      // Optionally, show success message
      setSubmit(false)
    
    } catch (error) {
      console.error('Error submitting data:', error);
      // Optionally, show error message
      alert('Error submitting data. Please try again later.');
    }
  };

  const [showAlert, setShowAlert] = useState(false);

  const [submit, setSubmit] = useState(false);
  const [mssage, setMssage] = useState("تم ارسال طلبك سيتم التواصل معك");

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    console.log("nvigate");
    navigation.navigate('Otp',{"phone":phone});
    setShowAlert(false);
  };

  return (
    <ScrollView style={styles.container}>
      <CustomAlert
        visible={showAlert}
        message={mssage}
        onClose={handleCloseAlert}
      />
      <Text style={styles.title}>طلب انضمام الي كانيولا</Text>
      <View style={styles.imageContainer} >
        <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image
              source={require('./imgPik.png')}
              style={styles.image}
            />
          )}
        </TouchableOpacity >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>الاسم الاول</Text>
          <TextInput
            value={firstName}
            onChangeText={text => setFirstName(text)}
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>الاسم الاخير</Text>
          <TextInput
            value={lastName}
            onChangeText={text => setLastName(text)}
            style={styles.inputText}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>التخصص</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={specializations}
              onValueChange={(itemValue, itemIndex) => setSpecializations(itemValue)}
            // style={styles.picker}
            >
              {specializationsOptions.map(option => (
                <Picker.Item key={option.id} label={option.name} value={option.id} />
              ))}
            </Picker>
          </View>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>رقم الموبايل</Text>
          <TextInput
            value={phone}
            onChangeText={text => setPhone(text)}
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>البريد الالكتروني</Text>
          <TextInput
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>المحافظه</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={governorates}
              onValueChange={(itemValue, itemIndex) => setGovernorates(itemValue)}
            >
              {governoratesOptions.map(option => (
                <Picker.Item key={option.id} label={option.name} value={option.iso2} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>المنطقه</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={governorateCites}
              onValueChange={(itemValue, itemIndex) => setGovernorateCites(itemValue)}
            >
              {governorateCitesOptions.map(option => (
                <Picker.Item key={option.id} label={option.name} value={option.name} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>العنوان</Text>
          <TextInput
            value={address}
            onChangeText={text => setAddress(text)}
            style={styles.inputText}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>الايتاحيه للكشف </Text>
          <View style={styles.checkBoxs}>
            <CheckBox
              value={atHome}
              onValueChange={() => setAtHome(!atHome)}
            />
            <Icon name="home" size={24} color={"#7386d8"} />
            <Text style={styles.checkBoxsText}>كشف منزلي</Text>
          </View>
          <View style={styles.checkBoxs}>
            <CheckBox
              value={inClinic}
              onValueChange={() => setInClinic(!inClinic)}
            />
            <Icon name="road" size={24} color={"#7386d8"} />
            <Text style={styles.checkBoxsText}>كشف في العياده</Text>
          </View>
        </View>
        <View style={styles.attach}>
          <Text style={styles.label}>شهاده مزاوله المهنه </Text>
          <TouchableOpacity onPress={handleFilePicker} style={styles.fileButton}>
            <Text style={styles.buttonText}> {file ? file.name : 'اختر ملف لتحميل'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
            <Text style={styles.submitButtonText}>{submit ? "جاري الارسال...." : 'ارسال'}</Text>
          </TouchableOpacity>
        </View>



      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#000",
    marginBottom: 15
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  label: {
    fontSize: 16,
    margin: 10,
    fontWeight: 'bold',
    color: "#302e2e",

  },
  inputContainer: {

    width: '100%',
  },
  inputText: {
    borderRadius: 12,
    // borderWidth: 0.5, 
    // borderColor: 'gray',
    backgroundColor: '#eee4e4'
  },
  picker: {
    borderRadius: 12,
    // borderWidth: 1, 
    // borderColor: 'gray',
    backgroundColor: '#eee4e4',
    height: 50,
    width: '100%',
  },
  checkBoxs: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10
  },
  checkBoxsText: {
    fontSize: 16,
    margin: 10,
    fontWeight: 'bold',
    color: "#3b57d4",
  },
  test: {

  },
  test: {

  },
  submitButtonContainer: {
    margin: 12,
    width: "90%",
    height: 100,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  fileButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1, // Adjust border width as needed
    borderColor: '#969ba0', // Adjust border color as needed
    borderStyle: 'dashed', // Apply dashed border style
    alignItems: 'center',
    justifyContent: 'center',
    width: "90%",
    alignSelf: 'center',
  },
  buttonText: {
    color: '#969ba0', // Adjust text color as needed
    fontSize: 16,
  },
  attach: {
    width: "95%",
    height: 100,
    // alignItems: 'center',
    // alignSelf: 'center',
  },
});
export default Form;
