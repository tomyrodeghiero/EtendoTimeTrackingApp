import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';

import {COLORS, FONTS, SIZES} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const HomeHeader = ({
  timeWorkedToday,
  amountOfActiveTasks,
  displayName,
  avatarUrl,
  input,
  onChangeInput,
}: any) => {
  const navigation: any = useNavigation();
  const {email, id, token} = useContext(AuthContext);
  console.log(input);

  return (
    <View style={{backgroundColor: COLORS.primary, padding: SIZES.font}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../src/assets/images/white-etendo-logo.png')}
          resizeMode="contain"
          style={{width: 90, height: 25}}
        />
        <Image
          source={require('../../src/assets/images/time-and-calendar.png')}
          resizeMode="contain"
          style={{
            width: 90,
            height: 25,
            tintColor: COLORS.white,
            marginLeft: 40,
          }}
        />
        <Text
          style={{
            position: 'absolute',
            right: '17.5%',
            flexDirection: 'row',
            fontFamily: 'Inter-Medium',
            fontWeight: '500',
            color: COLORS.white,
            paddingVertical: 2.5,
            paddingHorizontal: 5,
            zIndex: 50,
          }}>
          {timeWorkedToday}
        </Text>

        <View style={{width: 45, height: 45}}>
          <Image
            source={{
              uri: !!avatarUrl ? avatarUrl : 'image.png',
            }}
            resizeMode="contain"
            style={{width: '80%', height: '80%', borderRadius: 50}}
          />
          <Image
            source={require('../../src/assets/images/badge.png')}
            resizeMode="contain"
            style={{
              position: 'absolute',
              width: 15,
              height: 15,
              bottom: 7,
              right: 7,
            }}
          />
        </View>
      </View>

      <View style={{marginVertical: SIZES.smallBase}}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: SIZES.small,
            color: COLORS.white,
          }}>
          Hello, {displayName.split(' ')[0]}! 👋
        </Text>

        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: SIZES.large,
            color: COLORS.white,
            marginTop: SIZES.base / 2,
          }}>
          You've got {amountOfActiveTasks} tasks In Progress
        </Text>
      </View>

      <View style={{marginTop: SIZES.font}}>
        <View
          style={{
            width: '100%',
            borderRadius: SIZES.small,
            backgroundColor: '#dddff6',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.smallBase,
          }}>
          <Image
            source={require('../../src/assets/images/search.png')}
            resizeMode="contain"
            style={{
              tintColor: COLORS.primary,
              width: 20,
              height: 20,
              marginRight: SIZES.base,
            }}
          />
          <TextInput
            placeholder="Search Task"
            placeholderTextColor={COLORS.primary}
            style={{flex: 1, color: '#000'}}
            value={input}
            onChangeText={onChangeInput}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchUser', {
                email: email,
                token: token,
              })
            }>
            <Image
              source={require('../../src/assets/images/search-user.png')}
              resizeMode="contain"
              style={{
                tintColor: COLORS.primary,
                width: 25,
                height: 25,
                marginRight: SIZES.base,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
