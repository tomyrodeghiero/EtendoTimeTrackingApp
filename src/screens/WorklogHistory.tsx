import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Platform,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS} from '../styles/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import base64 from 'react-native-base64';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const WorklogHistory = () => {
  const navigation = useNavigation();

  const TASKS_FOR_THE_NEXT_DAY = 'INT-5611';
  const PROBLEMS_FOUND = 'INT-5612';

  const DATE = new Date();
  let day = DATE.getDate();
  let month = DATE.getMonth() + 1;
  let year = DATE.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  const isFocused = useIsFocused();

  const {email, id, token} = useContext(AuthContext);
  const [tasksWorked, setTasksWorked] = useState<any>(undefined);
  const [loading, setLoading] = useState<any>(true);
  const [date, setDate] = useState<any>(new Date());
  console.log('DATE', date);
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');
  const [fDate, setfDate] = useState(currentDate);
  const today = new Date();

  const tomorrow =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    (date.getDate() + 1);

  console.log('Tomorrow', tomorrow);

  console.log('fdate', fDate);
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

    let fTime =
      'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
    setText(fDate + ' - ' + fTime);

    console.log(fDate + ' (' + fTime + ')');
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  console.log('DATE', date);
  console.log('TOMORROW', tomorrow);
  let tasksWorkedOnADate: any[] = [];

  useEffect(() => {
    const getTasksWorkedOnADate = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/3/search?jql=worklogDate >=${fDate} AND worklogDate  < ${tomorrow} AND worklogAuthor=${id} AND issue not in (${TASKS_FOR_THE_NEXT_DAY}, ${PROBLEMS_FOUND})`;
      const result: any = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setTasksWorked(result.data);
      setLoading(false);
    };

    getTasksWorkedOnADate();
  }, [fDate, isFocused]);

  if (tasksWorked) {
    for (let index = 0; index < tasksWorked.issues.length; index++) {
      console.log('TEST', tasksWorked);
      if (
        tasksWorked.issues[index].key !== TASKS_FOR_THE_NEXT_DAY &&
        tasksWorked.issues[index].key !== PROBLEMS_FOUND
      ) {
        tasksWorkedOnADate.push({
          summary: tasksWorked.issues[index].fields.summary,
          project: tasksWorked.issues[index].fields.project.name,
          keyTask: tasksWorked.issues[index].key,
        });
      }
    }
  }

  console.log(tasksWorkedOnADate);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      <View>
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
      </View>
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
          Here, you can search the history of all your worklogs
        </Text>
      </View>

      <View
        style={{
          minHeight: '25%',
          backgroundColor: '#7182ff',
          maxHeight: '30%',
          padding: 15,
          borderRadius: 20,
          margin: 20,
        }}>
        <TouchableOpacity
          onPress={() => showMode('date')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../assets/images/back-calendar.png')}
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
              Tasks worked on {fDate}
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={tasksWorkedOnADate}
          keyExtractor={item => item.keyTask}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ScrollView>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  color: COLORS.white,
                  marginTop: 5,
                }}>
                💡 {item.keyTask} : {item.summary}
              </Text>
            </ScrollView>
          )}
        />
      </View>

      <View
        style={{
          marginHorizontal: 20,
          alignItems: 'center',
          marginVertical: 0,
          justifyContent: 'flex-start',
        }}>
        <Image
          source={require('../assets/images/worklog.png')}
          style={{width: 370, resizeMode: 'contain', height: 300}}
        />
      </View>
    </SafeAreaView>
  );
};

export default WorklogHistory;
