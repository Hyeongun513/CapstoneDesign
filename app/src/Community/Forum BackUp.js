import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database } from './firebaseConfig';  // firebaseConfig 파일 불러오기
import { useLocalSearchParams } from 'expo-router'; // 닉네임 받기

const ForumPost = () => {
  const { nickname } = useLocalSearchParams(); // 닉네임 받아오기

  const [title, setTitle] = useState('');      // 게시글 제목 입력
  const [content, setContent] = useState('');  // 게시글 내용 입력
  const [posts, setPosts] = useState([]);      // 게시글 리스트
  const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글
  const [comment, setComment] = useState('');  // 댓글 입력

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

  // Firebase에서 게시글 불러오기
  useEffect(() => {
    const postsRef = database.ref('posts');
    postsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const parsedPosts = data ? Object.entries(data).map(([id, post]) => ({ id, ...post })) : [];
      setPosts(parsedPosts);
    });

    return () => postsRef.off(); // 데이터 구독 해제
  }, []);

  // 댓글 작성 함수
  const addComment = () => {
    if (comment.trim() && selectedPost) {
      const newComment = {
        nickname: nickname || '익명',
        text: comment,
        timestamp: Date.now(),
      };

      // 선택된 게시글에 댓글 추가
      const postRef = database.ref(`posts/${selectedPost.id}/comments`);
      postRef.push(newComment);
      setComment('');  // 입력란 초기화
    } else {
      Alert.alert('오류', '댓글을 입력해주세요.');
    }
  };

  // 게시글 선택 시 해당 게시글과 댓글 보기
  const selectPost = (post) => {
    setSelectedPost(post);
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
      
      {/* 게시글 작성 섹션 */}
      {!selectedPost && ( //selectedPost == null 일때만 렌더링
        <>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목"
            style={styles.input}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="내용"
            style={[styles.input, { height: 80 }]}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={createPost}>
            <Text style={styles.buttonText}>게시글 작성</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 게시글 리스트 */}
      {!selectedPost ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectPost(item)} style={styles.postContainer}>
              {console.log('SelectedPost 값 : ', selectedPost)}
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postNickname}>{item.nickname}</Text>
              <Text style={styles.postTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>게시글이 없습니다.</Text>}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {console.log('SelectedPost 값 : ', selectedPost)}
          {/* 선택된 게시글과 댓글 보기 */}
          <Text style={styles.selectedPostTitle}>{selectedPost.title}</Text>
          <Text style={styles.selectedPostContent}>{selectedPost.content}</Text>
          <Text style={styles.postNickname}>작성자: {selectedPost.nickname}</Text>

          {/* 댓글 리스트 */}
          <FlatList
            data={selectedPost.comments ? Object.values(selectedPost.comments) : []}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentNickname}>{item.nickname}</Text>
                <Text>{item.text}</Text>
                <Text style={styles.commentTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text>댓글이 없습니다.</Text>}
          />

          {/* 댓글 작성 섹션 */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="댓글을 입력하세요"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={addComment}>
            <Text style={styles.buttonText}>댓글 작성</Text>
          </TouchableOpacity>

          {/* 뒤로가기 버튼 */}
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => setSelectedPost(null)}>
            <Text style={styles.buttonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ForumPost;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
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
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postNickname: {
    fontStyle: 'italic',
    color: 'gray',
  },
  postTimestamp: {
    fontSize: 12,
    color: 'gray',
  },
  selectedPostTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  selectedPostContent: {
    marginBottom: 10,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  commentNickname: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentTimestamp: {
    fontSize: 10,
    color: 'gray',
  },
});