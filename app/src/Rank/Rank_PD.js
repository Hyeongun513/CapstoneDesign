import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Link, router } from "expo-router";

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에) League

const Rank_PD = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_Code = 'https://api.football-data.org/v4/competitions/PD/standings';
    const fetchStandings = async () => {
      try {
        const response = await axios.get(API_Code, {
          headers: {
            'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',  // API 키 입력
          },
        });

        // standings 배열에 각 팀의 순위 정보가 담겨 있습니다.
        setStandings(response.data.standings[0].table);  // standings 배열 중 첫 번째 배열에 'table'이 있습니다.
        console.log(API_Code);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const Print_Rank = () => {
    return (
      <View>
        {/* 표 제목란 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { width: '10%' }]}>순위</Text>
          <Text style={[styles.headerText, { width: '50%' }]}>팀명</Text>
          <Text style={[styles.headerText, { width: '15%' }]}>경기수</Text>
          <Text style={[styles.headerText, { width: '10%' }]}>승점</Text>
          <Text style={[styles.headerText, { width: '15%' }]}>득실차</Text>
        </View>

        {/* 한줄씩 출력 */}
        {/* position:순위, team.name:팀명, points:승점, playedGames:경기수, goalDifference:골득실 */}
        <FlatList
          data={standings}
          keyExtractor={(item) => item.team.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.rankItem}>

              <View style={{ width: '10%', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.position}</Text>
              </View>
              <View style={{ width: '50%', flexDirection: 'row' }}>
                <Image
                  source={{ uri: item.team.crest }}  // 팀 로고 URL
                  style={styles.teamLogo}  // 스타일 지정
                />
                <Text style={{ fontSize: 16 }}>{item.team.name}</Text>
              </View>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16 }}>{item.playedGames}</Text>
              </View>
              <View style={{ width: '10%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.points}</Text>
              </View>
              <View style={{ width: '5%', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: 'gray' }}>{item.goalsFor}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>{item.goalsAgainst}</Text>
              </View>
              <View style={{ width: '10%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16 }}>{item.goalDifference}</Text>
              </View>

            </View>
          )}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
      </View>
    );
  };

  const Print_Button = () => {
    return (
      <View>
        <Text> ================================== </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{
            backgroundColor: "skyblue",
            width: 100,
            height: 30,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }} onPress={() => { router.replace('./Rank_Home') }}>
            <Text style={{ fontSize: 15 }}>메뉴화면</Text>
          </TouchableOpacity>
          <Text> 리그 : PD </Text>
        </View>
        <Text> ================================= </Text>
      </View>
    );
  };

  Print = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        {Print_Button()}
        {Print_Rank()}
      </View>
    );
  };

  return (
    Print()
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    // width: '20%',
    textAlign: 'center',
  },
  rankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuButton: {
    backgroundColor: 'skyblue',
    width: 100,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  teamColumn: {
    flexDirection: 'row',  // 팀명과 로고를 가로로 정렬
    alignItems: 'center',  // 수직 가운데 정렬
    width: '50%',
  },
  teamLogo: {
    width: 30,  // 로고 너비
    height: 30,  // 로고 높이
    marginRight: 10,  // 팀명과 로고 사이 여백
  },
  teamText: {
    fontSize: 16,
  },
});

export default Rank_PD;