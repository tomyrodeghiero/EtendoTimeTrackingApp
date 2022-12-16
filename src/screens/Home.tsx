import React, {useContext, useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import base64 from 'react-native-base64';
import axios from 'axios';

import {AuthContext} from '../context/AuthContext';

import {Task, HomeHeader} from '../components';
import FocusedStatusBar from '../components/FocusedStatusBar';

import {COLORS} from '../../src/styles/theme';
import {stylesHome} from '../styles/screens/Home';
import {useIsFocused} from '@react-navigation/native';

const Home = () => {
  const [assignedTasks, setAssignedTasks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimeWorked, setLoadingTimeWorked] = useState(true);
  const [tasksWorked, setTasksWorked] = useState<any>(undefined);

  const [currentTimeSpent, setCurrentTimeSpent] = useState<any>(null);

  const isFocused = useIsFocused();

  const {email, id, token} = useContext(AuthContext);

  const [input, setInput] = useState('');

  const TASKS_FOR_THE_NEXT_DAY = 'INT-5611';
  const PROBLEMS_FOUND = 'INT-5612';

  const DATE = new Date();
  let day = DATE.getDate();
  let month = DATE.getMonth() + 1;
  let year = DATE.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const [date, setDate] = useState<any>(new Date());
  const [fDate, setfDate] = useState(currentDate);

  // console.log('DATE', date);

  const tomorrow =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    (date.getDate() + 1);

  // console.log('Tomorrow', tomorrow);
  let tasksWorkedOnADate: any[] = [];

  const [timeWorkedToday, setTimeWorkedToday] = useState<any>(-1);

  let timesInTheTasksWorkedToday: any[] = [];

  useEffect(() => {
    const getAssignedTasks = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/3/search?jql=assignee=${id}+order+by+created`;
      const result: any = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setAssignedTasks(result.data.issues);
      setLoading(false);
    };

    getAssignedTasks();
  }, [isFocused]);

  useEffect(() => {
    const getTasksWorkedOnADate = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/3/search?jql=worklogDate >= ${fDate} AND worklogDate  < ${tomorrow} AND worklogAuthor=${id} AND issue not in (${TASKS_FOR_THE_NEXT_DAY}, ${PROBLEMS_FOUND})`;
      const result: any = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('taskworkded pre', tasksWorked);
      setTasksWorked(result.data);
      console.log('taskworkded post', tasksWorked);

      if (tasksWorked) {
        for (let index = 0; index < tasksWorked.issues.length; index++) {
          // console.log('TEST', tasksWorked);
          if (
            tasksWorked.issues[index].key !== TASKS_FOR_THE_NEXT_DAY &&
            tasksWorked.issues[index].key !== PROBLEMS_FOUND
          ) {
            tasksWorkedOnADate.push({
              keyTask: tasksWorked.issues[index].key,
            });
          }
        }
      }
      console.log('taskworkedonadate', tasksWorkedOnADate);
      const timeSpentCurrentDay = async () => {
        for (let index = 0; index < tasksWorkedOnADate.length; index++) {
          console.log(tasksWorkedOnADate[index].keyTask);
          const url = `https://etendoproject.atlassian.net/rest/api/3/issue/${tasksWorkedOnADate[index].keyTask}/worklog`;
          const result: any = await axios.get(url, {
            headers: {
              Authorization: `Basic ${base64
                .encode(`${email}:${token}`)
                .toString('base64')}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          let getTimeSpent = false;
          for (
            let index = result.data.worklogs.length - 1;
            index >= 0 && !getTimeSpent;
            index--
          ) {
            if (result.data.worklogs[index]?.author?.accountId === id) {
              console.log(
                'CURRENT TIME',
                result.data.worklogs[index].timeSpentSeconds,
              );
              timesInTheTasksWorkedToday.push(
                result.data.worklogs[index].timeSpentSeconds,
              );
              getTimeSpent = true;
            }
          }
        }
        setTimeWorkedToday(
          timesInTheTasksWorkedToday.reduce((a, b) => a + b, 0),
        );
        console.log('time worked today', timeWorkedToday);
        if (timeWorkedToday !== -1) {
          setLoadingTimeWorked(false);
        }
      };
      timeSpentCurrentDay();
    };
    getTasksWorkedOnADate();
  }, [assignedTasks, isFocused]);

  const convertSecondsToMinutesAndHours = (totalSeconds: any) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${hours}h ${minutes}m`;
  };

  let assignedActiveTasks: any[] = [];
  let assignedToDoTasks: any[] = [];
  let assignedDoneTasks: any[] = [];
  let assignedTasksInAnotherStatus: any[] = [];

  let firstAssignedTasks: any;
  if (assignedTasks) {
    firstAssignedTasks = {
      summary: assignedTasks[0].fields.summary,
      project: assignedTasks[0].fields.project.name,
      keyTask: assignedTasks[0].key,
      displayName: assignedTasks[0].fields.assignee.displayName,
      avatarUrl: assignedTasks[0].fields.assignee.avatarUrls['48x48'],
      taskStatus: assignedTasks[0].fields.status.statusCategory.name,
      timeOriginalEstimate: assignedTasks[0].fields.timeoriginalestimate,
      aggregateTime0riginalEstimate:
        assignedTasks[0].fields.aggregatetimeoriginalestimate,
    };

    for (let index = 0; index < assignedTasks.length; index++) {
      // console.log(
      //   'STATUS: ',
      //   assignedTasks[index].fields.status.statusCategory.name,
      // );
      if (
        assignedTasks[index].fields.status.statusCategory.name ===
          'In Progress' ||
        assignedTasks[index].fields.status.statusCategory.name === 'En curso'
      ) {
        assignedActiveTasks.push({
          summary: assignedTasks[index].fields.summary,
          project: assignedTasks[index].fields.project.name,
          keyTask: assignedTasks[index].key,
          displayName: assignedTasks[index].fields.assignee.displayName,
          avatarUrl: assignedTasks[index].fields.assignee.avatarUrls['48x48'],
          taskStatus: assignedTasks[index].fields.status.statusCategory.name,
          timeOriginalEstimate:
            assignedTasks[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            assignedTasks[index].fields.aggregatetimeoriginalestimate,
        });
      } else if (
        assignedTasks[index].fields.status.statusCategory.name === 'To Do' ||
        assignedTasks[index].fields.status.statusCategory.name === 'Por hacer'
      ) {
        assignedToDoTasks.push({
          summary: assignedTasks[index].fields.summary,
          project: assignedTasks[index].fields.project.name,
          keyTask: assignedTasks[index].key,
          displayName: assignedTasks[index].fields.assignee.displayName,
          avatarUrl: assignedTasks[index].fields.assignee.avatarUrls['48x48'],
          taskStatus: assignedTasks[index].fields.status.statusCategory.name,
          timeOriginalEstimate:
            assignedTasks[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            assignedTasks[index].fields.aggregatetimeoriginalestimate,
        });
      } else if (
        assignedTasks[index].fields.status.statusCategory.name === 'Done' ||
        assignedTasks[index].fields.status.statusCategory.name === 'Listo'
      ) {
        assignedDoneTasks.push({
          summary: assignedTasks[index].fields.summary,
          project: assignedTasks[index].fields.project.name,
          keyTask: assignedTasks[index].key,
          displayName: assignedTasks[index].fields.assignee.displayName,
          avatarUrl: assignedTasks[index].fields.assignee.avatarUrls['48x48'],
          taskStatus: assignedTasks[index].fields.status.statusCategory.name,
          timeOriginalEstimate:
            assignedTasks[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            assignedTasks[index].fields.aggregatetimeoriginalestimate,
        });
      } else {
        assignedTasksInAnotherStatus.push({
          summary: assignedTasks[index].fields.summary,
          project: assignedTasks[index].fields.project.name,
          keyTask: assignedTasks[index].key,
          displayName: assignedTasks[index].fields.assignee.displayName,
          avatarUrl: assignedTasks[index].fields.assignee.avatarUrls['48x48'],
          taskStatus: assignedTasks[index].fields.status.statusCategory.name,
          timeOriginalEstimate:
            assignedTasks[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            assignedTasks[index].fields.aggregatetimeoriginalestimate,
        });
      }
    }
  }

  const assignedTasksFilteredByStatus = assignedActiveTasks
    .concat(assignedToDoTasks)
    .concat(assignedDoneTasks)
    .concat(assignedTasksInAnotherStatus);

  // console.log('assignedTasksFilteredByStatus: ', assignedTasksFilteredByStatus);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      <FocusedStatusBar background={COLORS.primary} />
      {loading || loadingTimeWorked ? (
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={stylesHome.activityIndicator}
        />
      ) : (
        <>
          <HomeHeader
            timeWorkedToday={convertSecondsToMinutesAndHours(timeWorkedToday)}
            amountOfActiveTasks={assignedActiveTasks.length}
            avatarUrl={firstAssignedTasks.avatarUrl}
            displayName={firstAssignedTasks.displayName}
            input={input}
            onChangeInput={setInput}
          />
          <View style={stylesHome.taskListContainer}>
            <FlatList
              data={assignedTasksFilteredByStatus}
              keyExtractor={item => item.keyTask}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                if (
                  item.summary.toLowerCase().includes(input.toLowerCase()) ||
                  item.keyTask.toLowerCase().includes(input.toLowerCase())
                ) {
                  return <Task data={item} />;
                }
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
