import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { database } from './firebaseConfig'; // Firebase 설정

const PostDetail = ({ postId, postPassword }) => {
  const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false); // 비밀번호 입력창 표시 여부
  const [inputPassword, setInputPassword] = useState('');

  const handleDeletePost = () => {
    const postRef = database.ref(`posts/${postId}`);
    postRef.remove()
      .then(() => {
        Alert.alert('삭제 완료', '게시글이 성공적으로 삭제되었습니다.');
        setInputPassword(''); // 입력 필드를 초기화
        setIsPasswordInputVisible(false); // 입력창 닫기
      })
      .catch((error) => {
        Alert.alert('오류', '게시글 삭제 중 오류가 발생했습니다.');
        console.error(error);
      });
  };

  const handleDeleteRequest = () => {
    // 비밀번호가 일치하는지 확인
    if (inputPassword === postPassword) {
      handleDeletePost(); // 비밀번호가 맞으면 삭제 진행
    } else {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="게시글 삭제" onPress={() => setIsPasswordInputVisible(true)} />

      {isPasswordInputVisible && (
        <View style={styles.passwordInputContainer}>
          <Text style={styles.label}>비밀번호를 입력하세요</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="비밀번호"
            value={inputPassword}
            onChangeText={setInputPassword}
          />
          <View style={styles.buttonContainer}>
            <Button title="취소" onPress={() => setIsPasswordInputVisible(false)} />
            <Button title="삭제" onPress={handleDeleteRequest} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  passwordInputContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PostDetail;
