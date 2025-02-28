import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Dimensions, Button, ScrollView, Pressable, Platform } from 'react-native'
// import Navbar from '../../component/navbar';
// import Colors from '../../styles/Colors';
import { FormPostMethod, getMethod, getStorageData, postMethod, storeData } from '../../utils/helper';
import Modal from 'react-native-modal';
import { Avatar, RadioButton } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';



interface EditProfileData {
    name: string;
    avatar_original: string;
    phone: number;
    email: string;

}

const NewProfileEdit: FC = ({ navigation, route }: any): JSX.Element => {
    const { name, phone, avatar, email } = route.params;
    const [fullName, setName] = useState('');
    const [phoneNo, setPhone] = useState('');
    const [emailId, setEmailId] = useState('');
    // const [profile, setProfile] = useState();
    const [profile, setProfile] = useState<EditProfileData>();
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        setName(name);
        setPhone(phone);
        setEmailId(email);
        // setProfile(avatar);

    }, []);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [checked, setChecked] = React.useState('first');


    const handleRadioButtonChange = (value: React.SetStateAction<string>) => {
        setChecked(value);
    };

    const EditProfile = async () => {
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('phone', phoneNo);
        formData.append('email', emailId);  // Add email
        formData.append('image', imageUrl)
        console.log("formData--", formData)

        try {
            const api: any = await FormPostMethod(`update-profile`, formData);
            if (api.status === 200) {
                setLoading(false);
                console.log("api called")
                console.log("update-profile api data----", api.data)
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                const existingUserData = await getStorageData();
                const updatedUserDetails = {
                    ...existingUserData.user_details,    // Keep existing data
                    name: fullName,                      // Update name
                    phone: phoneNo,                      // Update phone
                    email: emailId,                      // Update email
                    avatar_original: imageUrl || avatar, // Update avatar
                };
                const updatedUserData = {
                    ...existingUserData,
                    user_details: updatedUserDetails,
                };
                console.log('updatedUserData', updatedUserData)
                await storeData(updatedUserData);
                // navigation.reset({
                //     routes: [{ name: 'TabNavigation' }]
                // })
            } else {
                setLoading(false);
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: '#AE1717',
                    backgroundColor: 'red',
                });
            }
        }
        catch (e) {
            Snackbar.show({
                text: "Some Error Occured" + e,
                duration: Snackbar.LENGTH_SHORT,
                textColor: '#AE1717',
                backgroundColor: 'orange',
            });
        }

    }

    const imageUpload = async () => {
        console.log("hiiii")
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            });

            // Check if the image was selected successfully
            if (image && image.path) {
                setImageUrl(image.path);
            } else {
                // Handle the case when the user didn't pick any image
                console.log('No image selected');
            }
        } catch (error) {
            // Handle any errors that might occur during image selection
            console.log('Error selecting image:', error);
        }

    };

    return (
        <View>
            <View>
                {/* <ImageBackground source={require('../../Images/final-curve.png')} style={styles.mainImagebg}> */}
                <View style={{ flexDirection: 'row' }}>
                    {/* <Pressable onPress={() => navigation.navigate('NotificationScreen')} style={styles.notification}>
                            <Image source={require('../../Images/notification.png')} style={styles.notificationImg} />
                        </Pressable> */}
                </View>
                <View style={styles.info}>
                    <View style={styles.profile}>

                        <Avatar.Image size={100} source={{ uri: imageUrl || avatar }} style={styles.profileImage} />
                        <Pressable onPress={() => imageUpload()} style={styles.cameraImgView} >
                            <Image source={require('../../../assets/img/camera.png')} style={styles.cameraImg} />
                        </Pressable>
                    </View>
                    <View style={styles.welcomeText}>
                        <View style={styles.textview}>
                            <Text style={{ color: 'red', fontSize: width * 0.06 }}>Welcome</Text>
                            {/* <Text style={{ color: 'red', fontSize: width * 0.04,}}>{profile?.data.name}</Text> */}
                            {/* <Text style={{ color: 'red', fontSize: width * 0.04,}}>zoya</Text> */}
                        </View>

                        <View style={styles.language}>
                            <Pressable onPress={toggleModal} style={{ display: 'flex', flexDirection: 'row' }}>
                                <IonIcon name="globe-outline" color={'red'} size={width * 0.06} />
                                <Text style={{ color: 'red', marginLeft: 5, fontSize: width * 0.04, marginRight: 15 }}>EN</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                {/* </ImageBackground> */}
                {/* <Pressable onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back-outline" color={'white'} size={26} style={{ marginTop: -20, marginLeft: 10 }} />
                </Pressable> */}
                {/* ==========MODAL================================= */}
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
                    <View style={styles.modalContent} >
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 10 }}>
                            <Text style={{ color: 'black', fontSize: width * 0.05, fontWeight: 'bold' }}>Language</Text>
                        </View>
                        <View>
                            <RadioButton.Group
                                onValueChange={handleRadioButtonChange}
                                value={checked}>
                                <RadioButton.Item label="English" value="english" color="red" labelStyle={{ color: 'black' }} />
                                <RadioButton.Item label="Chinese" value="chinese" color="red" labelStyle={{ color: 'black' }} />
                            </RadioButton.Group>
                        </View>
                        {/* <Text style={styles.modalText}>This is your bottom popup modal.</Text> */}
                    </View>
                </Modal>
                {/* ========================================================= */}

            </View>
            <View style={styles.cover}>
                <Text style={styles.name}>Name</Text>
                <View style={styles.inputarea}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        onChangeText={setName}
                        value={fullName}
                        keyboardType={'name-phone-pad'}
                        placeholder="Enter email"
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.name}>Phone</Text>
                <View style={styles.inputarea}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        onChangeText={setPhone}
                        value={phoneNo}
                        keyboardType={'numeric'}
                        placeholder="Enter Phone No"
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.name}>Email</Text>
                <View style={styles.inputarea}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        onChangeText={setEmailId}
                        value={emailId}
                        keyboardType={'name-phone-pad'}
                        placeholder="Enter email"
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Pressable style={styles.button} onPress={() => EditProfile()}>
                    <Text style={styles.save}>Save</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default NewProfileEdit;
const styles = StyleSheet.create({
    cover: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginTop: 100
    },
    cameraImg: {
        // position: 'absolute',
        left: 100,
        top: 80
    },
    cameraImgView: {
        backgroundColor: 'red',
        padding: 10
    },
    input: {
        color: 'black'
    },
    textview: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20
    },
    notificationImg: {
        height: 25,
        width: 25
    },
    notification: {
        position: 'absolute',
        right: 20,
        top: -20
    },
    mainImagebg: {
        width: width * 1,
        height: width * 0.46,
        flex: 1,
        resizeMode: 'cover',
        paddingTop: 40
    },
    info: {
        height: '12%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '8%',
        position: 'relative',
    },
    profile: {
        height: "100%",
        width: "50%",
    },
    profileImage: {
        resizeMode: "contain",
        position: 'absolute',
        top: width * 0.03,
        left: "15%",
        borderRadius: 60
    },
    welcomeText: {
        position: 'absolute',
        top: "8%",
        left: '35%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '65%',
    },
    language: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentDiv: {
        paddingBottom: '10%',
        borderWidth: 1,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        height: width * 0.4,
        marginTop: "5%",
    },
    contentDiv2: {
        paddingBottom: '10%',
        paddingTop: '5%',
        borderWidth: 1,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    earningText: {
        fontSize: width * 0.06,
        marginLeft: 20,
        fontWeight: "600",
    },
    earningView: {
        width: "80%",
        backgroundColor: '#E8E8E8',
        marginLeft: "10%",
        borderRadius: 20,
        paddingBottom: 15,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: 20
        // marginTop: width * 0.2
    },
    earnings: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
    },
    earnings1: {
        borderWidth: 1,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        width: '33%'
    },
    earnings1Text: {
        fontSize: width * 0.04,
        // fontWeight: 'bold',
        color: '#515151'
    },
    earnings1Text2: {
        fontSize: width * 0.035,
        // fontWeight: 500,
        color: '#EC1C24'
    },

    earnings2: {
        borderWidth: 1,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        width: '30%'
    },

    earnings3: {
        display: 'flex',
        paddingLeft: 10,
        width: '33%',
    },
    startButton: {
        backgroundColor: '#F26722',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    startButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalOrder: {
        marginTop: 30,
        marginLeft: '10%',
        width: '80%',
    },
    totalOrderText: {
        marginBottom: 20,
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: 'red',
        width: width * 0.38,
        height: height * 0.23,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    boxnoText: {
        fontSize: width * 0.08,
        color: 'white',
        fontWeight: "bold",
    },
    boxContentText: {
        fontSize: width * 0.036,
        color: 'white',
        fontWeight: "bold"
    },
    boxLast: {
        marginBottom: 100,
        paddingBottom: 100,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.3, // Adjust the height as needed
    },
    modalText: {
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    button: {
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 40,
        marginTop: 40,
        // backgroundColor: Colors.brand_primary,
        // borderColor: Colors.brand_primary,
    },
    save: {
        // color: Colors.white,
        fontSize: 18
    },
    inputarea: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',

        paddingLeft: 10,
        borderRadius: 15,

        marginBottom: 10
    },
    name: {
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5,
        color: 'black'
    }
})