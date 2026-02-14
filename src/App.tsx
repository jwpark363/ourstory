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
import { LibraryBig, Pencil, Plus } from "lucide-react";
import Post from "./components/new_post";
import Profile from "./components/profile";
const Wrapper = styled.div`
  position: relative;
  max-width: 800px;
  min-width: 412px;
  height: 100vh;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: White;
`
const Contents = styled.div`
  flex: 1;
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid white;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: CadetBlue;
  opacity: 0.9;
  h1{
    color: brown;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
  }
`;
const AddPostButton = styled.div`
  position: absolute;
  top: 4px;
  left: 184px;
  width: 30px;
  height: 30px;
  border: 1px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
function App() {
  const [user, setUser] = useState<User | null>(null)
  const [is_login, setLogin] = useState(false)
  const [is_join, setJoin] = useState(false)
  const [is_post, setPost] = useState(false)
  const [is_profile, setProfile] = useState(false)
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
  const openProfile = () => setProfile(prev => !prev)
  const onClose = () => {
    setLogin(false)
    setJoin(false)
    console.log("logout")
  }
  return (
    <Wrapper>
      <Header user={user}
        openLogin={openLogin} 
        openJoin={openJoin}
        openProfile={openProfile}
        onClose={onClose}
        handleLogout={handleLogout}/>
      <AddPostButton onClick={() => setPost(true)}>
        <Plus size={14} />
        <Pencil size={18} />
      </AddPostButton>
      <Contents>
        <h1><LibraryBig size={24}/> 우리들의 이야기</h1>
        {is_login && <Login onClose={()=>setLogin(false)} handleLogin={handleLogin}/>}
        {is_join && <Join onClose={()=>setJoin(false)} handleLogin={handleLogin}/> }
        {is_post &&  <Post user={user} onClose={() => setPost(false)}/> }
        {is_profile && <Profile /> }
        <Talking />
      </Contents>
      <Bottom />
      <ToastContainer />
    </Wrapper>
  )
}

export default App
