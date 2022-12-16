import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import base64 from 'react-native-base64';
import {COLORS, SIZES} from '../styles/theme';
import {AuthContext} from '../context/AuthContext';

const SearchUser = ({navigation}: any) => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const {email, id, token} = useContext(AuthContext);

  useEffect(() => {
    const getUsers = async () => {
      const url = `https://etendoproject.atlassian.net/rest/api/2/user/assignable/search?project=INT&maxResults=200`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Basic ${base64
            .encode(`${email}:${token}`)
            .toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // .then(res => {
      //   console.log(res);
      // })
      // .catch(error => console.log(error));

      setUsers(result.data);
      setLoading(false);
    };

    getUsers();
  }, []);

  let filterActiveUsers = [];

  if (users) {
    for (let index = 0; index < users.length; index++) {
      if (users[index].active === true && users[index].accountId !== id) {
        filterActiveUsers.push({
          user: users[index].displayName,
          accountId: users[index].accountId,
          avatarUrl: users[index].avatarUrls['48x48'],
        });
      }
    }
  }

  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f9'}}>
      {loading ? (
        <ActivityIndicator
          size={50}
          color={COLORS.primary}
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : (
        <>
          <View
            style={{
              height: '7.5%',
              width: '100%',
              backgroundColor: COLORS.primary,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 25,
            }}>
            <View>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: 'Inter-Medium',
                  fontSize: SIZES.large,
                  textAlignVertical: 'center',
                }}>
                Let's find a User
              </Text>
            </View>

            <View>
              <Image
                source={require('../assets/images/more-users.png')}
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain',
                  tintColor: COLORS.white,
                }}
              />
            </View>
          </View>

          <View style={{marginTop: SIZES.font, marginHorizontal: 25}}>
            <View
              style={{
                width: '100%',
                borderRadius: SIZES.small,
                backgroundColor: '#dddff6',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: SIZES.font,
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
                placeholder="Search a User"
                placeholderTextColor={COLORS.primary}
                style={{flex: 1, color: COLORS.primary}}
                value={input}
                onChangeText={text => setInput(text)}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              margin: 25,
              flex: 0.95,
            }}>
            <FlatList
              data={filterActiveUsers}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                if (item.user.toLowerCase().includes(input.toLowerCase())) {
                  return (
                    <ScrollView>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('SearchedUserTasks', {
                            searchedUserDisplayName: item.user,
                            searchedUserId: item.accountId,
                          })
                        }
                        style={{marginVertical: 10}}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={{
                              uri: item.avatarUrl,
                            }}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                              marginRight: 10,
                              borderRadius: 50,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              color: COLORS.primary,
                            }}>
                            {item.user}
                          </Text>
                          <Text
                            style={{
                              borderColor: '#eff1f7',
                              borderWidth: 0.7,
                              height: 1,
                              marginTop: 5,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  );
                }
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchUser;

const styles = StyleSheet.create({
  textFriends: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
    color: '#202452',
  },
});
