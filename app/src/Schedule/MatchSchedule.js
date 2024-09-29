import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link, router } from "expo-router";

const MatchSchedule = () => {
  const [matches, setMatches] = useState([]);

    // 9월 22일의 일정만 불러오기 위한 날짜 설정
    const date = '2024-09-21';

  useEffect(() => {
    const getMatchesByDate = async () => {
      try {
        const response = await axios.get(`https://api.football-data.org/v4/competitions/2021/matches`, {
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
  }, []);

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
      {/* <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.matchItem}>
            <Text style={styles.team}>{item.homeTeam.name} vs {item.awayTeam.name}</Text>
            <Text style={styles.date}>{new Date(item.utcDate).toLocaleDateString()} - {new Date(item.utcDate).toLocaleTimeString()}</Text>
          </View>
        )}
      /> */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={PrintMatch}
      />
      <TouchableOpacity style={{
        backgroundColor: "skyblue",
        width: 200,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
        }} onPress={() => { router.replace('../Menu'); }}>
        <Text style={{fontSize: 25}}>메뉴 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  matchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  team: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
});

export default MatchSchedule;