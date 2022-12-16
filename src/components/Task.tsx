import React from 'react';
import {View, Text, Touchable, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {COLORS, SIZES, SHADOWS, FONTS} from '../styles/theme';

import Circle from '../components/Circle';

const Task = ({data}: any) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SpecificTask', {taskData: data})}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.smallBase,
        // marginBottom: SIZES.medium,
        margin: 7,
        ...SHADOWS.medium,
        marginHorizontal: 15,
      }}>
      <View
        style={{
          width: '100%',
          minHeight: 55,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <Circle statusTask={data.taskStatus} />
        <View style={{width: '70%'}}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: SIZES.small,
              marginHorizontal: 10,
              marginVertical: 5,
              color: COLORS.primary,
            }}>
            {data.summary}
          </Text>
        </View>

        <View
          style={{
            padding: 7,
            borderRadius: 7,
            borderWidth: 1,
            borderColor: '#D3D6E1',
            backgroundColor: '#EFF1F7',
          }}>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: SIZES.small,
            }}>
            {data.keyTask}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Task;
