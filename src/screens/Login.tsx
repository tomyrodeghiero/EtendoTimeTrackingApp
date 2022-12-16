import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {COLORS, SIZES} from '../styles/theme';

const Login = () => {
  const navigation = useNavigation<any>();
  const {email, setEmail, token, setToken, id, setId, setUserLoggedIn} =
    useContext(AuthContext);

  const [hiddenPassword, setHiddenPassword] = useState(true);

  const storeCredentials = async (email: any, token: any, id: any) => {
    try {
      await AsyncStorage.setItem('EMAIL', email);
      await AsyncStorage.setItem('ID', id);
      await AsyncStorage.setItem('TOKEN', token);
      setUserLoggedIn(true);
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f9'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/team-help.png')}
            style={{height: 300, width: 300}}
          />
        </View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: COLORS.primary,
            marginBottom: 30,
            fontFamily: 'Inter-Medium',
          }}>
          Login 🚀
        </Text>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            alignItems: 'center',
            paddingBottom: 8,
            marginBottom: 20,
          }}>
          <Image
            source={require('../../src/assets/images/email.png')}
            resizeMode="contain"
            style={{
              tintColor: COLORS.primary,
              width: 22,
              height: 22,
              marginRight: SIZES.base,
            }}
          />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#808080"
            style={{
              flex: 1,
              paddingVertical: 0,
              color: COLORS.primary,
            }}
            keyboardType="email-address"
            defaultValue={email}
            onChangeText={setEmail}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            alignItems: 'center',
            paddingBottom: 8,
            marginBottom: 20,
          }}>
          <Image
            source={require('../../src/assets/images/id.png')}
            resizeMode="contain"
            style={{
              tintColor: COLORS.primary,
              width: 22,
              height: 22,
              marginRight: SIZES.base,
            }}
          />
          <TextInput
            placeholder="ID"
            placeholderTextColor="#808080"
            style={{
              flex: 1,
              paddingVertical: 0,
              color: COLORS.primary,
            }}
            onChangeText={setId}
            defaultValue={id}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            alignItems: 'center',
            paddingBottom: 8,
            marginBottom: 20,
          }}>
          <Image
            source={require('../../src/assets/images/token.png')}
            resizeMode="contain"
            style={{
              tintColor: COLORS.primary,
              width: 22,
              height: 22,
              marginRight: SIZES.base,
            }}
          />
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <TextInput
                placeholder="Access token"
                placeholderTextColor="#808080"
                style={{
                  flex: 1,
                  paddingVertical: 0,
                  color: COLORS.primary,
                }}
                secureTextEntry={hiddenPassword ? true : false}
                onChangeText={setToken}
                defaultValue={token}
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={() => setHiddenPassword(!hiddenPassword)}
                activeOpacity={0.5}>
                <Image
                  source={
                    hiddenPassword
                      ? require('../../src/assets/images/hidden-password.png')
                      : require('../../src/assets/images/visible-password.png')
                  }
                  resizeMode="contain"
                  style={{
                    tintColor: COLORS.primary,
                    width: 22,
                    height: 22,
                    marginRight: SIZES.base,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Pressable
          disabled={email === '' || id === '' || token === ''}
          onPress={() => {
            if (email.toLowerCase().includes('@smfconsulting.es')) {
              storeCredentials(email, token, id);
              navigation.navigate('Home', {
                email: email.toLowerCase(),
                token: token,
                id: id,
              });
            } else {
              ToastAndroid.show(
                'PLease, check that your email is correct.',
                ToastAndroid.SHORT,
              );
            }
          }}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#eff1f7',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            bottom: 0,
            marginBottom: 70,
            borderRadius: 5,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/images/jira.png')}
            style={{
              width: 35,
              resizeMode: 'contain',
              height: 35,
              position: 'absolute',
              left: 15,
            }}
          />
          <Text
            style={{
              justifyContent: 'center',
              fontSize: SIZES.medium,
              fontFamily: 'Inter-Medium',
              color: COLORS.primary,
            }}>
            Authenticate
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            marginBottom: -14,
            color: '#808080',
          }}>
          developed by
        </Text>
        <Image
          source={require('../../src/assets/images/futit-logotype.png')}
          resizeMode="contain"
          style={{
            width: 70,
            height: 70,
            marginRight: SIZES.base,
            alignSelf: 'center',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;
