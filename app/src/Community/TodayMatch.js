import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const TodayMatch = (props) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const Component = props.Component;

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
        // console.log("Matches data:", response.data);
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
  const printLogo = (leagueName) => {
    switch (leagueName) {
      case '프리미어리그':
        return require('../../../assets/icon/프리미어리그.png');
      case '분데스리가':
        return require('../../../assets/icon/분데스리가.png');
      case '세리에 A':
        return require('../../../assets/icon/세리에 A.png');
      case '라리가':
        return require('../../../assets/icon/라리가.png');
      case '리그 1':
        return require('../../../assets/icon/리그 1.png');
      case '챔피언스리그':
        return require('../../../assets/icon/챔피언스리그.png');
    }
  }

  // 리그별 FlatList를 출력하는 함수
  const printMatches = (leagueName, matchesData) => (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>{leagueName}</Text> */}
      <View style={{borderBottomWidth: Component == 'NicknameMenu' ? 2 : 1, flexDirection:'row'}}>
        <Image
          source={printLogo(leagueName)} // assets에서 아이콘 불러오기
          style={{width: Component == 'NicknameMenu' ? 30 : 20, height: Component == 'NicknameMenu' ? 30 : 20}}
        />
        
        <Text style={{fontSize: Component == 'NicknameMenu' ? 20 : 15, color:'black', fontWeight:'bold', marginBottom:5}}> {leagueName} </Text>
      </View>
      <FlatList
        data={matchesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.matchItem}>
              {/* <Image
                source={{ uri: `https://crests.football-data.org/${item.homeTeam.id}.svg` }}
                style={{ width: 50, height: 50 }}
              /> */}
              <Text style={[styles.team, {fontSize: Component == 'NicknameMenu' ? 16 : 13}]}>{`${item.homeTeam.name} ${item.score.fullTime.homeTeam || ''} vs ${item.score.fullTime.awayTeam || ''} ${item.awayTeam.name}`}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent = { () => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {fontSize : Component == 'NicknameMenu' ? 16 : 13}]}> 오늘 경기가 없습니다.</Text>
          </View>
        )}
      />
    </View>
  );
//Component
  return (
    <View style={[styles.bigContainer, {width: Component == 'NicknameMenu' ? '95%' : '98%', height: Component == 'NicknameMenu' ? 240 : 125}]}>
      {/* 리그별로 출력 */}
      <View style={{borderBottomWidth: Component == 'NicknameMenu' ? 2 : 1.5, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: Component == 'NicknameMenu' ? 20 : 15, fontWeight: 'bold', marginTop: -5}}>오늘의 주요 경기</Text>
      </View>
      <FlatList 
        data={[]}
        renderItem={null}
        ListEmptyComponent = { () => (
          <View>
          {printMatches('챔피언스리그', matches.filter(item => item.competition.name === 'UEFA Champions League'))}
          {printMatches('프리미어리그', matches.filter(item => item.competition.name === 'Premier League'))}
          {printMatches('라리가', matches.filter(item => item.competition.name === 'Primera Division'))}
          {printMatches('분데스리가', matches.filter(item => item.competition.name === 'Bundesliga'))}
          {printMatches('세리에 A', matches.filter(item => item.competition.name === 'Campeonato Brasileiro Série A'))}
          {printMatches('리그 1', matches.filter(item => item.competition.name === 'Ligue 1'))}
          </View>
        )}
      />
    </View>
  );
};
export default TodayMatch;

const styles = StyleSheet.create({
  bigContainer: {
    // flex: 1,
    // width: '95%', //'98%'
    // height: 145, //125 ,240
    padding: 10,
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
    // borderColor: '#4682B4', // 외곽선 색상
  },
  container: {
    padding: 10,
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 30,
    margin: 1,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1, // 외곽선 두께
    // borderColor: '#4682B4', // 외곽선 색상
  },
  matchItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  team: {
    // fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#333333',
  },
  emptyContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    // fontSize: 16,
    color: '#ff0000',
    marginBottom: -7,
  },
});

// EPL : Premier League
// 라리가 : Primera Division
// 분데스 : Bundesliga
// 세리에 : Campeonato Brasileiro Série A
// 리그 1 : Ligue 1
// 챔스 : UEFA Champions League