import React, {useEffect, useState} from 'react';
import {View, Image, StatusBar, Pressable, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './src/screens/Home';
import SpecificTask from './src/screens/SpecificTask';
import {COLORS} from './src/styles/theme';
import SearchUser from './src/screens/SearchUser';
import SearchedUserTasks from './src/screens/SearchedUserTasks';
import NextDayTasks from './src/screens/NextDayTasks';
import ProblemsFounds from './src/screens/ProblemsFounds';
import Login from './src/screens/Login';
import WorklogHistory from './src/screens/WorklogHistory';
import {AuthContext} from './src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const App = () => {
  const [email, setEmail] = useState<any>('');
  const [token, setToken] = useState<any>('');
  const [id, setId] = useState<any>('');
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const email = await AsyncStorage.getItem('EMAIL');
        const id = await AsyncStorage.getItem('ID');
        const token = await AsyncStorage.getItem('TOKEN');
        if (email !== null && id !== null && token !== null) {
          console.log(email, id, token);
          setEmail(email);
          setId(id);
          setToken(token);
          setUserLoggedIn(true);
        }
      } catch (e) {
        console.log('Error ', e);
      }
    };
    getCredentials();
  }, [userLoggedIn]);

  console.log(userLoggedIn);
  console.log(email, id, token);

  // Animated Tab Indicator

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        token,
        setToken,
        id,
        setId,
        userLoggedIn,
        setUserLoggedIn,
      }}>
      <NavigationContainer>
        <StatusBar animated={true} backgroundColor="#202452" />
        {!userLoggedIn ? (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarStyle: {
                backgroundColor: COLORS.secondary,
                position: 'absolute',
                height: 45,
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
                shadowColor: '#000',
                shadowOpacity: 0.07,
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                paddingHorizontal: 5,
              },
              tabBarHideOnKeyboard: true,
            }}
            initialRouteName="Login">
            <Tab.Screen
              name="Login"
              component={Login}
              options={{
                tabBarStyle: {display: 'none'},
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="SpecificTak"
              component={SpecificTask}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/home.png')}
                      style={{
                        width: 22,
                        resizeMode: 'contain',
                      }}
                    />
                  );
                },
              }}
            />
            <Tab.Screen
              name="NextDayTasks"
              component={NextDayTasks}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/next-day.png')}
                      style={{
                        width: 22,
                        resizeMode: 'contain',
                        tintColor: focused ? COLORS.primary : '#e5e5e5',
                      }}
                    />
                  );
                },
              }}
            />
            <Tab.Screen
              name="SearchUser"
              component={SearchUser}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="SearchedUserTasks"
              component={SearchedUserTasks}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="WorklogHistory"
              component={WorklogHistory}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: COLORS.primary,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}>
                      <Image
                        source={require('./src/assets/images/more.png')}
                        style={{
                          width: 23,
                          resizeMode: 'contain',
                          tintColor: focused ? COLORS.primary : '#e5e5e5',
                        }}
                      />
                    </View>
                  );
                },
              }}
            />
            <Tab.Screen
              name="ProblemsFound"
              component={ProblemsFounds}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/information.png')}
                      style={{
                        width: 22,
                        resizeMode: 'contain',
                        tintColor: focused ? COLORS.primary : '#e5e5e5',
                      }}
                    />
                  );
                },
              }}
            />
            <Tab.Screen
              name="CreateTask"
              component={Home}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/record.png')}
                      style={{width: 22, resizeMode: 'contain'}}
                    />
                  );
                },
              }}
            />
          </Tab.Navigator>
        ) : (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarStyle: {
                backgroundColor: COLORS.secondary,
                position: 'absolute',
                height: 45,

                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
                shadowColor: '#000',
                shadowOpacity: 0.07,
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                paddingHorizontal: 5,
              },
              tabBarHideOnKeyboard: true,
            }}
            initialRouteName="Home">
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/home.png')}
                      style={{
                        width: focused ? 24 : 22,
                        resizeMode: 'contain',
                        opacity: focused ? 1 : 0.65,
                      }}
                    />
                  );
                },
              }}
            />
            <Tab.Screen
              name="NextDayTasks"
              component={NextDayTasks}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/next-day.png')}
                      style={{
                        width: focused ? 24 : 22,
                        resizeMode: 'contain',
                        opacity: focused ? 1 : 0.65,
                      }}
                    />
                  );
                },
              }}
            />

            <Tab.Screen
              name="SearchUser"
              component={SearchUser}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />

            <Tab.Screen
              name="SpecificTask"
              component={SpecificTask}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="SearchedUserTasks"
              component={SearchedUserTasks}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="SpecificTak"
              component={SpecificTask}
              options={{
                tabBarButton: () => <View style={{width: 0, height: 0}} />,
              }}
            />
            <Tab.Screen
              name="CreateTask"
              component={Home}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Pressable
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: COLORS.primary,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}
                      onPress={() => {
                        ToastAndroid.show(
                          'The functionality to Create Task is not yet available',
                          ToastAndroid.SHORT,
                        );
                      }}>
                      <Image
                        source={require('./src/assets/images/more.png')}
                        style={{
                          width: 23,
                          tintColor: COLORS.white,
                          resizeMode: 'contain',
                        }}
                      />
                    </Pressable>
                  );
                },
              }}
            />
            <Tab.Screen
              name="ProblemsFound"
              component={ProblemsFounds}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/information.png')}
                      style={{
                        width: focused ? 24 : 22,
                        resizeMode: 'contain',
                        opacity: focused ? 1 : 0.65,
                      }}
                    />
                  );
                },
              }}
            />
            <Tab.Screen
              name="WorklogHistory"
              component={WorklogHistory}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Image
                      source={require('./src/assets/images/record.png')}
                      style={{
                        width: focused ? 24 : 22,
                        resizeMode: 'contain',
                        opacity: focused ? 1 : 0.65,
                      }}
                    />
                  );
                },
              }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
