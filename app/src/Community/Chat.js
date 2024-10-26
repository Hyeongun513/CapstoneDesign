import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { database } from './firebaseConfig';  // firebaseConfig 파일 불러오기
import { Link, router, useLocalSearchParams } from "expo-router";
import TodayMatch from './TodayMatch';

const Chat = () => {
  const { nickname } = useLocalSearchParams(); //닉네임 받기

  const [message, setMessage] = useState('');   // 메시지 입력
  const [messages, setMessages] = useState([]); // 메시지 리스트

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        nickname: nickname || '익명',  // 닉네임이 없으면 기본값 사용
        text: message,
        timestamp: Date.now(),
      };

      // Firebase에 새 메시지 저장
      database.ref('messages').push(newMessage);
      setMessage('');  // 메시지 전송 후 입력란 초기화
    }
  };

  // Firebase에서 메시지 가져오기
  useEffect(() => {
    const messageRef = database.ref('messages');
    
    messageRef.on('value', (snapshot) => {
      const data = snapshot.val();
      // const parsedMessages = data ? Object.values(data) : [];
      const parsedMessages = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : []; // key 포함
      setMessages(parsedMessages);
    });

    return () => messageRef.off();
  }, []);

   // 메시지 삭제 함수
   const deleteMessage = (key) => {
    Alert.alert(
      '삭제 확인',
      nickname == '관리자' ? 
      '관리자 권한으로 해당 메세지를 삭제합니다.' 
      : 
      '이 메시지를 삭제하시겠습니까?',
      [ 
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            database.ref(`messages/${key}`).remove();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteAllMessage = (key) => {
    Alert.alert(
      '경고',
      "관리자 권한으로 채팅방의 '전체' 메세지를 모두 삭제합니다. 진행하시겠습니까?",
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: () => {
            database.ref(`messages`).remove();
          },
        },
      ],
      { cancelable: true }
    );
  };

  printBubble_you = ( item ) => { //상대 말풍선
    return (
      <View>
        {/* <View style={{flexDirection:'row', alignItems: 'center'}}> */}
        <Text style={styles.nicknameText}>{item.nickname}</Text>
        <View style={{flexDirection:'row', alignItems: 'center'}}>
          <View style={styles.tailLeft} />
          <View style={[styles.bubble, styles.leftBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
          { //관리자인 경우 상대 메세지 삭제 가능
            nickname == '관리자' &&
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMessage(item.key)}>
              <Text style={{color:'black', fontSize: 13, fontWeight:'bold'}}> X </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  };

  printBubble_me = ( item ) => { //본인 말풍선
    return (
      <View style={{flexDirection:'row-reverse', alignItems: 'center'}}>
        <View style={styles.tailRight} />
        <View style={[styles.bubble, styles.rightBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMessage(item.key)}>
          <Text style={{color:'black', fontSize: 13, fontWeight:'bold'}}> X </Text>
        </TouchableOpacity>
    </View>
    )
  }

  return (
  <View style={{ flex: 1, backgroundColor: 'green'}}>
    
      <View style={{alignItems:'center', justifyContent:'center'}}>
        {/* <View style={styles.nicknameContainer}>
          <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
        </View> */}
        {nickname=='관리자' ? 
        <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 관리자 모드입니다. \n채팅 관리가 가능합니다.")}> 
          <Text style={{color: 'red', fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text> 
        </TouchableOpacity> 
        :
        <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}>
          <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
        </TouchableOpacity>
        }

        {nickname=='관리자' &&
        <TouchableOpacity style={styles.deleteAllButton} onPress={() => deleteAllMessage()}>
          <Text style={{color:'white', fontSize: 13, fontWeight:'bold'}}> 채팅 전체 삭제 </Text>
        </TouchableOpacity>
        }

        <TodayMatch Component={'Chat'}/>
      </View>


      <FlatList
        data={messages}
        // renderItem={({ item }) => (
        //   <View style={{ marginBottom: 5 }}>
        //     <Text style={{ fontWeight: 'bold' }}>{item.nickname}</Text>
        //     <Text>{item.text}</Text>
        //   </View>
        // )}
        renderItem={({ item }) => (
          (item.nickname === nickname) ? printBubble_me(item) : printBubble_you(item)
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 60 }} // 입력란을 위한 여백 추가
        ListEmptyComponent={
          <View style={{ padding: 10, alignItems: 'center' }}>
            <Text>메시지가 없습니다.</Text>
          </View>
        }
      />

      <View style={{ padding: 10, backgroundColor:'#90EE90', flexDirection:'row' }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
          maxLength={300}
          style={{ borderWidth: 1, padding: 5, backgroundColor:'white', borderRadius: 10, flex: 1 }}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Image
            source={require('../../../assets/icon/send.png')}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  nicknameContainer: {
    width: '98%',
    padding: 0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 10,
    marginTop: 5,
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
    marginVertical: 5,
    position: 'relative',
    backgroundColor: '#e1ffc7', 
    overflow: 'visible', // 꼬리가 잘리지 않도록 설정
  },
  messageText: {
    fontSize: 13,
    color: '#000',
  },
  nicknameText: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: -5,
  },
  leftBubble: {
    backgroundColor: '#e1ffc7', // 상대방 말풍선 색상
    alignSelf: 'flex-start',
  },
  rightBubble: {
    backgroundColor: '#d1d1d1', // 내가 보낸 말풍선 색상
    alignSelf: 'flex-end',  
  },
  tailLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 10, // 위쪽 경계선
    borderBottomWidth: 10, // 아래쪽 경계선
    borderTopColor: 'transparent', // 위쪽 투명 처리
    borderBottomColor: 'transparent', // 아래쪽 투명 처리
    borderRightWidth: 15, // 오른쪽 경계선으로 삼각형의 너비 설정
    borderRightColor: '#e1ffc7', // 오른쪽 색상으로 삼각형 색 지정
    marginRight: -4,
    // marginTop: 15,
  },
  tailRight: {
    width: 0,
    height: 0,
    borderTopWidth: 10, // 위쪽 경계선
    borderTopColor: 'transparent', // 위쪽 투명 처리
    borderBottomWidth: 10, // 아래쪽 경계선
    borderBottomColor: 'transparent', // 아래쪽 투명 처리
    borderLeftWidth: 15, // 왼쪽 경계선으로 삼각형의 너비 설정
    borderLeftColor: '#d1d1d1', // 왼쪽 색상으로 삼각형 색 지정
    marginLeft: -4,
    // marginTop: 15,
  },
  sendButton: {
    backgroundColor: "skyblue",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#90EE90",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  deleteAllButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
    width: '98%',
  },
});
