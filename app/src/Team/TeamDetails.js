import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { Link, router, useLocalSearchParams } from "expo-router";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator(); //하단 메뉴 버튼

const TeamDetails = () => {
    const { teamId } = useLocalSearchParams();  // URL에서 teamId 파라미터를 가져옴
    console.log("Received teamId:", teamId);

    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [squad, setSquad] = useState([]);
    const [squad, setSquad] = useState({
        goalkeepers: [],
        defenders: [],
        midfielders: [],
        forwards: []
    });
    const [upcomingMatch, setUpcomingMatch] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await axios.get(`https://api.football-data.org/v4/teams/${teamId}`, {
                    headers: {
                        'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
                    },
                });
                setTeamInfo(response.data);
                classifySquad(response.data.squad); // 팀 스쿼드를 분류하는 함수 호출(response.data.squad);  // 팀 스쿼드 설정
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchMatches = async () => {
            try {
                const response = await axios.get(`https://api.football-data.org/v4/teams/${teamId}/matches`, {
                    headers: {
                        'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
                    },
                });
                console.log(response.data); // 응답 구조 확인을 위한 로그

                // const scheduledMatches = response.data.matches.filter(match => match.status === "SCHEDULED");
                const scheduledMatches = response.data.matches.filter( // SCHEDULED 또는 TIMED 상태의 경기 필터링
                    match => match.status === "SCHEDULED" || match.status === "TIMED" //끝난 경기는 "FINISHED", 인접 경기(?)는 "TIMED", 먼 경기는 "SCHEDULED"
                );
                const finishedMatches = response.data.matches.filter(match => match.status === "FINISHED");
                // console.log(scheduledMatches);

                // 일정이 가까운 경기부터 먼 경기 순으로 정렬
                scheduledMatches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
                
                if (scheduledMatches.length > 0) {
                    setUpcomingMatch(scheduledMatches[0]);  // 다음 경기 일정
                }
                setRecentMatches(finishedMatches.slice(0, 5));  // 최근 5경기 결과

                // console.log(finishedMatches.slice(0, 5)); // 전체 응답 로그
                // finishedMatches.forEach(match => {
                //     console.log(match.score.fullTime); // fullTime 스코어 로그 확인
                // });

            } catch (err) {
                setError(err);
            }
        };

        fetchTeamDetails();
        fetchMatches();
    }, [teamId]);

    const classifySquad = (squad) => { // 포지션을 분류하는 함수
        const goalkeepers = [];
        const defenders = [];
        const midfielders = [];
        const forwards = [];

        squad.forEach(player => {
            if (player.position.includes('Goalkeeper')) {
                goalkeepers.push(player);
            } else if (player.position.includes('Back')) {
                defenders.push(player);
            } else if (player.position.includes('Midfield')) {
                midfielders.push(player);
            } else if (player.position.includes('Winger') || player.position.includes('Forward')) {
                forwards.push(player);
            }
        });

        setSquad({ goalkeepers, defenders, midfielders, forwards });
    };


    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const Print_Info = () => { //팀 기본정보 출력
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Image 
                    source={{ uri: teamInfo.crest }} 
                    style={styles.logo} 
                />
                <Text style={styles.title}>{teamInfo.name}</Text>
                <Text>창단 연도: {teamInfo.founded}</Text>
                <Text>경기장: {teamInfo.venue}</Text>
                <Text>클럽 색상: {teamInfo.clubColors}</Text>
                <Text>팀 주소: {teamInfo.address}</Text>
                <Text onPress={() => Linking.openURL(teamInfo.website)} style={{fontWeight:'bold', color:'yellow'}}>공식 웹사이트(클릭)</Text>
            </View>
        )
    };

    const Print_Squad = () => { //팀 기본 스쿼드 출력
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.sectionTitle}>골키퍼</Text>
                {squad.goalkeepers.map((player) => (
                    <View key={player.id} style={styles.squadItem}>
                        <Text>{player.name} ({player.nationality})</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>수비수</Text>
                {squad.defenders.map((player) => (
                    <View key={player.id} style={styles.squadItem}>
                        <Text>{player.name} ({player.nationality})</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>미드필더</Text>
                {squad.midfielders.map((player) => (
                    <View key={player.id} style={styles.squadItem}>
                        <Text>{player.name} ({player.nationality})</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>공격수</Text>
                {squad.forwards.map((player) => (
                    <View key={player.id} style={styles.squadItem}>
                        <Text>{player.name} ({player.nationality})</Text>
                    </View>
                ))}
            </ScrollView>
        )
    };

    Print_Schedule = () => {
        return (
            <View>
                {upcomingMatch && (
                    <View>
                        <Text style={styles.sectionTitle}>다음 경기</Text>
                        <Text>{upcomingMatch.homeTeam.name} vs {upcomingMatch.awayTeam.name}</Text>
                        <Text>Date: {new Date(upcomingMatch.utcDate).toLocaleDateString()}</Text>
                    </View>
                )}
            <Text style={styles.sectionTitle}>최근 5경기 결과</Text>
            <FlatList
                data={recentMatches}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.matchItem}>
                        <Text>{item.homeTeam.name} {item.score.fullTime.home} - {item.score.fullTime.away} {item.awayTeam.name}</Text>
                        <Text>Date: {new Date(item.utcDate).toLocaleDateString()}</Text>
                    </View>
                )}
            />
            </View>
        )
    }

    return (
        <Tab.Navigator
            initialRouteName="Info"
            screenOptions={{
                tabBarStyle: { 
                    backgroundColor: 'lightgray', // 탭 배경색
                    borderTopWidth: 2, // 구분선 굵기
                    borderTopColor: 'gray', // 구분선 색상
                },
                tabBarLabelStyle: {
                    fontSize: 14, // 폰트 크기
                    fontWeight: 'bold', // 폰트 굵기
                },
                tabBarActiveTintColor: 'blue', // 선택된 탭 글씨 색
                tabBarInactiveTintColor: 'gray', // 선택되지 않은 탭 글씨 색
            }}
        >
        <Tab.Screen
                name="Info"
                component={Print_Info}
                options={{
                    tabBarLabel: '팀정보',
                    headerShown: false, //상단 헤더(제목) 숨김
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/icon/Info.png')} // assets에서 아이콘 불러오기
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? 'blue' : 'gray'
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Squad"
                component={Print_Squad}
                options={{
                    tabBarLabel: '스쿼드',
                    headerShown: false, //상단 헤더(제목) 숨김
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/icon/Squad.png')} // assets에서 아이콘 불러오기
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? 'blue' : 'gray'
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Schedule"
                component={Print_Schedule}
                options={{
                    tabBarLabel: '일정',
                    headerShown: false, //상단 헤더(제목) 숨김
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../../../assets/icon/Schedule.png')} // assets에서 아이콘 불러오기
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? 'blue' : 'gray'
                            }}
                        />
                    ),
                }}
            />
            </Tab.Navigator>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logo: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    squadItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    matchItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default TeamDetails;

//========================================================================
// name: 팀 이름
// shortName: 팀의 축약 이름
// tla: 팀의 약어
// area.name: 팀이 속한 국가
// founded: 창단 연도
// venue: 홈 경기장
// clubColors: 팀의 클럽 색상 (e.g., "Red / White")
// website: 공식 웹사이트
// address: 팀의 주소
// phone: 팀의 전화번호
// email: 팀 이메일
// crest: 팀의 로고 이미지 URL
// squad: 팀의 선수 목록 (별도로 호출해야 할 수도 있음)
// activeCompetitions: 팀이 참가하는 대회 목록
