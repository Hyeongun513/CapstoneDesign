import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import { database } from './firebaseConfig';  // firebaseConfig 파일 불러오기
import { Link, router, useLocalSearchParams } from 'expo-router'; // 닉네임 받기

const ForumHome = () => {
  const { nickname } = useLocalSearchParams(); // 닉네임 받아오기

  const [posts, setPosts] = useState([]);      // 게시글 리스트
  const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글
  const [comment, setComment] = useState('');  // 댓글 입력
  const [commentData, setCommentData] = useState([]) // 댓글 구조 저장
  const [showComment, setShowComment] = useState('show'); //댓글창 출력 여부

  const [modalVisible, setModalVisible] = useState(false);  // 모달 표시 여부
  const [inputPassword, setInputPassword] = useState('');   // 입력된 비밀번호
  const [postToDelete, setPostToDelete] = useState(null);   // 삭제할 게시글

  // Firebase에서 게시글 불러오기
  useEffect(() => {
    const postsRef = database.ref('posts');
    postsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const parsedPosts = data ? Object.entries(data).map(([id, post]) => ({ id, ...post })).reverse() : []; //.reverse()를 통해 역순 설정하여 최근 데이터가 상단에 표기
      setPosts(parsedPosts);
    });

    return () => postsRef.off(); // 데이터 구독 해제
  }, []);

  // Firebase에서 특정 게시글의 댓글 불러오기
  useEffect(() => {
    if (!selectedPost) return; // 선택된 포스트가 없으면 종료
  
    const postRef = database.ref(`posts/${selectedPost.id}/comments`);
    
    postRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const parsedComments = data 
        ? Object.entries(data).map(([commentId, comment]) => ({
            id: commentId, // comment의 고유 ID 추가
            ...comment,
          }))
        : [];
  
        setCommentData(parsedComments); // comments 상태 업데이트
    });
  
    return () => postRef.off(); // 데이터 구독 해제
  }, [selectedPost]); // selectedPostId가 변경될 때마다 실행

  // 게시글 삭제 확인 모달 표시 함수
  const confirmDeletePost = (post) => {
    setPostToDelete(post);   // 삭제할 게시글 설정
    setModalVisible(true);   // 모달 표시
  };

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

      //특정 댓글 삭제 함수(관리자 모드로 삭제)
      const deleteComment = (commentId) => {
        Alert.alert(
          "댓글 삭제",
          "관리자 권한으로 해당 댓글을 즉시 삭제합니다.",
          [
            {
              text: "취소",
              style: "cancel"
            },
            {
              text: "삭제", onPress: () => {
                // Firebase에서 댓글 삭제
                const postRef = database.ref(`posts/${selectedPost.id}/comments/${commentId}`);
                postRef.remove()
                  .then(() => {
                    Alert.alert("삭제 완료", "해당 댓글이 성공적으로 삭제되었습니다.");
                    // setSelectedPost(null); // 삭제 후 목록으로 돌아가기
                  })
                  .catch((error) => {
                    Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
                    console.error(error);
                  });
              }
            }
          ],
          { cancelable: false }
        );
      };

    //전체 댓글 삭제 함수(관리자 모드로 삭제)
    const deleteAllComment = () => {
      Alert.alert(
        "전체 댓글 삭제",
        "관리자 권한으로 해당 게시글의 모든 댓글을 즉시 삭제합니다.",
        [
          {
            text: "취소",
            style: "cancel"
          },
          {
            text: "삭제", onPress: () => {
              // Firebase에서 댓글 삭제
              const postRef = database.ref(`posts/${selectedPost.id}/comments`);
              postRef.remove()
                .then(() => {
                  Alert.alert("삭제 완료", "전체 댓글이 성공적으로 삭제되었습니다.");
                  setSelectedPost(null); // 삭제 후 목록으로 돌아가기
                })
                .catch((error) => {
                  Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
                  console.error(error);
                });
            }
          }
        ],
        { cancelable: false }
      );
    };

  // 게시글 삭제 함수 (비밀번호 검증 포함)
  const deletePost = () => {
    if (postToDelete) {
      const postRef = database.ref(`posts/${postToDelete.id}`);
      postRef.child('password').once('value', (snapshot) => {
        const storedPassword = snapshot.val();   // Firebase에서 저장된 비밀번호 가져오기
        if (inputPassword === storedPassword) {
          // 비밀번호가 일치하면 게시글 삭제
          postRef.remove()
            .then(() => {
              Alert.alert('삭제 완료', '게시글이 성공적으로 삭제되었습니다.');
              setSelectedPost(null); // 삭제 후 목록으로 돌아가기
              setModalVisible(false); // 모달 닫기
              setInputPassword('');   // 입력된 비밀번호 초기화
            })
            .catch((error) => {
              Alert.alert('오류', '게시글 삭제 중 오류가 발생했습니다.');
              console.error(error);
            });
        } else {
          Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
        }
      });
    }
  };

  //게시글 삭제 함수(관리자 모드로 비밀번호 없이 즉시 삭제)
  const deletePost_Managermod = (postId) => {
    Alert.alert(
      "게시글 삭제",
      "관리자 권한으로 해당 게시글을 즉시 삭제합니다.",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "삭제", onPress: () => {
            // Firebase에서 게시글 삭제
            const postRef = database.ref(`posts/${postId}`);
            postRef.remove()
              .then(() => {
                Alert.alert("삭제 완료", "게시글이 성공적으로 삭제되었습니다.");
                setSelectedPost(null); // 삭제 후 목록으로 돌아가기
              })
              .catch((error) => {
                Alert.alert("오류", "게시글 삭제 중 오류가 발생했습니다.");
                console.error(error);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  // 게시글 선택 시 해당 게시글과 댓글 보기
  // const selectPost = (post) => {
  //   setSelectedPost(post);
  // };

  return (
    <View style={{ flex: 1, backgroundColor: 'green', alignContent: 'center', justifyContent: 'center' }}>

      {/* 게시글 리스트 */}
      {!selectedPost ? ( //selectedPost가 null일 때
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', margin: 5 }}>

          {/* <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}>
            <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
          </TouchableOpacity> */}

          {nickname == '관리자' ? 
          <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 관리자 모드입니다. \n게시글 관리가 가능합니다.")}>
            <Text style={{color: 'red', fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.nicknameContainer} onPress={() => Alert.alert(`${nickname}`, "현재 사용중인 닉네임입니다. \n이전 화면에서 닉네임을 설정할 수 있습니다.")}>
            <Text style={{fontWeight:'bold', fontSize: 15, margin: 10}}>{nickname}</Text>
          </TouchableOpacity>
          }

          {/* <View style={styles.listContainer}> */}
            <FlatList
              data={posts}
              renderItem={({ item }) => ( //setSelectedPost(post) : 게시글 선택 시 해당 게시글과 댓글 보기
                <TouchableOpacity onPress={() => setSelectedPost(item)} style={styles.postContainer}>
                  {console.log('SelectedPost 값 : ', selectedPost)}
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>[{item.tag}] {item.title}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style= {{fontWeight:'bold'}}>작성자 :</Text>
                    <Text style={styles.postNickname}>{item.nickname}</Text>
                  </View>

                  <Text style={{fontSize: 12, color: 'black'}}>{new Date(item.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text>작성된 게시글이 없습니다.</Text>}
            />
              <TouchableOpacity style={styles.writeButton} onPress={() => { router.replace(`./ForumPost?nickname=${nickname}`); }}>
                <Text style={{ fontWeight: 'bold' }}>게시글 작성하기</Text>
              </TouchableOpacity>

        </View>
      ) : ( //selectedPost가 null이 아닐 때.(값이 있을 때)
        <>
        <FlatList //스크롤용 FlatList
        data={[]}
        renderItem={null}
        ListEmptyComponent = { () => (
        <View style={{ flex: 1, margin: 5 }}>
          {/* {console.log('selectedPost.comments 값 : ', selectedPost.comments)}
          {console.log('commentData 값 : ', commentData)} */}
          
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

            {/* 글 내용 */}
            <View style={styles.contentContainer}> 
              <Text style={{marginBottom: 10}}>{selectedPost.content}</Text>
            </View>
          </View>

          {/* 댓글 제목 및 버튼 */}
          <View style={{flexDirection: 'row', marginTop: 30,}}>
            <Text style={{ fontSize: 25}}> 댓글 </Text>
            {showComment == 'show' ? 
            <TouchableOpacity style={{marginTop: 5}} onPress={() => setShowComment('hidden')}>
              {/* <Text style={{fontWeight: 'bold', color:'black'}}> 댓글 숨기기 </Text> */}
              <Image
                source={require('../../../assets/icon/On_Button.png')}
                style={{ width: 60, height: 30, }}
              />
            </TouchableOpacity> 
          : 
            <TouchableOpacity style={{marginTop: 5}} onPress={() => setShowComment('show')}>
              {/* <Text style={{fontWeight: 'bold', color:'white'}}> 댓글 보기 </Text> */}
              <Image
                source={require('../../../assets/icon/Off_Button.png')}
                style={{ width: 60, height: 30, }}
              />
            </TouchableOpacity> 
          }
          </View>
          
          {/* 댓글 리스트 */}
          <View style={styles.bigCommentContainer}>
            {showComment == 'show' ? 
            <FlatList
              // data={selectedPost.comments ? Object.values(selectedPost.comments) : []}
              data={commentData ? Object.values(commentData) : []}
              renderItem={({ item }) => (
                <View style={styles.smallCommentContainer}>

                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 5}}>{item.nickname}</Text>
                    {nickname == '관리자' && 
                    <TouchableOpacity style={styles.commentDeleteButton} onPress={() => deleteComment(item.id)} >
                      <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 2 }}> X </Text>
                    </TouchableOpacity>
                  }
                  </View>

                  <Text>{item.text}</Text>
                  <Text style={{fontSize: 10, color: '#5F5F5F'}}>{new Date(item.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</Text>
                  {/* <Text>{item.id}</Text> */}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<Text style={{fontWeight:'bold'}}>댓글이 없습니다.</Text>}
              nestedScrollEnabled={true}
            />
            :
            <Text style={{fontWeight:'bold'}}>댓글이 숨김 처리 되었습니다.</Text>
            }
          </View>

            {/* 게시글 삭제 버튼 */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeletePost(selectedPost)} // 삭제 확인 모달 표시 함수 호출
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>게시글 삭제</Text>
            </TouchableOpacity>

            {/* 뒤로가기 버튼 */}
            <TouchableOpacity style={styles.returnButton} onPress={() => setSelectedPost(null)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}> 목록으로 </Text>
            </TouchableOpacity>

            {/* 관리자 메뉴 */}
            {nickname == '관리자' && 
            <View style={styles.bigCommentContainer}>

              <Text style={{color: 'red', fontSize: 25, marginBottom: 10}}> 관리자 메뉴 </Text>
              
              <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center', marginVertical: 2}}>
                <Text style={{fontWeight:'bold', marginLeft: 5, fontSize: 15}}> 게시글 비밀번호 : {selectedPost.password}</Text>
                <TouchableOpacity style={[styles.deleteButton, {width: 130, marginVertical: 0, padding: 7}]} onPress={() => deletePost_Managermod(selectedPost.id)} >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>게시글 즉시 삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center'}}>
                <View />
                <TouchableOpacity style={[styles.deleteButton, {width: 130, marginVertical: 0, padding: 7}]} onPress={() => deleteAllComment(selectedPost.id)} >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>전체 댓글 즉시 삭제</Text>
                </TouchableOpacity>
              </View>

            </View>
            }
        </View>
        )}
        />
          {/* 댓글 작성 섹션 */}
          <View style={{flexDirection: 'row', backgroundColor:'#90EE90'}}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="댓글을 입력하세요"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={addComment}>
              <Image
                source={require('../../../assets/icon/send.png')}
                style={{ width: 25, height: 25, }}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
          {/* 비밀번호 확인 모달 */}
          <Modal
            transparent={true} //modal의 배경색 투명하게. false일 경우 배경색 불투명
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} //modal을 닫을 때 호출. (취소와 거의 동일, 뒤로가기 버튼 입력 시 호출)
            animationType="fade" //modal 창이 나타나는 애니메이션 설정, none, slide, fade 세종류
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>비밀번호 입력</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="비밀번호"
                  secureTextEntry={true}
                  value={inputPassword}
                  onChangeText={setInputPassword}
                  maxLength={4}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={deletePost} // 게시글 삭제 함수 호출
                  >
                    <Text style={styles.modalButtonText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'gray' }]}
                    onPress={() => setModalVisible(false)} // 모달 닫기
                  >
                    <Text style={styles.modalButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
    backgroundColor: '#90EE90',
    borderRadius: 20,
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
  },
  titleContainer: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#90EE90',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  infoContainer: {
    backgroundColor: '#90EE90',
    borderTopWidth: 1,
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  contentContainer: {
    justifyContent:'center',
    backgroundColor: '#90EE90',
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
    marginLeft: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  writeButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  sendButton: {
    backgroundColor: "skyblue",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    margin: 5
  },
  returnButton: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  commentDeleteButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  postNickname: {
    fontStyle: 'italic',
    color: 'black',
  },
  selectedPostTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 7,
  },
  bigCommentContainer: {
  justifyContent:'center',
  backgroundColor: '#90EE90',
  borderRadius: 10,
  marginTop: 5,
  padding: 10,
  borderWidth: 1,
  },
  smallCommentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


  // 게시글 삭제 함수(비밀번호 없이 즉시 삭제)
  // const deletePost = (postId) => {
  //   Alert.alert(
  //     "게시글 삭제",
  //     "정말로 이 게시글을 삭제하시겠습니까?",
  //     [
  //       {
  //         text: "취소",
  //         style: "cancel"
  //       },
  //       {
  //         text: "삭제", onPress: () => {
  //           // Firebase에서 게시글 삭제
  //           const postRef = database.ref(`posts/${postId}`);
  //           postRef.remove()
  //             .then(() => {
  //               Alert.alert("삭제 완료", "게시글이 성공적으로 삭제되었습니다.");
  //               setSelectedPost(null); // 삭제 후 목록으로 돌아가기
  //             })
  //             .catch((error) => {
  //               Alert.alert("오류", "게시글 삭제 중 오류가 발생했습니다.");
  //               console.error(error);
  //             });
  //         }
  //       }
  //     ],
  //     { cancelable: false }
  //   );
  // };

    {/* 게시글 삭제 버튼 */}
  {/* <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deletePost(selectedPost.id)} // 게시글 삭제 함수 호출
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>게시글 삭제</Text>
  </TouchableOpacity> */}

