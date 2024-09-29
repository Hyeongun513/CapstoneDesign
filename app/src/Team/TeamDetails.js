import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, FlatList } from 'react-native';
import axios from 'axios';
import { Link, router, useLocalSearchParams } from "expo-router";

const TeamDetails = () => {
    const { teamId } = useLocalSearchParams();  // URL에서 teamId 파라미터를 가져옴
    console.log("Received teamId:", teamId);


    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [squad, setSquad] = useState([]);
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
                setSquad(response.data.squad);  // 팀 스쿼드 설정
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
                
                const scheduledMatches = response.data.matches.filter(match => match.status === "SCHEDULED");
                const finishedMatches = response.data.matches.filter(match => match.status === "FINISHED");
                
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

        fetchMatches();
        fetchTeamDetails();
    }, [teamId]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <View style={styles.container}>
            <Text> Team 폴더 내의 TeamDetails 입니다!!! </Text>
            <Image 
                source={{ uri: teamInfo.crest }} 
                style={styles.logo} 
            />
            <Text style={styles.title}>{teamInfo.name}</Text>
            <Text>창단 연도: {teamInfo.founded}</Text>
            <Text>경기장: {teamInfo.venue}</Text>
            <Text>클럽 색상: {teamInfo.clubColors}</Text>
            <Text>팀 주소: {teamInfo.address}</Text>
            <Text>공식 웹사이트</Text>
            <Text onPress={() => Linking.openURL(teamInfo.website)}>{teamInfo.website}</Text>
            {/* 팀의 추가 정보를 표시할 수 있습니다 */}

             {/* 팀 스쿼드 */}
             <Text style={styles.sectionTitle}>전체 스쿼드:</Text>
            <FlatList
                data={squad}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.squadItem}>
                        <Text>{item.name} - {item.position} ({item.nationality})</Text>
                    </View>
                )}
            />

            {/* 다음 경기 일정 */}
            {upcomingMatch && (
                <View>
                    <Text style={styles.sectionTitle}>다음 경기</Text>
                    <Text>{upcomingMatch.homeTeam.name} vs {upcomingMatch.awayTeam.name}</Text>
                    <Text>Date: {new Date(upcomingMatch.utcDate).toLocaleDateString()}</Text>
                </View>
            )}

            {/* 최근 경기 결과 */}
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