import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Link, router } from "expo-router";
import MatchSchedule_PL from './MatchSchedule_PL';
import MatchSchedule_PD from './MatchSchedule_PD';
import MatchSchedule_BL1 from './MatchSchedule_BL1';
import MatchSchedule_SA from './MatchSchedule_SA';
import MatchSchedule_FL1 from './MatchSchedule_FL1';

const ScheduleHome = () => {
    // const [selectedDate, setSelectedDate] = useState('2024-09-14');
    // const [currentYear, setCurrentYear] = useState(2024);
    // const [currentMonth, setCurrentMonth] = useState(10); // 10월
    const [league, setLeague] = useState('All');

    //오늘 날짜 받기
    const today = new Date();
    const todayYear = today.getFullYear().toString();
    // const todayMonth = '0' + today.getMonth().toString().slice(-2); //10월인 경우 09로 표기(-1)
    const todayMonth = ('0' + (today.getMonth()+1).toString()).slice(-2); //0부터 시작하는 인덱스에 따라 10월인 경우 09로 표기되므로 +1 필요
    const todayDate = ('0' + today.getDate().toString()).slice(-2);
    const today2 = todayYear+'-'+todayMonth+'-'+todayDate; //0000-00-00

    const [selectedDate, setSelectedDate] = useState(today2); //0000-00-00
    const [currentYear, setCurrentYear] = useState(todayYear); //2024
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()+1); //앞자리 0없이 설정, +1 필요
    
    console.log('todayDate : ', todayDate);

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 0); //month = 10 인 경우, 월 인덱스가 0부터 시작하므로 9월을 의미 //0의 경우 해당 월의 이전 달의 마지막 날짜를 출력, 즉 month = 10인 경우 11월의 이전 달의 마지막 날짜 10월 31일 반환
        return Array.from({ length: date.getDate() }, (_, i) => i + 1); //getDate는 date의 일을 반환. month=10인 경우 31을 반환, length: 31
    }; //_는 현재 요소의 값 무시, i는 인덱스. 0번 인덱스에는 1, 1번에는 2... 삽입 //[1,2,3...31] 배열 반환

    const daysInMonth = getDaysInMonth(currentYear, currentMonth); //currentMonth가 10인 경우, daysInMonth는 [1,2,3...31]의 배열 반환받음

    const getDayName = (day) => { //요일 출력
        const date = new Date(currentYear, currentMonth - 1, day);
        const dayIndex = date.getDay(); // 0(일요일)부터 6(토요일)까지
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[dayIndex];
    };

    const onChangeDay = (day) => { //selectedDate값 변경
        const Month = ('0' + currentMonth).slice(-2); //선택된 일,월이 한자리수 일 경우 2자리 수로 변경
        const Day = ('0' + day).slice(-2);
        const newDate = `${currentYear}-${Month}-${Day}`;
        setSelectedDate(newDate);
    };

    const changeMonth = (increment) => { //CurrentMonth, CurrentYear값 변경
        let newMonth = currentMonth + increment;
        let newYear = currentYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const printSchedule = () => { //league값에 따라 리그 출력
        const a = league;

        if (a=='All') {
            return (
                <View style={{width:'100%', height:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_PL date={selectedDate}/>
                    </View>
                    <View style={{marginBottom:5, marginTop:5}}>
                        <MatchSchedule_PD date={selectedDate}/>
                    </View>
                    <View style={{marginBottom:5, marginTop:5}}>
                        <MatchSchedule_BL1 date={selectedDate}/>
                    </View>
                    <View style={{marginBottom:5, marginTop:5}}>
                        <MatchSchedule_SA date={selectedDate}/>
                    </View>
                    <View style={{marginBottom:5, marginTop:5}}>
                        <MatchSchedule_FL1 date={selectedDate}/>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => { router.replace('../Menu'); }}>
                            <Text style={{fontSize: 25}}>메인 메뉴</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if (a=='PL') {
            return (
                <View style={{width:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_PL date={selectedDate}/>
                    </View>
                </View>
            )
        } else if ( a=='PD') {
            return (
                <View style={{width:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_PD date={selectedDate}/>
                    </View>
                </View>
            )
        } else if ( a=='BL1') {
            return (
                <View style={{width:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_BL1 date={selectedDate}/>
                    </View>
                </View>
            )
        } else if ( a=='SA') {
            return (
                <View style={{width:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_SA date={selectedDate}/>
                    </View>
                </View>
            )
        } else if ( a=='FL1') {
            return (
                <View style={{width:'100%'}}>
                    <View style={{marginBottom:5, marginTop:5}}> 
                        <MatchSchedule_FL1 date={selectedDate}/>
                    </View>
                </View>
            )
        } else {
            return (
                <Text> 오류입니다!! </Text>
        )
        }
    }

    return (
        <View>
            <FlatList
            ListEmptyComponent={
                <View style={styles.container}>

                    <View style={{flexDirection:'row', marginTop:-25}}>
                        {/* <TouchableOpacity style={[styles.TouchableOpacityStyle, {backgroundColor: league == 'All' ? '#4682B4' : 'skyblue'}, {width:100}]} onPress={() => { setLeague('All') }}>
                                <Text style={{fontSize: 20, color: league == 'All' ? 'white' : 'black'}}> 전체 </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.TouchableOpacityStyle, {backgroundColor: league == 'PL' ? '#4682B4' : 'skyblue'}, {width:100}]} onPress={() => { setLeague('PL') }}>
                                <Text style={{fontSize: 15, color: league == 'PL' ? 'white' : 'black'}}> 프리미어리그 </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.TouchableOpacityStyle, {backgroundColor: league == 'PD' ? '#4682B4' : 'skyblue'}, {width:100}]} onPress={() => { setLeague('PD') }}>
                                <Text style={{fontSize: 20, color: league == 'PD' ? 'white' : 'black'}}> 라리가 </Text>
                        </TouchableOpacity> */}

                        <FlatList
                            data={[
                                { id: 'All', label: '전체' },
                                { id: 'PL', label: '프리미어리그' },
                                { id: 'PD', label: '라리가' },
                                { id: 'BL1', label: '분데스리가' },
                                { id: 'SA', label: '세리에' },
                                { id: 'FL1', label: '리그 1' },
                            ]}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[styles.TouchableOpacityStyle2, {backgroundColor: league == item.id ? '#4682B4' : 'skyblue'}]} 
                                    onPress={() => { setLeague(item.id) }}>
                                    <Text style={{fontSize: 15, fontWeight: 'bold', color: league == item.id ? 'white' : 'black'}}> {item.label} </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id.toString()}
                            horizontal //방향 수평
                            showsHorizontalScrollIndicator={false}
                        />

                    </View>

                    <Text style={styles.header}>{currentYear}년 {currentMonth}월 {selectedDate.slice(-2)}일</Text>
                    {/* <Text style={{fontSize:10}}>현재 선택된 날짜: {selectedDate}</Text>
                    <Text style={styles.dateText}>현재 선택된 리그: {league}</Text> */}

                    <View style={styles.monthChangeContainer}>
                        <TouchableOpacity onPress={() => changeMonth(-1)}>
                            <Text style={styles.changeMonthText}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.changeMonthText}>{currentMonth}월</Text>
                        <TouchableOpacity onPress={() => changeMonth(1)}>
                            <Text style={styles.changeMonthText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 100}}>
                        <FlatList
                            data={daysInMonth}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.dateItem, {backgroundColor : (0 + item.toString()).slice(-2) == selectedDate.slice(-2) ? '#73C899' : '#C7E9D6'}]}
                                    onPress={() => {
                                        onChangeDay(item);
                                        // console.log('0 + item : ', (0 + item.toString()).slice(-2) );
                                        // console.log('selectedDate.slice(-2) : ', selectedDate.slice(-2));
                                        // (0 + item.toString()).slice(-2) == selectedDate.slice(-2) ? 'white' : 'black'
                                    }}
                                >
                                    {/* <Text style={styles.dateText}>{item}{getDayName(item)}</Text> */}
                                    <Text style={[styles.dateText, 
                                        {color : (0 + item.toString()).slice(-2) == selectedDate.slice(-2) ? 'white' : 'black'}, 
                                        {fontWeight : (0 + item.toString()).slice(-2) == selectedDate.slice(-2) ? 'bold' : ''}]}>
                                        <Text>{('0' + item).slice(-2)}</Text>
                                        {'\n'} {/* 줄바꿈 */}
                                        <Text style={[styles.dayText, 
                                            {color : (0 + item.toString()).slice(-2) == selectedDate.slice(-2) ? 'white' : 'gray'}]}>
                                            {getDayName(item)}
                                        </Text> {/* 요일 추가 */}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.toString()}
                            horizontal //방향 수평
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>

                    {/* <MatchSchedule_PL date={selectedDate}/> */}
                    {printSchedule()}

                    <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => { router.replace('../Menu'); }}>
                        <Text style={{fontSize: 25}}>메뉴 이동</Text>
                    </TouchableOpacity>
                </View> 
            }
            />
            <View style={{backgroundColor:'green', height:1000}}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    header: {
        fontSize: 30,
        color: 'white',
        marginBottom: 10,
        fontWeight:'bold'
    },
    dateText: {
        fontSize: 20,
        color: 'black',
    },
    dayText: {
        fontSize: 16,
        color: 'gray',
    },
    monthChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    changeMonthText: {
        fontSize: 25,
        color: 'white',
        marginHorizontal: 10,
    },
    dateItem: {
        backgroundColor: 'lightgrey',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    flatListContent: {
        alignItems: 'center',
        // backgroundColor:'yellow',
    },
    TouchableOpacityStyle: {
        backgroundColor: "skyblue",
        width: 200,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
    },
    TouchableOpacityStyle2: {
        backgroundColor: "skyblue",
        width: 100,
        height: 35,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        margin: 5,
        marginTop: 15,
    },
});

export default ScheduleHome;

// PL(피엘), BL1(분데스), PD(라리가), FL1(리그앙), SA(세리에)