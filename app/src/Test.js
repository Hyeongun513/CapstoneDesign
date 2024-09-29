import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (
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
)
}
const SearchScreen = () => {
    return <Text>Search</Text>;
}
  
const NotificationScreen = () => {
    return (
    <ScrollView>
        <Text>Notification</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
        <Text style={{fontSize:50}}>asdr</Text>
    </ScrollView>
        )
  }
  
const MessageScreen = () => {
    return <Text>Message</Text>;
  }



const Test = () => {
    return (
        // <View style={{alignItems:'center', justifyContent:'center', backgroundColor: 'orange'}}>
        //     <Text> Test 페이지 입니다!! </Text>

        //     <TouchableOpacity style={{
        //         backgroundColor: "skyblue",
        //         width: 200,
        //         height: 50,
        //         borderRadius: 8,
        //         justifyContent: "center",
        //         alignItems: "center",
        //         borderRadius: 10,
        //         margin: 10,
        //         marginTop: 20,
        //         }} onPress={() => { router.replace('./Menu'); }}>
        //         <Text style={{fontSize: 25}}>메뉴 화면 이동</Text>
        //         </TouchableOpacity>

        <Tab.Navigator
                initialRouteName="Home"
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
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        headerShown: false, //상단 헤더(제목) 숨김
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/icon/Info.png')} // 내부 폴더에서 아이콘 불러오기
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: focused ? 'blue' : 'gray'
                                }}
                            />
                        ),
                    }}
                />
            {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
            <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        tabBarLabel: 'Search',
                        headerShown: false, //상단 헤더(제목) 숨김
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/icon/Squad.png')} // 내부 폴더에서 아이콘 불러오기
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: focused ? 'blue' : 'gray'
                                }}
                            />
                        ),
                    }}
                />
            {/* <Tab.Screen name="Notification" component={NotificationScreen} /> */}
            <Tab.Screen
                    name="Notification"
                    component={NotificationScreen}
                    options={{
                        tabBarLabel: 'Notification',
                        headerShown: false, //상단 헤더(제목) 숨김
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/icon/Schedule.png')} // 내부 폴더에서 아이콘 불러오기
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: focused ? 'blue' : 'gray'
                                }}
                            />
                        ),
                    }}
                />
            {/* <Tab.Screen name="Message" component={MessageScreen} /> */}
        </Tab.Navigator>

        // </View>
    );
};

export default Test;
