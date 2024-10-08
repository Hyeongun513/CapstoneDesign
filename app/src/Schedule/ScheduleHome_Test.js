import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Link, router } from "expo-router";
import {Calendar} from 'react-native-calendars';

const ScheduleHome_Test = () => {
    const [date, setDate] = useState('2024-10-01');
    const [markedDates, setMarkedDates] = useState({
        '2024-10-01': { selected: true, selectedColor: 'green' }
    });

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
        .filter(day => {
            const date = new Date(2024, 9, day); // 10월은 9번 인덱스
            return date.getMonth() === 9; // 9는 10월을 의미
        });

    const onChangeDay = (Select) => {
        console.log('선택된 날짜', Select)
        const Month = ('0' + Select.month).slice(-2); //선택된 일월이 한자리수 일 경우 2자리 수로 변경
        const Day = ('0' + Select.day).slice(-2);
        const newDate = `${Select.year}-${Month}-${Day}`; 

        setMarkedDates({ // 새로 선택된 날짜의 스타일을 지정하고, 이전 날짜의 스타일은 초기화
            [newDate]: { selected: true, selectedColor: 'green', selectedTextColor: 'white' }
        });

        setDate(newDate); // 선택된 날짜 업데이트
    };

    return (
        <View style={styles.container}>
            <View style={{flex: 9, alignItems: 'center', justifyContent:'center'}}>
            <Text style={styles.header}>ScheduleHome.js</Text>
            <Text style={styles.dateText}>현재 선택된 날짜: {date}</Text>

                <Calendar
                current={'2024-10-03'}
                monthFormat={'yyyy.MM'}
                minDate={'2024-08-01'}
                maxDate={'2025-05-31'}
                onDayPress={(day) => onChangeDay(day)}
                markedDates={markedDates}
                />
                
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
                    }} onPress={() => { setDate('날짜 선택'); }}>
                    <Text style={{fontSize: 25}}>날짜 선택</Text>
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
                    }} onPress={() => { router.replace('../Menu'); }}>
                    <Text style={{fontSize: 25}}>메뉴 이동</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 35,
        color: 'white',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 20,
        color: 'white',
    },
    dateItem: {
        backgroundColor: 'lightgrey',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    selectedDate: {
        backgroundColor: 'blue',
    },
});

export default ScheduleHome_Test;