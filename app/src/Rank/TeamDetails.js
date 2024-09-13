import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Link, router, useLocalSearchParams } from "expo-router";

const TeamDetails = () => {
    const { teamId } = useLocalSearchParams();  // URL에서 teamId 파라미터를 가져옴
    console.log("Received teamId:", teamId);


    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await axios.get(`https://api.football-data.org/v4/teams/${teamId}`, {
                    headers: {
                        'X-Auth-Token': '22ec1616e6ee4aa5b4b1ea5095555277',
                    },
                });
                setTeamInfo(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamDetails();
    }, [teamId]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{teamInfo.name}</Text>
            <Text>Founded: {teamInfo.founded}</Text>
            <Text>Stadium: {teamInfo.venue}</Text>
            {/* 팀의 추가 정보를 표시할 수 있습니다 */}
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
});

export default TeamDetails;