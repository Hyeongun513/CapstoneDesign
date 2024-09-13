import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";

const Test = () => {
    return (
        <View style={{alignItems:'center', justifyContent:'center', backgroundColor: 'orange'}}>
            <Text> Test 페이지 입니다!! </Text>

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
                }} onPress={() => { router.replace('./Menu'); }}>
                <Text style={{fontSize: 25}}>메뉴 화면 이동</Text>
                </TouchableOpacity>
        </View>
    );
};

export default Test;