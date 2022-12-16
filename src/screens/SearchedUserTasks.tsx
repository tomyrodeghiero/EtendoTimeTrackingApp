import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS, SIZES} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import base64 from 'react-native-base64';
import {Task} from '../components';
import {AuthContext} from '../context/AuthContext';

const SearchedUserTasks = ({route}: any) => {
  const {searchedUserDisplayName, searchedUserId} = route.params;
  const {email, token} = useContext(AuthContext);
  const [input, setInput] = useState('');

  const [tasksOfTheSearchedUser, setTasksOfTheSearchedUser] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTasksFromSearchedUser = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/3/search?jql=assignee=${searchedUserId}+order+by+created`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setTasksOfTheSearchedUser(result.data);
      setLoading(false);
    };

    getTasksFromSearchedUser();
  }, [searchedUserId]);

  let assignedActiveUserTasks: any[] = [];
  let assignedToDoUserTasks: any[] = [];
  let assignedDoneUserTasks: any[] = [];
  let assignedUserTasksInAnotherStatus: any[] = [];

  let firstAssignedTasks: any;
  if (tasksOfTheSearchedUser) {
    firstAssignedTasks = {
      summary: tasksOfTheSearchedUser.issues[0].fields.summary,
      project: tasksOfTheSearchedUser.issues[0].fields.project.name,
      keyTask: tasksOfTheSearchedUser.issues[0].key,
      displayName: tasksOfTheSearchedUser.issues[0].fields.assignee.displayName,
      avatarUrl:
        tasksOfTheSearchedUser.issues[0].fields.assignee.avatarUrls['48x48'],
      taskStatus:
        tasksOfTheSearchedUser.issues[0].fields.status.statusCategory.name,
      timeOriginalEstimate:
        tasksOfTheSearchedUser.issues[0].fields.timeoriginalestimate,
      aggregateTime0riginalEstimate:
        tasksOfTheSearchedUser.issues[0].fields.aggregatetimeoriginalestimate,
    };

    for (let index = 0; index < tasksOfTheSearchedUser.issues.length; index++) {
      if (
        tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
          .name === 'In Progress' ||
        tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
          .name === 'En curso'
      ) {
        assignedActiveUserTasks.push({
          summary: tasksOfTheSearchedUser.issues[index].fields.summary,
          project: tasksOfTheSearchedUser.issues[index].fields.project.name,
          keyTask: tasksOfTheSearchedUser.issues[index].key,
          displayName:
            tasksOfTheSearchedUser.issues[index].fields.assignee.displayName,
          avatarUrl:
            tasksOfTheSearchedUser.issues[index].fields.assignee.avatarUrls[
              '48x48'
            ],
          taskStatus:
            tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
              .name,
          timeOriginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields
              .aggregatetimeoriginalestimate,
        });
      } else if (
        tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
          .name === 'To Do'
      ) {
        assignedToDoUserTasks.push({
          summary: tasksOfTheSearchedUser.issues[index].fields.summary,
          project: tasksOfTheSearchedUser.issues[index].fields.project.name,
          keyTask: tasksOfTheSearchedUser.issues[index].key,
          displayName:
            tasksOfTheSearchedUser.issues[index].fields.assignee.displayName,
          avatarUrl:
            tasksOfTheSearchedUser.issues[index].fields.assignee.avatarUrls[
              '48x48'
            ],
          taskStatus:
            tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
              .name,
          timeOriginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields
              .aggregatetimeoriginalestimate,
        });
      } else if (
        tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
          .name === 'Done' ||
        tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
          .name === 'Listo'
      ) {
        assignedDoneUserTasks.push({
          summary: tasksOfTheSearchedUser.issues[index].fields.summary,
          project: tasksOfTheSearchedUser.issues[index].fields.project.name,
          keyTask: tasksOfTheSearchedUser.issues[index].key,
          displayName:
            tasksOfTheSearchedUser.issues[index].fields.assignee.displayName,
          avatarUrl:
            tasksOfTheSearchedUser.issues[index].fields.assignee.avatarUrls[
              '48x48'
            ],
          taskStatus:
            tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
              .name,
          timeOriginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields
              .aggregatetimeoriginalestimate,
        });
      } else {
        assignedUserTasksInAnotherStatus.push({
          summary: tasksOfTheSearchedUser.issues[index].fields.summary,
          project: tasksOfTheSearchedUser.issues[index].fields.project.name,
          keyTask: tasksOfTheSearchedUser.issues[index].key,
          displayName:
            tasksOfTheSearchedUser.issues[index].fields.assignee.displayName,
          avatarUrl:
            tasksOfTheSearchedUser.issues[index].fields.assignee.avatarUrls[
              '48x48'
            ],
          taskStatus:
            tasksOfTheSearchedUser.issues[index].fields.status.statusCategory
              .name,
          timeOriginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields.timeoriginalestimate,
          aggregateTime0riginalEstimate:
            tasksOfTheSearchedUser.issues[index].fields
              .aggregatetimeoriginalestimate,
        });
      }
    }
  }

  const assignedUserTasksFilteredByStatus = assignedActiveUserTasks
    .concat(assignedToDoUserTasks)
    .concat(assignedUserTasksInAnotherStatus)
    .concat(assignedDoneUserTasks);

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      {loading ? (
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : (
        <>
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

              <View style={{width: 45, height: 45}}>
                <Image
                  source={{
                    uri: firstAssignedTasks.avatarUrl,
                  }}
                  resizeMode="contain"
                  style={{width: '80%', height: '80%', borderRadius: 50}}
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
                Hi! I'm {searchedUserDisplayName.split(' ')[0]} 👋
              </Text>

              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  fontSize: SIZES.large,
                  color: COLORS.white,
                  marginTop: SIZES.base / 2,
                }}>
                I currently have {assignedActiveUserTasks.length} tasks In
                Progress
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
                  style={{flex: 1, color: COLORS.primary}}
                  value={input}
                  onChangeText={text => setInput(text)}
                />
              </View>
            </View>
          </View>

          <View style={{flex: 0.9, backgroundColor: '#e5ef7ed'}}>
            <FlatList
              data={assignedUserTasksFilteredByStatus}
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
    </View>
  );
};

export default SearchedUserTasks;
