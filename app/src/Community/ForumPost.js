import React, { useState } from 'react'; 
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { database } from './firebaseConfig';  
import { router, useLocalSearchParams } from 'expo-router'; 

const ForumPost = () => { 
  const { nickname } = useLocalSearchParams(); 
  const [title, setTitle] = useState('');    
  const [content, setContent] = useState(''); 
  const [password, setPassword] = useState(''); // 비밀번호 입력
  const [selectedTag, setSelectedTag] = useState(''); // 태그 선택

  const createPost = () => { 
    if (title.trim() && content.trim() && password.trim() && selectedTag) { 
      const newPost = { 
        nickname: nickname || '익명',  
        title: title, 
        content: content, 
        password: password,  // 비밀번호 저장
        tag: selectedTag, // 선택된 태그 저장
        timestamp: Date.now(), 
        comments: {}  
      }; 

      database.ref('posts').push(newPost); 
      setTitle('');  
      setContent(''); 
      setPassword(''); // 입력란 초기화
      setSelectedTag(''); 
      // router.replace(`./ForumHome?nickname=${nickname}`);
      Alert.alert(
        "알림",
        "게시글이 성공적으로 작성되었습니다.",
        [{ text: "확인", onPress: () => { router.replace(`./ForumHome?nickname=${nickname}`); } }],
        { cancelable: false }
      );

    } else { 
      Alert.alert('오류', '제목, 내용, 비밀번호, 태그를 모두 입력해주세요.'); 
    } 
  }; 

  return ( 
    <View style={{ flex: 1, padding: 10, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}> 
      {nickname=='관리자' ? 
      <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 관리자 모드입니다. \n공지만 작성 가능합니다.")}> 
        <Text style={{color: 'red', fontWeight:'bold', fontSize: 15, margin: 10}}>작성자 : {nickname}</Text> 
      </TouchableOpacity> 
      :
      <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}> 
        <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>작성자 : {nickname}</Text> 
      </TouchableOpacity> 
      }

        {/* 태그 선택 메뉴 */}
        <View style={styles.pickerContainer}>
          {nickname=='관리자' ?
          <Picker
          selectedValue={selectedTag}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTag(itemValue)}
          >
            <Picker.Item label="태그를 선택해주세요" value='' />
            <Picker.Item label="공지" value="공지" />
          </Picker>
          :
          <Picker
            selectedValue={selectedTag}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTag(itemValue)}
          >
            <Picker.Item label="태그를 선택해주세요" value='' />
            <Picker.Item label="자유" value="자유" />
            <Picker.Item label="리뷰" value="리뷰" />
            <Picker.Item label="프리뷰" value="프리뷰" />
            <Picker.Item label="분석" value="분석" />
            <Picker.Item label="질문" value="질문" />
          </Picker>
          }
        </View>
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

      {/* 비밀번호 입력란 */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry={true} // 비밀번호 숨김
        maxLength={4}
        style={styles.passwordInput}
      />
      <View style={{flexDirection:'row', width: '98%'}}>
        <TouchableOpacity style={styles.returnButton} onPress={() => { router.replace(`./ForumHome?nickname=${nickname}`); }}> 
          <Text style={{color: 'white', fontWeight:'bold'}}>이전화면</Text> 
        </TouchableOpacity> 
        <TouchableOpacity style={styles.writeButton} onPress={createPost}> 
          <Text style={{fontWeight:'bold'}}>게시글 등록</Text> 
        </TouchableOpacity> 
      </View>
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
    backgroundColor: '#90EE90', 
    borderRadius: 10, 
    marginBottom: 5, 
  }, 
  pickerContainer: {
    width: '98%', 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' , 
    overflow: 'hidden', 
    borderRadius: 10,
    borderWidth: 1,
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
  passwordInput: {
    width: '98%', 
    borderWidth: 1, 
    backgroundColor: 'white', 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 10, 
  },
  picker: {
    width: '100%',
    height: 10,
    marginVertical: 5,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  writeButton: {
    flex: 1,
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  returnButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
});
