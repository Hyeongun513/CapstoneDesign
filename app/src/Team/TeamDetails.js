import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { Link, router, useLocalSearchParams } from "expo-router";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator(); //하단 메뉴 버튼

const TeamDetails = () => {
    const { teamId, rank } = useLocalSearchParams();  // URL에서 teamId 파라미터를 가져옴
    // console.log("Received teamId:", teamId);

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
    const [upcomingMatch, setUpcomingMatch] = useState(null); // 다음경기
    const [upcomingMatchAll, setUpcomingMatchAll] = useState([]); // 예정된 모든경기
    const [recentMatches, setRecentMatches] = useState([]); // 종료된 모든 경기
    const [recentMatchesFive, setRecentMatchesFive] = useState([]); // 최근 5경기

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
                // console.log(response.data); // 응답 구조 확인을 위한 로그

                // const scheduledMatches = response.data.matches.filter(match => match.status === "SCHEDULED");
                const scheduledMatches = response.data.matches.filter( // SCHEDULED 또는 TIMED 상태의 경기 필터링
                    match => match.status === "SCHEDULED" || match.status === "TIMED" //끝난 경기는 "FINISHED", 인접 경기(?)는 "TIMED", 먼 경기는 "SCHEDULED"
                ); //예정된 경기
                const finishedMatches = response.data.matches.filter(match => match.status === "FINISHED"); //종료된 경기
                // console.log(scheduledMatches); //예정된 경기
                // console.log(finishedMatches); //종료된 경기

                // scheduledMatches 일정이 가까운 경기부터 먼 경기 순으로 정렬
                scheduledMatches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
                
                if (scheduledMatches.length > 0) {
                    setUpcomingMatch(scheduledMatches[0]);  // 다음 경기 일정
                }
                // setRecentMatches(finishedMatches.slice(0, 5));  // 첫 5경기 결과
                // setRecentMatches(finishedMatches.slice(-5)); // 최근 5경기 결과

                setUpcomingMatchAll(scheduledMatches); // 예정된 모든 경기
                setRecentMatches(finishedMatches);  // 종료된 모든 경기 결과
                setRecentMatchesFive(finishedMatches.slice(-5)); // 최근 5경기 결과

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
        return_League = (area) => {
            if (area == 'England') {
                return (
                <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 5}}>
                <Image
                source={require('../../../assets/icon/프리미어리그.png')} // assets에서 아이콘 불러오기
                style={{width: 30, height: 30}}
                />
                <Text style={{fontSize: 16, fontWeight:'bold'}}>잉글랜드 프리미어리그 {rank}위</Text>
                </View>
                );
            } else if (area == 'Spain') {
                return (
                <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 5}}>
                <Image
                source={require('../../../assets/icon/라리가.png')} // assets에서 아이콘 불러오기
                style={{width: 30, height: 30}}
                />
                <Text style={{fontSize: 16, fontWeight:'bold'}}>스페인 프리메라리가 {rank}위</Text>
                </View>
                );
            } else if (area == 'Germany') {
                return (
                <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 5}}>
                <Image
                source={require('../../../assets/icon/분데스리가.png')} // assets에서 아이콘 불러오기
                style={{width: 30, height: 30}}
                />
                <Text style={{fontSize: 16, fontWeight:'bold'}}>독일 분데스리가 {rank}위</Text>
                </View>
                );
            } else if (area == 'Italy') {
                return (
                <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 5}}>
                <Image
                source={require('../../../assets/icon/세리에 A.png')} // assets에서 아이콘 불러오기
                style={{width: 30, height: 30}}
                />
                <Text style={{fontSize: 16, fontWeight:'bold'}}>이탈리아 세리에A {rank}위</Text>
                </View>
                );
            } else if (area == 'France') {
                return (
                <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 5}}>
                <Image
                source={require('../../../assets/icon/리그 1.png')} // assets에서 아이콘 불러오기
                style={{width: 30, height: 30}}
                />
                <Text style={{fontSize: 16, fontWeight:'bold'}}>프랑스 리그1 {rank}위</Text>
                </View>
                );
            } else {
                return <Text style={{fontSize: 16, fontWeight:'bold', color: 'red'}}> 리그 출력 오류 </Text>
            }
        }
        return (
            <FlatList //스크롤용 FlatList
            data={[]}
            renderItem={null}
            ListEmptyComponent = { () => (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'green'}}>
                <Image 
                    source={{ uri: teamInfo.crest }} 
                    style={styles.logo} 
                />
                <Text style={{fontSize: 22, fontWeight: 'bold', color: 'white'}}>{teamInfo.name}</Text>
                <Text style={{fontSize: 22, fontWeight: 'bold', color: 'white'}}>({teamInfo.tla})</Text>

                <View style={styles.container}>
                    {return_League(teamInfo.area.name)}
                    <Text style={{marginVertical: 2, fontWeight: 'bold'}}>창단: {teamInfo.founded}</Text>
                    <Text style={{marginVertical: 2, fontWeight: 'bold'}}>홈구장: {teamInfo.venue}</Text>
                    {/* <Text>클럽 색상: {teamInfo.clubColors}</Text> */}
                    {/* <Text>팀 주소: {teamInfo.address}</Text> */}
                    <Text onPress={() => Linking.openURL(teamInfo.website)} style={{fontWeight:'bold', color:'blue', marginTop: 15}}>공식 홈페이지</Text>
                </View>

                {upcomingMatch && (
                    <View style={styles.container}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>다음 경기</Text>
                        <Text>{upcomingMatch.homeTeam.name} vs {upcomingMatch.awayTeam.name}</Text>
                        <Text>{new Date(upcomingMatch.utcDate).toLocaleDateString()}</Text>
                    </View>
                )}

                <View style={[styles.container, {marginBottom: 10}]}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>최근 5경기</Text>
                    <FlatList
                        data={recentMatchesFive}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.matchItem}>
                                <Text>{item.homeTeam.name} {item.score.fullTime.home} - {item.score.fullTime.away} {item.awayTeam.name}</Text>
                                <Text>{new Date(item.utcDate).toLocaleDateString()}</Text>
                            </View>
                        )}
                    />
                </View>

            </View>
            )} />
        )
    };


    const Print_Squad = () => { //팀 기본 스쿼드 출력
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green'}}>

                <View style={styles.container}>
                    <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{fontSize: 20, fontWeight: '900', marginBottom: 5}}>골키퍼</Text>
                    </View>
                    {squad.goalkeepers.map((player) => (
                        <View key={player.id} style={{padding: 5}}>
                            <Text>{player.name} ({player.nationality})</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.container}>
                <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{fontSize: 20, fontWeight: '900', marginBottom: 5}}>수비수</Text>
                    </View>
                    {squad.defenders.map((player) => (
                        <View key={player.id} style={{padding: 5}}>
                            <Text>{player.name} ({player.nationality})</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.container}>
                <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{fontSize: 20, fontWeight: '900', marginBottom: 5}}>미드필더</Text>
                    </View>
                    {squad.midfielders.map((player) => (
                        <View key={player.id} style={{padding: 5}}>
                            <Text>{player.name} ({player.nationality})</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.container, {marginBottom: 10}]}>
                <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{fontSize: 20, fontWeight: '900', marginBottom: 5}}>공격수</Text>
                    </View>
                    {squad.forwards.map((player) => (
                        <View key={player.id} style={{padding: 5}}>
                            <Text>{player.name} ({player.nationality})</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    };

    Print_Schedule = () => {
        return (
            <FlatList //스크롤용 FlatList
            data={[]}
            renderItem={null}
            ListEmptyComponent = { () => (
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'green'}}>

                <View style={styles.container}>
                    <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>종료된 경기</Text>
                    </View>
                    <FlatList
                        data={recentMatches}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.matchItem}>
                                <Text>{item.homeTeam.name} {item.score.fullTime.home} - {item.score.fullTime.away} {item.awayTeam.name}</Text>
                                <Text>{new Date(item.utcDate).toLocaleDateString()}</Text>
                            </View>
                        )}
                    />
                </View>

                {/* <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>예정된 경기</Text> */}
                <View style={[styles.container, {marginBottom: 10}]}>
                    <View style={{width:'100%', borderBottomWidth: 1, alignItems: 'center', marginBottom: 12}}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>예정된 경기</Text>
                    </View>
                    <FlatList
                        data={upcomingMatchAll}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.matchItem}>
                                <Text>{item.homeTeam.name} {item.score.fullTime.home} - {item.score.fullTime.away} {item.awayTeam.name}</Text>
                                <Text>{new Date(item.utcDate).toLocaleDateString()}</Text>
                            </View>
                        )}
                    />
                </View>

            </View>
            )
        }/>
        )
    }

    return (
        <Tab.Navigator
            initialRouteName="Info"
            screenOptions={{
                tabBarStyle: { 
                    backgroundColor: '#DEF6D7', // 탭 배경색
                    borderTopWidth: 2, // 구분선 굵기
                    borderTopColor: 'gray', // 구분선 색상
                },
                tabBarLabelStyle: {
                    fontSize: 14, // 폰트 크기
                    fontWeight: 'bold', // 폰트 굵기
                },
                tabBarItemStyle: {
                    borderRightWidth: 0.5, // 각 탭의 우측 경계선 굵기
                    borderRightColor: 'gray', // 각 탭의 경계선 색상
                },
                tabBarActiveTintColor: 'green', // 선택된 탭 글씨 색
                tabBarInactiveTintColor: 'gray', // 선택되지 않은 탭 글씨 색

                tabBarActiveBackgroundColor: '#B2D8B2', // 선택된 탭의 배경색
                tabBarInactiveBackgroundColor: '#DEF6D7', // 선택되지 않은 탭의 배경색
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
                                tintColor: focused ? 'green' : 'gray'
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
                                tintColor: focused ? 'green' : 'gray'
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
                                tintColor: focused ? 'green' : 'gray'
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
        width: '90%',
        backgroundColor: '#90EE90',
        borderRadius: 20,
        marginTop: 15,
        padding: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    matchItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    infoContainer: {
        width: '90%',
        backgroundColor: '#90EE90',
        borderRadius: 20,
        marginTop: 15,
        padding: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    squadContainer: {
        width: '90%',
        backgroundColor: '#90EE90',
        borderRadius: 20,
        marginTop: 15,
        padding: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TeamDetails;

//========================================================================
// name: 팀 이름
// shortName: 팀의 축약 이름
// tla: 팀의 약어
// area.name: 팀이 속한 국가 (England, Spain, Germany, Italy, France)
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
