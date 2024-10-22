import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { database } from './firebaseConfig';  // firebaseConfig 파일 불러오기
import { Link, router, useLocalSearchParams } from 'expo-router'; // 닉네임 받기

const ForumHome = () => {
  const { nickname } = useLocalSearchParams(); // 닉네임 받아오기

  const [posts, setPosts] = useState([]);      // 게시글 리스트
  const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글
  const [comment, setComment] = useState('');  // 댓글 입력

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
    <View style={{ flex: 1, padding: 10, backgroundColor: 'green', alignContent: 'center', justifyContent: 'center' }}>

      {/* 게시글 리스트 */}
      {!selectedPost ? (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>

          <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}>
            <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
          </TouchableOpacity>

          {/* <View style={styles.listContainer}> */}
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectPost(item)} style={styles.postContainer}>
                  {console.log('SelectedPost 값 : ', selectedPost)}
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style= {{fontWeight:'bold'}}>작성자 :</Text>
                    <Text style={styles.postNickname}>{item.nickname}</Text>
                  </View>

                  <Text style={styles.postTimestamp}>{new Date(item.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text>게시글이 없습니다.</Text>}
              // style={styles.listContainer}
            />
            {/* </View> */}
              <TouchableOpacity style={styles.button} onPress={() => { router.replace(`./ForumPost?nickname=${nickname}`); }}>
                <Text style={styles.buttonText}>게시글 작성하기</Text>
              </TouchableOpacity>

        </View>
      ) : (
        <>
        <FlatList 
        data={[]}
        renderItem={null}
        ListEmptyComponent = { () => (
        <View style={{ flex: 1 }}>
          {console.log('SelectedPost 값 : ', selectedPost)}
          
          {/* 선택된 게시글과 댓글 보기 */}
          {/* 제목 */}
          <View style={{borderWidth:1, borderRadius: 5}}>
            <View style={styles.titleContainer}> 
              <Text style={styles.selectedPostTitle}>{selectedPost.title}</Text>
            </View>

            {/* 작성자 및 게시글 작성 시간 출력 */}
            <View style={styles.infoContainer}> 
              <View style={{flexDirection:'row'}}> 
                <Text style={{fontWeight:'bold'}}>작성자 : </Text> 
                <Text style={styles.postNickname}>{selectedPost.nickname}</Text>
              </View>
              <View style={{alignItems: 'flex-end', marginTop: -10}}>
                <Text>{new Date(selectedPost.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</Text>
              </View>
            </View>
            </View>
            {/* 글 내용 */}
            <View style={styles.contentContainer}> 
              <Text style={styles.selectedPostContent}>{selectedPost.content}</Text>
          </View>

          {/* 댓글 리스트 */}
          <FlatList
            data={selectedPost.comments ? Object.values(selectedPost.comments) : []}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentNickname}>{item.nickname}</Text>
                <Text>{item.text}</Text>
                <Text style={styles.commentTimestamp}>{new Date(item.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text>댓글이 없습니다.</Text>}
          />
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => setSelectedPost(null)}>
              <Text style={styles.buttonText}> 목록으로 </Text>
            </TouchableOpacity>
        </View>
        )}
        />
          {/* 댓글 작성 섹션 */}
          <View style={{backgroundColor:'#90EE90'}}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="댓글을 입력하세요"
                style={styles.input}
              />
              <TouchableOpacity style={{
                backgroundColor: "skyblue",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                marginLeft: 5,
                marginVertical: 5,
              }} onPress={addComment}>
                <Image
                  source={require('../../../assets/icon/send.png')}
                  style={{ width: 25, height: 25, }}
                />
              </TouchableOpacity>
            </View>

            {/* 뒤로가기 버튼 */}
          </View>
        </>
      )}
    </View>
  );
};

export default ForumHome;

const styles = StyleSheet.create({
  nicknameContainer: {
    // width: '98%',
    padding: 0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#90EE90', //green: #008000
    borderRadius: 10,
    marginTop: 5,
    },
  postContainer: {
    // width:'98%',
    // justifyContent:'center',
    // alignItems:'center',
    backgroundColor: '#90EE90',
    borderRadius: 20,
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
  },
  titleContainer: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#90EE90', //green: #008000
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  infoContainer: {
    // width:'98%',
    // justifyContent:'center',
    // alignItems:'center',
    backgroundColor: '#90EE90',
    borderTopWidth: 1,
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  contentContainer: {
    // width:'98%',
    justifyContent:'center',
    // alignItems:'center',
    backgroundColor: '#90EE90',
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    //Comments
  },
  commentContainer: {
    // width:'98%',
    justifyContent:'center',
    // alignItems:'center',
    backgroundColor: '#90EE90',
    borderRadius: 10,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    //borderWidth: 1, padding: 5, backgroundColor:'white', borderRadius: 10, flex: 1
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
  // postContainer: {
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderColor: '#eee',
  // },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postNickname: {
    fontStyle: 'italic',
    color: 'black',
  },
  postTimestamp: {
    fontSize: 12,
    color: 'black',
  },
  selectedPostTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 7,
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