import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {COLORS, SIZES} from '../styles/theme';
import base64 from 'react-native-base64';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const ProblemsFounds = () => {
  const navigation = useNavigation();
  const PROBLEMS_FOUND = 'INT-5612';

  const [problemsFoundText, setProblemsFoundText] =
    useState('No problems found.');

  const {email, token} = useContext(AuthContext);

  const sendProblemsFound = (comment: any) => {
    axios
      .post(
        `https://etendoproject.atlassian.net/rest/api/3/issue/${PROBLEMS_FOUND}/worklog`,
        {
          timeSpentSeconds: 60,
          comment: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: comment,
                    type: 'text',
                  },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Basic ${base64
              .encode(`${email}:${token}`)
              .toString('base64')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(res => {
        console.log(res);
        ToastAndroid.show(
          'Your information has been registered in Jira',
          ToastAndroid.SHORT,
        );
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show(
          'Some error has occurred. Your information has not been sent to Jira',
          ToastAndroid.SHORT,
        );
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      {/* <Text>
        Email: {email} - Token: {token}
      </Text> */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          height: 40,
          width: 40,
          borderRadius: 100,
          backgroundColor: '#eff1f7',
          borderWidth: 1,
          borderColor: '#d3d6e1',
          justifyContent: 'center',
          margin: 25,
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/images/back.png')}
          style={{width: 20, resizeMode: 'contain'}}
        />
      </TouchableOpacity>

      <View
        style={{
          justifyContent: 'space-between',
          marginHorizontal: 25,
        }}>
        <Text
          style={{
            color: COLORS.primary,
            fontFamily: 'Inter-ExtraBold',
            fontSize: 22,
          }}>
          Tell us, did you have any problem today?
        </Text>
        <Text
          style={{
            color: COLORS.primary,
            fontFamily: 'Inter-ExtraBold',
            fontSize: 22,
          }}>
          Your comment matters to us.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#7182ff',
          padding: 15,
          minHeight: '20%',
          maxHeight: '25%',
          borderRadius: 20,
          margin: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../assets/images/question.png')}
              style={{
                width: 30,
                resizeMode: 'contain',
                height: 30,
                tintColor: COLORS.white,
              }}
            />
            <Text
              style={{
                textAlignVertical: 'center',
                marginLeft: 10,
                fontFamily: 'Inter-Medium',
                color: COLORS.white,
              }}>
              Problems found today
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={{
              fontFamily: 'Inter-Regular',
              color: COLORS.white,
              fontSize: SIZES.font,
            }}
            placeholderTextColor="#e5e5e5"
            underlineColorAndroid="transparent"
            placeholder="No problems found. (Default comment)"
            multiline={true}
            onChangeText={setProblemsFoundText}
          />
        </ScrollView>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginVertical: 0,
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/images/help.png')}
          style={{
            width: 290,
            resizeMode: 'contain',
            height: 223,
            margin: 0,
            padding: 0,
          }}
        />
      </View>

      <View
        style={{
          marginHorizontal: 20,
          position: 'absolute',
          bottom: 140,
          alignSelf: 'center',
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 0,
        }}>
        <TouchableOpacity
          onPress={() => {
            sendProblemsFound(problemsFoundText);
          }}
          style={{
            // width: '100%',
            // height: 50,
            // backgroundColor: '#eff1f7',
            // borderWidth: 1,
            // borderColor: '#e5e5e5',
            // bottom: 0,
            // borderRadius: 5,
            // alignItems: 'center',
            // justifyContent: 'center',
            width: '100%',
            height: 50,
            backgroundColor: '#eff1f7',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            position: 'absolute',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            left: 0,
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
            Send to Jira
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProblemsFounds;
