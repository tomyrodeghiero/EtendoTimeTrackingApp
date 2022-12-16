import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import base64 from 'react-native-base64';

import {AuthContext} from '../context/AuthContext';

import Circle from '../components/Circle';

import {COLORS, SIZES} from '../styles/theme';
import {stylesNextDayTasks} from '../styles/screens/NextDayTasks';

const NextDayTasks = () => {
  const TASKS_FOR_THE_NEXT_DAY = 'INT-5611';
  const navigation = useNavigation();

  const [assignedTasks, setAssignedTasks] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const {email, token, id} = useContext(AuthContext);

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
  }, []);

  let assignedActiveTasks: any[] = [];
  let assignedToDoTasks: any[] = [];
  let assignedDoneTasks: any[] = [];
  let assignedTasksInAnotherStatus: any[] = [];

  if (assignedTasks) {
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
    .concat(assignedTasksInAnotherStatus);

  const sendTasksForTheNextDay = (tasks: any) => {
    let taskForTheNextDayInText: string = '';
    for (let index = 0; index < tasks.length; index++) {
      taskForTheNextDayInText += `${index + 1}. ${tasks[index].keyTask} - ${
        tasks[index].summary
      }.\n`;
    }

    axios
      .post(
        `https://etendoproject.atlassian.net/rest/api/3/issue/${TASKS_FOR_THE_NEXT_DAY}/worklog`,
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
                    text: taskForTheNextDayInText,
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
        navigation.navigate('ProblemsFound');
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show(
          'Some error has occurred. Your information has not been sent to Jira',
          ToastAndroid.SHORT,
        );
      });
  };

  const [selectedTasksForTheNextDay, setSelectedTasksForTheNextDay] =
    useState<any>([]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      {loading ? (
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={stylesNextDayTasks.activityIndicator}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={stylesNextDayTasks.backButton}>
            <Image
              source={require('../assets/images/back.png')}
              style={stylesNextDayTasks.backArrowImage}
            />
          </TouchableOpacity>

          <View style={stylesNextDayTasks.titleContainer}>
            <Text style={stylesNextDayTasks.titleContainerText}>
              What tasks will you work on the next day?
            </Text>
          </View>

          <View style={stylesNextDayTasks.taskListContainer}>
            <FlatList
              data={assignedTasksFilteredByStatus}
              keyExtractor={item => item.keyTask}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <ScrollView>
                  <TouchableOpacity
                    onPress={() => {
                      selectedTasksForTheNextDay.findIndex(
                        (object: any) => object.keyTask === item.keyTask,
                      ) === -1
                        ? setSelectedTasksForTheNextDay([
                            ...selectedTasksForTheNextDay,
                            {
                              taskUrl: `"https://etendoproject.atlassian.net/browse/${item.keyTask}"`,
                              keyTask: item.keyTask,
                              summary: item.summary,
                            },
                          ])
                        : setSelectedTasksForTheNextDay((currentArray: any) =>
                            currentArray.filter(
                              (task: any) => task.keyTask !== item.keyTask,
                            ),
                          );
                      console.log(selectedTasksForTheNextDay);
                    }}
                    style={stylesNextDayTasks.taskContainer}>
                    <View style={stylesNextDayTasks.taskTextContainer}>
                      <Circle statusTask={item.taskStatus} />
                      <View style={{width: '70%'}}>
                        <Text style={stylesNextDayTasks.taskText}>
                          {item.summary}
                        </Text>
                      </View>

                      <View style={stylesNextDayTasks.keyTaskContainer}>
                        <Text style={stylesNextDayTasks.keyTaskText}>
                          {item.keyTask}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}
            />
          </View>

          <View style={stylesNextDayTasks.nextDayTaskListContainer}>
            <View style={stylesNextDayTasks.nextDayTaskListTitleSection}>
              <View style={stylesNextDayTasks.singleTaskContainer}>
                <Image
                  source={require('../assets/images/to-do-list.png')}
                  style={stylesNextDayTasks.nextDayTaskListImage}
                />
                <Text style={stylesNextDayTasks.textTitleTaskListNextDay}>
                  Tasks for the next day
                </Text>
              </View>
            </View>

            <FlatList
              data={selectedTasksForTheNextDay}
              keyExtractor={item => item.keyTask}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <ScrollView>
                  <Text style={stylesNextDayTasks.textSingleNextDayTask}>
                    💡 {item.keyTask}: {item.summary}
                  </Text>
                </ScrollView>
              )}
            />
          </View>

          <View
            style={{
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
                if (selectedTasksForTheNextDay.length !== 0) {
                  sendTasksForTheNextDay(selectedTasksForTheNextDay);
                } else {
                  ToastAndroid.show(
                    'Please, select tasks for your next work day',
                    ToastAndroid.SHORT,
                  );
                }
              }}
              style={stylesNextDayTasks.jiraButtonContainer}>
              <Image
                source={require('../assets/images/jira.png')}
                style={stylesNextDayTasks.imageJira}
              />
              <Text style={stylesNextDayTasks.jiraButtonText}>
                Send to Jira
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default NextDayTasks;
