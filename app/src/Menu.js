import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from "expo-router"; 

const Menu = () => {

    return (
        <View style={{ flex: 1,backgroundColor:'green'}}>
            <View style={{flex: 9, alignItems: 'center', justifyContent:'center'}}>
                <Text style={{ fontSize: 35, color:'white' }}> FootBall Park </Text> 
                <Text style={{ fontSize: 20, color:'white' }}> Menu.js </Text> 

                <TouchableOpacity style={{
                backgroundColor: "skyblue",
                width: 200,
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                margin: 10,
                marginTop: 20,
                }} onPress={() => { router.replace('./Rank/Rank_Home'); }}>
                <Text style={{fontSize: 25}}>리그 랭킹</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                backgroundColor: "skyblue",
                width: 200,
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                margin: 10,
                marginTop: 20,
                }} onPress={() => { router.replace('./Schedule/MatchSchedule'); }}>
                <Text style={{fontSize: 25}}>주요 일정</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                backgroundColor: "skyblue",
                width: 200,
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                margin: 10,
                marginTop: 20,
                }} onPress={() => { router.navigate('./Test'); }}>
                <Text style={{fontSize: 25}}>선수 데이터</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                backgroundColor: "skyblue",
                width: 200,
                height: 40,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                margin: 10,
                marginTop: 20,
                }} onPress={() => { router.replace('../App'); }}>
                <Text style={{fontSize: 25}}>홈 이동</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, flexDirection:'column-reverse', alignItems: 'center'}}>
                <Link href=''>링크Link</Link>
            </View>
        </View>
    );
};

export default Menu;