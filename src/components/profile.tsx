import styled from "styled-components";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { uploadAvatar } from "../api/firestorage";
import { updateName } from "../api/firestore";

const Wrapper = styled.div`
    width: 100%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    // background-color: gray;
`
const AvatarUpload = styled.label`
    cursor: pointer;
`
const AvatarImg = styled.img`
    height: 120px;
    border-radius: 20px;
`
const AvatarInput = styled.input`
    display: none;
`
const Name = styled.div`
    font-size: 20px;
    span{
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
`
const NameInput = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    input, button{
        all:unset;
        border: 1px solid white;
        padding: 4px 8px;
    }
    color: white;
    font-size: 16px;
    font-weight: 400;
    button{
        padding: 6px;
        background-color: gray;
    }
`

export default function Profile(){
    const [user,setUser] = useState(auth.currentUser)
    const [avatar, setAvatar] = useState<string | null>(null)
    const [name,setName] = useState<string>("")
    const [is_name, setIsName] = useState(false)
    useEffect(() => {
        setAvatar(user?.photoURL ?? null)
        setName(user?.displayName ?? "")
        setUser(user)
    },[user])
    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1){
            const file = files[0];
            const url = await uploadAvatar(user, file);
            setAvatar(url);
        }
    }
    const onNameChage = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {value} = e.target
        setName(value)
    }
    const handleNameChange = async () => {
        const new_name = name.trim();
        if(Boolean(new_name) && new_name.length >= 1){
            const _name = await updateName(user, new_name);
            setName(_name ?? "");
            setIsName(false);
        }
    }
    return(
        <Wrapper>
            <Name><span onClick={() => setIsName(prev => !prev)}>"{user?.displayName ?? '이름 없음'}"</span> Timeline</Name>
            {is_name && 
            <NameInput>
                <input value={name} onChange={onNameChage}/> <button onClick={handleNameChange}>이름변경</button>
            </NameInput>}
            <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? <AvatarImg src={avatar ?? ""}/> : <User size={40} />}
            </AvatarUpload>
            <AvatarInput id='avatar' type="file" accept="image/*" onChange={onAvatarChange}/>
        </Wrapper>
    )
}