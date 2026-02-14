import styled from "styled-components";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { uploadAvatar } from "../api/firestorage";

const Wrapper = styled.div`
    position: absolute;
    right: 2px;
    top: 56px;
    width: 240px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background-color: gray;
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
const Name = styled.div``

export default function Profile(){
    const user = auth.currentUser
    const [avatar, setAvatar] = useState<string | null>(null)
    useEffect(() => {
        setAvatar(user?.photoURL)
    },[user])
    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        const {files} = e.target;
        if(files && files.length === 1){
            const file = files[0];
            const url = await uploadAvatar(user, file);
            setAvatar(url);
        }
    }

    return(
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? <AvatarImg src={avatar}/> : <User size={40} />}
            </AvatarUpload>
            <AvatarInput id='avatar' type="file" accept="image/*" onChange={onAvatarChange}/>
            <Name>{user?.displayName ?? "이름 없음"}</Name>
        </Wrapper>
    )
}