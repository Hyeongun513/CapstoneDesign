import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
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
            headers: {
              'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
            },
          }
        );
        console.log("Matches data:", response.data);
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
    return <Text>오늘은 경기가 없습니다</Text>;
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          {/* 팀 로고와 경기 정보 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: `https://www.example.com/logos/${item.homeTeam.id}.png` }}
              style={{ width: 50, height: 50 }}
            />
            <Text>{`${item.homeTeam.name} vs ${item.awayTeam.name}`}</Text>
            {console.log(item.competition.name)}
          </View>

          {/* 리그 정보 */}
          <Text>{`League: ${item.competition.name}`}</Text>

          {/* 스코어 출력 */}
          <Text>{`Score: ${item.score.fullTime.homeTeam} - ${item.score.fullTime.awayTeam}`}</Text>
        </View>
      )}
    />
  );
};

export default Test2;