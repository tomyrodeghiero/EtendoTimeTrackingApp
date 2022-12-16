import {View, Text, useWindowDimensions, Image, StyleSheet} from 'react-native';
import React from 'react';

const OnboardingItem = ({item}: any) => {
  const width = useWindowDimensions();
  return (
    <View style={[styles.container, width]}>
      <Image
        source={item.image}
        style={[styles.image, width, {resizeMode: 'contain'}]}
      />

      <Image style={{flex: 0.3}}>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </Image>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {flex: 0.7, justifyContent: 'center'},
});
