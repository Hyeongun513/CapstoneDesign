import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database } from './firebaseConfig';  // firebaseConfig 파일 불러오기
import { Link, router, useLocalSearchParams } from 'expo-router'; // 닉네임 받기

const ForumPost = () => {
  const { nickname } = useLocalSearchParams(); // 닉네임 받아오기

  const [title, setTitle] = useState('');      // 게시글 제목 입력
  const [content, setContent] = useState('');  // 게시글 내용 입력

  // 게시글 생성 함수
  const createPost = () => {
    if (title.trim() && content.trim()) {
      const newPost = {
        nickname: nickname || '익명',  // 닉네임 없으면 '익명'
        title: title,
        content: content,
        timestamp: Date.now(),
        comments: {}  // 댓글 리스트 초기화
      };

      // Firebase에 새 게시글 저장
      database.ref('posts').push(newPost);
      setTitle('');  // 입력란 초기화
      setContent('');
    } else {
      Alert.alert('오류', '제목과 내용을 입력해주세요.');
    }
  };

  return (
  <View style={{ flex: 1, padding: 10, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}>
        <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>작성자 : {nickname}</Text>
      </TouchableOpacity>
      
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        style={styles.titleInput}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        style={styles.contentInput}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={createPost}>
        <Text style={styles.buttonText}>게시글 작성</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { router.replace(`./ForumHome?nickname=${nickname}`); }}>
        <Text style={styles.buttonText}>이전화면</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ForumPost;

const styles = StyleSheet.create({
  nicknameContainer: {
    width: '98%',
    padding: 0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 10,
    marginVertical: 5,
  },
  titleInput: {
    width: '98%',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  contentInput: {
    flex: 1,
    width: '98%',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  button: {
    width: '98%',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});