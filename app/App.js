import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from "expo-router"; 

const App = () => {

    return (
        <View style={{ flex: 1,backgroundColor:'green'}}>
            <View style={{flex: 9, alignItems: 'center', justifyContent:'center'}}>
                <Text style={{ fontSize: 35, color:'white' }}> FootBall Park </Text> 
                <Text style={{ fontSize: 20, color:'white' }}> App.js </Text> 

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
                }} onPress={() => { router.replace('./src/Menu'); }}>
                <Text style={{fontSize: 22}}>FootBall Park 시작</Text>
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
                }} onPress={() => { router.replace('/Home'); }}>
                <Text style={{fontSize: 22}}>로딩화면 이동</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{flex: 1, flexDirection:'column-reverse', alignItems: 'center'}}>
                <Link href='/Home'>로딩화면이동</Link>
            </View> */}
        </View>
    );
};

export default App;