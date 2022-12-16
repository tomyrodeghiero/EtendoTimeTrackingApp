import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import base64 from 'react-native-base64';
import {COLORS, SIZES} from '../styles/theme';
import {Dropdown} from 'react-native-element-dropdown';
import {AuthContext} from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {stylesSpecificTask} from '../styles/screens/SpecificTask';

const SpecificTask = ({route}: any) => {
  const {taskData} = route.params;
  const navigation = useNavigation();
  const {email, token} = useContext(AuthContext);

  // States
  const [text, setText] = useState('0h 0m');
  const [taskTimeTracking, setTaskTimeTracking] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [textTask, setTextTask] = useState('');
  const [date, setDate] = useState(new Date(2022, 1, 0, 0, 0, 0, 0));
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);

  // Constants
  const DATE = new Date();
  let day = DATE.getDate();
  let month = DATE.getMonth() + 1;
  let year = DATE.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const [fDate, setfDate] = useState(currentDate);

  useEffect(() => {
    const getTaskTimeTracking = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/3/issue/${taskData.keyTask}`;
      const result: any = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setTaskTimeTracking(result.data.fields.timetracking.originalEstimate);
      setLoading(false);
    };

    setTextTask('');
    setText('0h 0m');
    getTaskTimeTracking();
  }, [taskData.keyTask]);

  // Functions
  const addWorklog = (time: any, comment: any) => {
    axios
      .post(
        `https://etendoproject.atlassian.net/rest/api/3/issue/${taskData.keyTask}/worklog`,
        {
          timeSpentSeconds: time,
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
        navigation.goBack();
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show(
          'Some error has occurred. Your information has not been sent to Jira',
          ToastAndroid.SHORT,
        );
      });
  };

  const convertHoursToSeconds = (hours: any) => {
    return hours * 60 * 60;
  };

  const convertMinutesToSeconds = (minutes: any) => {
    return minutes * 60;
  };

  const convertHoursAndMinutesToSeconds = (hours: any, minutes: any) => {
    return convertHoursToSeconds(hours) + convertMinutesToSeconds(minutes);
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    setfDate(
      tempDate.getFullYear() +
        '-' +
        (tempDate.getMonth() + 1) +
        '-' +
        tempDate.getDate(),
    );

    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm';
    setText(fTime);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <SafeAreaView style={stylesSpecificTask.container}>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {loading ? (
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={stylesSpecificTask.activityIndicator}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={stylesSpecificTask.backButtonContainer}>
            <Image
              source={require('../assets/images/back.png')}
              style={stylesSpecificTask.backButtonImage}
            />
          </TouchableOpacity>

          <View style={stylesSpecificTask.titleSection}>
            <Text style={stylesSpecificTask.titleSectionText}>
              {taskData.project}
            </Text>
            <View style={stylesSpecificTask.keyTaskSection}>
              <Image
                source={require('../assets/images/key.png')}
                style={stylesSpecificTask.keyTaskImage}
              />
              <Text style={stylesSpecificTask.keyTaskText}>
                {taskData.keyTask}
              </Text>
            </View>
          </View>

          <View style={stylesSpecificTask.taskDescriptionContainer}>
            <View style={stylesSpecificTask.taskDescriptionTitleSection}>
              <View style={stylesSpecificTask.taskDescriptionTitleLeftSection}>
                <Image
                  source={require('../assets/images/calendar-secundary.png')}
                  style={stylesSpecificTask.calendarImage}
                />
              </View>

              <TouchableOpacity
                style={stylesSpecificTask.sectionTimeWorkedTask}
                onPress={() => showMode('time')}>
                <Image
                  source={require('../assets/images/time.png')}
                  style={stylesSpecificTask.timeImage}
                />
                <Text style={stylesSpecificTask.textTimeWorkedTask}>
                  {text}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={stylesSpecificTask.taskDescriptionTitleLeft}>
              {taskData.summary}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={stylesSpecificTask.inputTaskDescription}
                placeholderTextColor="#e5e5e5"
                underlineColorAndroid="transparent"
                placeholder="Task description"
                multiline={true}
                onChangeText={setTextTask}
                defaultValue={textTask}
              />
            </ScrollView>
          </View>

          <View style={stylesSpecificTask.taskEstimatedTimeSection}>
            <View style={stylesSpecificTask.taskEstimatedTimeContent}>
              <View style={stylesSpecificTask.taskEstimatedTitleSection}>
                <Image
                  source={require('../assets/images/calendar.png')}
                  style={stylesSpecificTask.taskEstimatedCalendarImage}
                />
                <Text style={stylesSpecificTask.taskEstimatedTitleText}>
                  Estimated time
                </Text>
              </View>
            </View>
            <Text style={stylesSpecificTask.taskEstimatedDescriptionText}>
              {taskTimeTracking
                ? `For this task I have estimated ${taskTimeTracking} of work`
                : `I have not yet estimated a time frame for this task.`}
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 20,
              position: 'absolute',
              bottom: 140,
              alignSelf: 'center',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (date.getHours() !== 0 || date.getMinutes() !== 0) {
                  if (textTask !== '') {
                    addWorklog(
                      convertHoursAndMinutesToSeconds(
                        date.getHours(),
                        date.getMinutes(),
                      ),
                      textTask,
                    );
                  } else {
                    ToastAndroid.show(
                      'Please enter a description of the task on which you have worked',
                      ToastAndroid.SHORT,
                    );
                  }
                } else {
                  ToastAndroid.show(
                    'Please enter your time worked in this task',
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
        </>
      )}
    </SafeAreaView>
  );
};

export default SpecificTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202452',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#e5e5e5',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
