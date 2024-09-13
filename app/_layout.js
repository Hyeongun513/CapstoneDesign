import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
SplashScreen.preventAutoHideAsync(); //SplashScreen : 앱이 뜰 때, 서버에서 데이터를 가져오는 동안 사용자에게 보여주는 스크린.(일종의 로딩?)
//preventAutoHideAsync : SplashScreen을 감추지 말고 보여줘라 라는 의미
export default function RootLayout() {
    useEffect(() => { //첫번째 리턴 후에 한번만 호출, 
        SplashScreen.hideAsync(); //SplashScreen을 감춰라
    }, []);
    return ( //헤더 부분의 스타일 지정
        <Stack screenOptions={{
            cardStyle: { backgroundColor: "#ffffff" },
            headerStyle: {
                height: 110,
                backgroundColor: "#95a5a6",
                borderBottomWidth: 5,
                borderBottomColor: "#34495e",
            },
            headerTiteStyle: { color: "#ffffff", fontSize: 24 },
            headerTitleAlign: "center",
        }}>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Loading",
                }}
            />
            <Stack.Screen
                name="Home"
                options={{
                    headerTitle: "Loading",
                }}
            />
            <Stack.Screen
                name="src/Test"
                options={{
                    headerTitle: "Test",
                }}
            />
            {/* <Stack.Screen
                name="App"
                options={{
                    headerTitle: "메인화면",
                }}
            />
            <Stack.Screen
                name="AllQ"
                options={{
                    headerTitle: "전체 퀴즈",
                }}
            />
            <Stack.Screen
                name="Park/Quest1/Q1"
                options={{
                    headerTitle: "Quiz1",
                }}
            />
            <Stack.Screen
                name="Park/Quest2/Q2"
                options={{
                    headerTitle: "Quiz2",
                }}
            />
            <Stack.Screen
                name="Park/Quest3/Q3"
                options={{
                    headerTitle: "Quiz3",
                }}
            />
            <Stack.Screen
                name="Lee/Q_1/App"
                options={{
                    headerTitle: "Quiz3",
                }}
            />
            <Stack.Screen
                name="Lee/Q_2_example/App"
                options={{
                    headerTitle: "Quiz4",
                }}
            />
            <Stack.Screen
                name="Lee/Q_2_main/App"
                options={{
                    headerTitle: "Quiz4",
                }}
            /> */}
        </Stack>
    );
};
