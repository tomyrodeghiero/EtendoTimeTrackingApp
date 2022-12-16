import {View} from 'react-native';
import React from 'react';

const getCircleColor = (statusTask: string) => {
  if (statusTask === 'In Progress' || statusTask === 'En curso') {
    return '#FBA643';
  } else if (statusTask === 'To Do' || statusTask === 'Por hacer') {
    return '#3E97FF';
  } else if (statusTask === 'Done' || statusTask === 'Listo') {
    return '#00B34C';
  } else {
    return '#F36A62';
  }
};

const Circle = ({statusTask}: any) => {
  return (
    <View
      style={{
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: getCircleColor(statusTask),
        borderWidth: 1,
        borderColor: '#202452',
      }}
    />
  );
};

export default Circle;
