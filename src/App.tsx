import styled from "styled-components"
import Login from "./components/login";
import Join from "./components/join";
import Talking from "./components/talking";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { type User } from "firebase/auth";
import Header from "./components/header";
import Bottom from "./components/bottom";
import { ToastContainer } from "react-toastify";
const Wrapper = styled.div`
  max-width: 800px;
  min-width: 412px;
  height: 100vh;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: CadetBlue;
  color: White;
`
const Contents = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
function App() {
  const [user, setUser] = useState<User | null>(null)
  const [is_login, setLogin] = useState(false)
  const [is_join, setJoin] = useState(false)
  useEffect(() => {
    (async () => {
      await auth.authStateReady();
      if(auth.currentUser){
        setUser(auth.currentUser);
      }
    })();
    console.log("effect")
  },[])

  const handleLogin = (user:User) => {
    setUser(user)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const openLogin = () => {
    setLogin(true)
    setJoin(false)
  }
  const openJoin = () => {
    setLogin(false)
    setJoin(true)
  }
  const onClose = () => {
    setLogin(false)
    setJoin(false)
    console.log("logout")
  }
  return (
    <Wrapper>
      <Header user={user} openLogin={openLogin} openJoin={openJoin} onClose={onClose} handleLogout={handleLogout}/>
      <Contents>
        <h1>우리들의 이야기</h1>
        {is_login && <Login onClose={()=>setLogin(false)} handleLogin={handleLogin}/>}
        {is_join && <Join onClose={()=>setJoin(false)} handleLogin={handleLogin}/> }
        <Talking />
      </Contents>
      <Bottom />
      <ToastContainer />
    </Wrapper>
  )
}

export default App
