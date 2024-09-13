import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link, router } from "expo-router"; 

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에) 

const Rank_League = (props) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [League, setLeague] = useState(props.League);

  useEffect(() => { // const API_Code_1 = 'https://api.football-data.org/v4/competitions/PL/standings';
    const API_Code = 'https://api.football-data.org/v4/competitions/PD/standings';
    const API_Code_1 = 'https://api.football-data.org/v4/competitions/';
    const API_League = League;
    const API_Code_2 = '/standings'
    const API_Code_All = API_Code_1 + API_League + API_Code_2;
    const fetchStandings = async () => {
      try {
        const response = await axios.get(API_Code_All, {
          headers: {
            'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',  // API 키 입력
          },
        });

        // standings 배열에 각 팀의 순위 정보가 담겨 있습니다.
        setStandings(response.data.standings[0].table);  // standings 배열 중 첫 번째 배열에 'table'이 있습니다.
        console.log(API_Code_All);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [League]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const Print_Rank = () => {
    return (
        <View>
        <FlatList
        data={standings}
        keyExtractor={(item) => item.team.id.toString()}  // 팀의 고유 ID를 key로 사용
        renderItem={({ item }) => (
            <View>
            <Text>Rank: {item.position}</Text>
            <Text>Team: {item.team.name}</Text>
            <Text>Points: {item.points}</Text>
            <Text>Played Games: {item.playedGames}</Text>
            <Text>Goal Difference: {item.goalDifference}</Text>
            <Text>---------------------------------</Text>
            </View>
        )}
        />
    </View>
    );
  };

  const Print_Button = () => {
    return (
        <View>
            <Text> ================================== </Text>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{
                    backgroundColor: "skyblue",
                    width: 100,
                    height: 30,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    }} onPress={() => { router.replace('./Rank_Home') }}>
                    <Text style={{fontSize: 15}}>메뉴화면</Text>
                </TouchableOpacity>
                <Text> 현재 LeagueState 값 : {League}</Text>
            </View>
            <Text> ================================= </Text>
        </View>
    );
};

Print = () => {
    const a = League;

    if (a == 0) {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor:'white'}}>
            {Print_Button()}
            </View>
        );
    } else if (a == 'PL') {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor:'white'}}>
            {Print_Button()}
            {Print_Rank()}
            </View>
        );
    } else if (a == 'BL1') {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor:'white'}}>
            {Print_Button()}
            {Print_Rank()}
            </View>
        );
    } else if (a == 'PD') {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor:'white'}}>
            {Print_Button()}
            {Print_Rank()}
            </View>
        );
    } else {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor:'white'}}>
                <Text> Error! </Text>
            </View>
        );
    };
};

  return (
    Print()
  );
};

export default Rank_League;