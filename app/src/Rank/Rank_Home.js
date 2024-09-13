import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from "expo-router"; 
import Rank_PL from './Rank_PL';
import Rank_PD from './Rank_PD';
import Rank_BL1 from './Rank_BL1';
import RANK_League from './Rank_League';

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에) 
const Rank_Home = () => {
    const [League, setLeague] = useState(0);
    
    const Print_Button = () => { //PL, BL1, PD 등 리그 선택 버튼 출력
        return (
            <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={styles.LeagueButton_Style} onPress={() => { setLeague('잉글랜드 프리미어리그'); }}>
                    <Text style={{fontSize: 17}}>프리미어리그</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.LeagueButton_Style} onPress={() => { setLeague('스페인 라리가'); }}>
                    <Text style={{fontSize: 18}}>라리가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.LeagueButton_Style} onPress={() => { setLeague('독일 분데스리가'); }}>
                    <Text style={{fontSize: 18}}>분데스리가</Text>
                    </TouchableOpacity>
                </View>
        );
    };

    Print_League = () => {
        const a = League;
        if (a == 0) {
            return (
                <View>
                    <Text style={{color:'white', fontSize:35}}> 현재 League값 : 0 </Text>
                </View>
            )
        } else if (a == '잉글랜드 프리미어리그') {
            return (
                <View>
                    <Rank_PL/>
                </View>
            )
        } else if (a=='스페인 라리가') {
            return (
                <View>
                    <Rank_PD/>
                </View>
            )
        } else if (a=='독일 분데스리가') {
            return (
                <View>
                    <Rank_BL1/>
                </View>
            )
        } else {
            return (
                <View>
                    <Text style={{color:'white', fontSize:35}}> League값 오류! </Text>
                </View>
            )
        }
    }

    return (
        <View style={{ flex: 1,backgroundColor:'green' }}>

            <View style={{flex: 9, alignItems: 'center', backgroundColor:'blue'}}>
                {Print_Button()}

                <Text style={{ fontSize: 30, color:'white' }}> {League} 순위 </Text>

                {Print_League()}
            </View>

            <View style={{flex: 1, alignItems: 'center', backgroundColor:'yellow'}}>
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
                    }} onPress={() => { router.replace('../Menu'); }}>
                    <Text style={{fontSize: 25}}>메뉴 이동</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    LeagueButton_Style: {
        backgroundColor: "skyblue",
        width: 100,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
    }
});

export default Rank_Home;