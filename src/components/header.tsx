import type { User } from "firebase/auth";
import { LogIn, LogOut, User as Profile, UserPlus } from "lucide-react";
import styled from "styled-components";
import { auth } from "../firebase";
import { toast } from "react-toastify";
const Wrapper = styled.div`
    padding: 12px ;
    width: 100%;
    background-color: lightseagreen;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: FloralWhite;
`
const Title = styled.h1`
    margin-left: 24px;
    font-size: 20px;
    font-weight: bold;
`
const Menu = styled.div`
    display: flex;
    gap: 12px;
    font-size: 14px;
`
const Button = styled.div`
    border: 1px solid darkgreen;
    padding: 4px 8px;
    cursor: pointer;
`
interface HeaderProps{
    user: User | null
    openLogin: () => void
    openJoin: () => void
    openProfile: () => void
    onClose: () => void
    handleLogout: () => void
}
export default function Header({ user, openLogin, openJoin, openProfile, onClose, handleLogout } : HeaderProps){
    const logout = () => {
        (async () => {
            await auth.signOut()
            handleLogout()
            onClose()
            toast.success("로그아웃 되었습니다.",{
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        })();
    }
    return(
        <Wrapper>
            <Title>
                우리들의 이야기
            </Title>
            <Menu>
            {user ? 
                <>
                    <Button onClick={openProfile}>
                        <Profile size={18} />Info
                    </Button>
                    <Button onClick={logout}>
                        <LogOut size={18}/>Logout
                    </Button>
                </>
                : 
                <>
                    <Button onClick={openJoin}>
                        <UserPlus size={18}/>Join
                    </Button>
                    <Button onClick={openLogin}>
                        <LogIn size={18}/>Login
                    </Button>
                </>
            }
            </Menu>
        </Wrapper>
    )
}