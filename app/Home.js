import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Text, Dimensions, Image } from "react-native";
import { Link, router } from "expo-router";
import LoadingBar1 from "../assets/images/Loading1.png";
import LoadingBar2 from "../assets/images/Loading2.png";
import LoadingBar3 from "../assets/images/Loading3.png";
import LoadingBar4 from "../assets/images/Loading4.png";


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
            return <Image source={LoadingBar2} style={{width: windoWidth*0.9, height: windoWidth*0.9*0.1175}}/>
        } else if (time == 2) {
            return <Image source={LoadingBar3} style={{width: windoWidth*0.9, height: windoWidth*0.9*0.1175}}/>
        } else if (time == 1) {
            return <Image source={LoadingBar4} style={{width: windoWidth*0.9, height: windoWidth*0.9*0.1175}}/>
        } else {
            return <Image source={LoadingBar1} style={{width: windoWidth*0.9, height: windoWidth*0.9*0.1175}}/>
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