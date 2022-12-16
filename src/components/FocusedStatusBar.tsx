import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const FocusedStatusBar = (props: any) => {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar animated={true} {...props} /> : null;
};

export default FocusedStatusBar;
