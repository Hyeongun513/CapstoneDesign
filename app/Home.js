import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Text, Dimensions } from "react-native";
import { Link, router } from "expo-router";


const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;
`;

const Home = () => {
    const [time, setTime] = useState(4);
    const windoWidth = Dimensions.get("window").width;

    useEffect(() => {
        setTimeout(() => { router.replace('/App'); }, 4000);
    }, []);

    PrintLoading = () => {
        if (time == 3) {
            return <Text> time : 3</Text>
        } else if (time == 2) {
            return <Text> time : 2</Text>
        } else if (time == 1) {
            return <Text> time : 1</Text>
        } else {
            return <Text> time : 0</Text>
        };
    };

    if(time >= 1) {
        a = time;
        setTimeout(() => setTime(a-1), 1000);
    } else if (time == 0) {
        a = time;
        setTime(3);
    };

    return (
        <Container style={{ backgroundColor: 'green'}}>
            <Text style={{ fontSize: 35, color:'white', fontWeight:'bold' }}> FootBall Park </Text> 
            <Text style={{ fontSize: 20, color:'white' }}> Home.js </Text> 
            {PrintLoading()}
        </Container>
    );
};

export default Home;