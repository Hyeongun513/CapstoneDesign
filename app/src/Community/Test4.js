import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const LeaguesTest = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get(
          'https://api.football-data.org/v4/competitions',
          {
            headers: {
              'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277', // 자신의 API 키로 변경
            },
          }
        );
        // console.log("Competitions data:", response.data);
        setCompetitions(response.data.competitions);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return <Text>로딩중...</Text>;
  }

  return (
    <FlatList
      data={competitions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          {console.log('리그 이름 : ', item.name)}
        </View>
      )}
    />
  );
};

export default LeaguesTest;
