import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Link, router } from "expo-router";

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에) 

const Rank_PL = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_Code = 'https://api.football-data.org/v4/competitions/PL/standings';
    const fetchStandings = async () => {
      try {
        const response = await axios.get(API_Code, {
          headers: {
            'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277', // API 키 입력
          },
        });

        // standings 배열에 각 팀의 순위 정보가 담겨 있음
        setStandings(response.data.standings[0].table); // standings 배열 중 첫 번째 배열에 'table'이 있음
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) return (
    <View style={{justifyContent: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );
  if (error) return <Text>Error: {error.message}</Text>;

  const Rank_Color = ( rank ) => { //챔스, 유로파, 강등 색상 출력
    if ( rank <= 4 ) {
      return <View style={{backgroundColor:'blue', width:5, height:30, marginLeft: -5}}/>
    } else if ( rank == 5 ) {
      return <View style={{backgroundColor:'orange', width:5, height:30, marginLeft: -5}}/>
    } else if ( rank >= 18 ) {
      return <View style={{backgroundColor:'red', width:5, height:30, marginLeft: -5}}/>
    } else {
      return <View style={{backgroundColor:'gray', width:5, height:30, marginLeft: -5}}/>
    }
  };

  const Print_Rank = () => {
    return (
      <View>
        {/* 표 제목란 */}
        <View style={styles.tableHeader}>
          <View style={{width:'1%'}}/>
          <Text style={[styles.headerText, { width: '10%' }]}>순위</Text>
          <Text style={[styles.headerText, { width: '50%' }]}>팀명</Text>
          <Text style={[styles.headerText, { width: '15%' }]}>경기수</Text>
          <Text style={[styles.headerText, { width: '10%' }]}>승점</Text>
          <Text style={[styles.headerText, { width: '15%' }]}>득실차</Text>
        </View>

        {/* 한줄씩 출력 */}
        <FlatList
          data={standings}
          keyExtractor={(item) => item.team.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.rankItem}
              // onPress={() => router.navigate('./TeamDetails', { teamId: item.team.id })}
              onPress={() => router.push(`../Team/TeamDetails?teamId=${item.team.id}&rank=${item.position}`)}
            >

            <View style={styles.rankItem}>

              <View style={{ width: '1%', alignItems: 'center', flexDirection: 'row'}}>
                {/* {item.position <= 4 ? <View style={{backgroundColor:'blue', width:5, height:30}}/> : <View style={{backgroundColor:'grey', width:5, height:30}}/>} */}
                {Rank_Color(item.position)}
              </View>
              <View style={{ width: '9%', alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {item.position} </Text>
              </View>
              <View style={{ width: '50%', flexDirection:'row' }}>
                <Image
                  source={{ uri: item.team.crest }}  // 팀 로고 URL
                  style={styles.teamLogo}  // 스타일 지정
                />
                <Text style={{ fontSize: 14, fontWeight: item.position == 1 ? 'bold' : '' }}>{item.team.name}</Text>
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
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      {Print_Rank()}
    </View>
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 3,
    borderTopColor: '#aaa',
    borderBottomWidth: 3,
    borderBottomColor: '#aaa',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
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
    flexDirection: 'row', 
    alignItems: 'center',
    width: '50%',
  },
  teamLogo: {
    width: 30,
    height: 30, 
    marginRight: 10,  // 팀명과 로고 사이 여백
  },
  teamText: {
    fontSize: 16,
  },
});

export default Rank_PL;


// position:순위
// team.name:팀명
// points:승점
// playedGames:경기수
// goalDifference:골득실
// goalsFor:득점
// goalsAgainst:실점
// won: 승리
// draw: 무승부
// lost: 패배
// form: 팀의 최근 경기 성적을 나타내는 문자열 (최근 경기의 승/패 기록)
// goalDifference: 팀의 득실차