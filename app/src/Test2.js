import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const Test2 = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          'https://api.football-data.org/v4/matches',
          {
            // params: {
            //   dateFrom: '2024-11-02', // 오늘 날짜로 변경
            //   dateTo: '2024-11-02',
            // },
            headers: {
              'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
            },
          }
        );
        console.log("Matches data:", response.data); // 응답 데이터를 출력하여 확인
        setMatches(response.data.matches);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <Text>로딩중...</Text>;
  }

  if (matches.length === 0) {
    return <Text>오늘은 경기가 없습니다</Text>; // 매치가 없을 때 출력
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{`${item.homeTeam.name} vs ${item.awayTeam.name}`}</Text>
        </View>
      )}
    />
  );
};

export default Test2;