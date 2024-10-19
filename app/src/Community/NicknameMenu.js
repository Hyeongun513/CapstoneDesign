import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { Link, router } from "expo-router"; 
import TodayMatch from './TodayMatch';

const NicknameMenu = () => {
    const [nickname, setNickname] = useState('');
    const { height } = Dimensions.get('window');
    console.log('기기 높이 : ', height);

    return (
        <View style={styles.bigContainer}>

            <View style={styles.nicknameContainer}>
                <Text style={{fontWeight:'bold', fontSize: 15, borderBottomWidth: 1, margin: 10}}> 설정된 닉네임</Text>
                { nickname == '' ? 
                <Text style={{color:'red', fontWeight:'bold', fontSize: 13, marginTop: 3, marginBottom: 10}}> 설정된 닉네임이 없습니다. 닉네임을 먼저 설정해주세요!</Text>  
                :
                <Text style={{fontWeight:'bold', fontSize: 20, marginBottom: 3}}> {nickname}</Text>   
                }
            </View>

            <View style={styles.noticeContainer}>

                <View style={{borderBottomWidth: 1, marginBottom: 10}}>
                    <Text style={{fontSize: 15, margin: 15, marginTop: 0, fontWeight: 'bold'}}> 닉네임을 설정 후 커뮤니티 기능을 이용하세요 </Text>
                </View>

                <View style={{justifyContent:'flex-start', width: '100%'}}>
                    <View style={styles.textContainer}>
                        <Image
                        source={require('../../../assets/images/check.png')} // assets에서 아이콘 불러오기
                        style={styles.checkImage}
                        />
                        <Text style={styles.text}> 오늘자 주요 경기들에 대해 공유하세요.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Image
                        source={require('../../../assets/images/check.png')} // assets에서 아이콘 불러오기
                        style={styles.checkImage}
                        />
                        <Text style={styles.text}> 닉네임은 자유롭게 변경이 가능합니다.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Image
                        source={require('../../../assets/images/check.png')} // assets에서 아이콘 불러오기
                        style={styles.checkImage}
                        />
                        <Text style={styles.text}> 닉네임은 최대 10글자를 넘길 수 없습니다. </Text>
                    </View>
                </View>
            </View>
            
            { height >= 680 ? <TodayMatch Component={'NicknameMenu'}/> : ''} 
            {/* 기기 높이가 680 이상이면 출력, 미만이면 출력하지 않음 ( 스크롤 적용 어려움 ) */}

            <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            maxLength={10}
            style={{ borderWidth: 1, padding: 5, margin: 10, width:'80%', backgroundColor:'white' }}
            />

            { //nickname이 설정되지 않으면 버튼 비활성화
            (nickname == '') ? 
            <View style={{ flexDirection:'row' }}>
            <TouchableOpacity style={[styles.communityButton, {backgroundColor:'gray'}]} onPress={() => Alert.alert("알림", "닉네임을 먼저 설정해주세요! \n닉네임 설정 후 채팅을 이용할 수 있습니다.")}>
                <Text style={{fontSize: 20, color:'lightgray'}}>채팅</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.communityButton, {backgroundColor:'gray'}]} onPress={() => Alert.alert("알림", "닉네임을 먼저 설정해주세요! \n닉네임 설정 후 게시판을 이용할 수 있습니다.")}>
                <Text style={{fontSize: 20, color:'lightgray'}}>게시판</Text>
            </TouchableOpacity>
            </View> //nickname이 입력되지 않은 경우 비활성화 및 알림 출력
            :
            <View style={{ flexDirection:'row' }}>
            <TouchableOpacity style={styles.communityButton} onPress={() => router.push(`./Chat?nickname=${nickname}`)}>
                <Text style={{fontSize: 20}}>채팅</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.communityButton} onPress={() => { router.replace('../Menu'); }}>
                <Text style={{fontSize: 20}}>게시판</Text>
            </TouchableOpacity>
            </View> //nickname이 입력된 경우 이동 기능 활성화
            }
                
            <TouchableOpacity style={[styles.menuButton, {width:320}]} onPress={() => { router.replace('../Menu'); }}>
                    <Text style={{fontSize: 20}}>메인 메뉴</Text>
            </TouchableOpacity>
        </View>
    )
};

export default NicknameMenu;

const styles = StyleSheet.create({
    bigContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'green'
    },
    noticeContainer: {
        width:'95%',
        padding: 20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#90EE90',
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 5,
    },
    nicknameContainer: {
        width: '95%',
        padding: 0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#90EE90',
        borderRadius: 10,
        marginTop: 10,
    },
    textContainer: {
        flexDirection: 'row', 
        marginTop: 5, 
        marginBottom: 5,
    },
    checkImage: {
        width: 17, 
        height: 17, 
        marginLeft: 15,
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
    communityButton: {
        backgroundColor: "skyblue",
        width: 150,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        marginTop: 5,
    },
    menuButton: {
        backgroundColor: "skyblue",
        width: 370,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        marginTop: 0,   
    }
});