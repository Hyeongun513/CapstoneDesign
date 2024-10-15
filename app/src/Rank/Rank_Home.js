import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Link, router } from "expo-router"; 
import Rank_PL from './Rank_PL';
import Rank_PD from './Rank_PD';
import Rank_BL1 from './Rank_BL1';
import Rank_SA from './Rank_SA';
import Rank_FL1 from './Rank_FL1';

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에)
const Rank_Home = () => {
    const [league, setLeague] = useState('PL');
    
    const Print_Button = () => { //PL, BL1, PD 등 리그 선택 버튼 출력
        return (
            <View style={{flexDirection:'row'}}>
                <FlatList
                    data={[
                        { id: 'PL', label: '프리미어리그' },
                        { id: 'PD', label: '라리가' },
                        { id: 'BL1', label: '분데스리가' },
                        { id: 'SA', label: '세리에A' },
                        { id: 'FL1', label: '리그 1' },
                    ]}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.LeagueButton_Style, {backgroundColor: league == item.id ? '#4682B4' : 'skyblue'}]} 
                            onPress={() => { setLeague(item.id) }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: league == item.id ? 'white' : 'black'}}> {item.label} </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                    horizontal //방향 수평
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    };

    Print_Title = () => {
        const a = league;
        if (a == 'PL') {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Image
                    source={require('../../../assets/icon/epl.png')} // assets에서 아이콘 불러오기
                    style={{width: 45, height: 45}}
                    />
                    <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}> 잉글랜드 프리미어리그 </Text>
                </View>
            )
        } else if (a=='PD') {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Image
                    source={require('../../../assets/icon/primera.png')} // assets에서 아이콘 불러오기
                    style={{width: 45, height: 45}}
                    />
                    <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}> 스페인 라리가 EA Sports </Text>
                </View>
            )
        } else if (a=='BL1') {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Image
                    source={require('../../../assets/icon/bundesliga.png')} // assets에서 아이콘 불러오기
                    style={{width: 45, height: 45}}
                    />
                    <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}> 독일 분데스리가 </Text>
                </View>
            )
        } else if (a=='SA') {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Image
                    source={require('../../../assets/icon/seria.png')} // assets에서 아이콘 불러오기
                    style={{width: 45, height: 45}}
                    />
                    <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}> 이탈리아 세리에A </Text>
                </View>
            )
        } else if (a=='FL1') {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Image
                    source={require('../../../assets/icon/ligue1.png')} // assets에서 아이콘 불러오기
                    style={{width: 45, height: 45}}
                    />
                    <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}> 프랑스 리그 1 맥도날드 </Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text style={{color:'white', fontSize:35}}> league값 오류! </Text>
                </View>
            )
        }
    };

    Print_League = () => {
        const a = league;
        if (a == 'PL') {
            return (
                <View>
                    <Rank_PL/>
                </View>
            )
        } else if (a=='PD') {
            return (
                <View>
                    <Rank_PD/>
                </View>
            )
        } else if (a=='BL1') {
            return (
                <View>
                    <Rank_BL1/>
                </View>
            )
        } else if (a=='SA') {
            return (
                <View>
                    <Rank_SA/>
                </View>
            )
        } else if (a=='FL1') {
            return (
                <View>
                    <Rank_FL1/>
                </View>
            )
        } else {
            return (
                <View>
                    <Text style={{color:'white', fontSize:35}}> league값 오류! </Text>
                </View>
            )
        }
    }

    return (
        <View style={{ flex: 1,backgroundColor:'green' }}>

            <View style={{flex: 9, alignItems: 'center', backgroundColor:'green'}}>
                {Print_Button()}

                {/* <Text style={{ fontSize: 30, color:'white' }}> {league} 순위 </Text> */}
                {Print_Title()}
                {Print_League()}
            </View>

            <View style={{flex: 1, alignItems: 'center', backgroundColor:'green'}}>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{backgroundColor:'blue', width:10, height:10, marginTop: 5}}/>
                    <Text style={{fontSize: 15, color: 'white'}}> 챔피언스리그 </Text>
                    <View style={{backgroundColor:'orange', width:10, height:10, marginTop: 5, marginLeft: 5}}/>
                    <Text style={{fontSize: 15, color: 'white'}}> 유로파리그 </Text>
                    <View style={{backgroundColor:'red', width:10, height:10, marginTop: 5, marginLeft: 5}}/>
                    <Text style={{fontSize: 15, color: 'white'}}> 강등 </Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: "skyblue",
                    width: '100%',
                    flex: 1,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    marginTop: 5,
                    }} onPress={() => { router.replace('../Menu'); }}>
                    <Text style={{fontSize: 20}}>메인 메뉴</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    LeagueButton_Style: {
        backgroundColor: "skyblue",
        width: 100,
        height: 35,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        margin: 5,
        marginTop: 15,
    }
});

export default Rank_Home;