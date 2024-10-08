import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const MatchSchedule_SA = (props) => {
  const [matches, setMatches] = useState([]);

    // 날짜 설정
    // const date = '2024-09-01';
    const date = props.date;

  useEffect(() => {
    const getMatchesByDate = async () => {
      try {
        const response = await axios.get(`https://api.football-data.org/v4/competitions/2019/matches`, {
          headers: {
            'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
          },
          params: {
            dateFrom: date,
            dateTo: date,
          },
        });
        setMatches(response.data.matches);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    getMatchesByDate();
  }, [date]); //date값 변경시 useEffect 재실행

  const PrintMatch = ({ item }) => { //FlatList에서 자동으로 item 전달받음
    return (
      <View style={styles.matchItem}>
        <Text style={styles.team}>{item.homeTeam.name} {item.score.fullTime.home} vs {item.score.fullTime.away} {item.awayTeam.name}</Text>
        <Text style={styles.date}>{new Date(item.utcDate).toLocaleDateString()}  -  {new Date(item.utcDate).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <View style={{borderBottomWidth: 1, flexDirection:'row'}}>
        <Image
          source={require('../../../assets/icon/seria.png')} // assets에서 아이콘 불러오기
          style={{width: 30, height: 30}}
        />
        <Text style={{fontSize:20, color:'black', fontWeight:'bold', marginBottom:5}}> 세리에A </Text>
      </View>

      <View style={{justifyContent:'center', alignItems:'center'}}>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={PrintMatch}
          ListEmptyComponent = { () => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{date.slice(5,7)}월 {date.slice(8,10)}일에는 경기가 없습니다.</Text>
            </View>
          )}
        />
        <Text style={{color:'#000080'}}> {date} 경기일정 </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 20,
  },
  matchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  team: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#333333',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#ff0000',
  },
});

export default MatchSchedule_SA;


// 리그코드
// EPL : 2021
// 분데스 : 2002
// 세리에 : 2019
// 라리가 : 2014
// 리그앙 : 2015
// 챔스 : 2001