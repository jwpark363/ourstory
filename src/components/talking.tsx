import styled from "styled-components"
import type { IPost } from "../types"
import PostItem from "./talking_item"
import { useEffect, useState } from "react"
import { getPosts } from "../api/firestore"
import { collection, onSnapshot } from "firebase/firestore"
import { auth, db } from "../firebase"

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    /* border-top: 1px solid ivory; */
`
interface TalkProps{
    is_profile?:boolean
}
export default function Talking({is_profile}:TalkProps){
    const [items, setItems] = useState<IPost[]>([])
    const getPostList = ()=>{
        (async () => {
            const results = await getPosts(is_profile?auth.currentUser?.uid:undefined);
            if(results.result){
                setItems(results.data)
            }
        })();
    }

  useEffect(() => {
    const q = collection(db, "post");
    const unsubscribe = onSnapshot(q, () => {
      getPostList()
    });
    return () => unsubscribe();
  }, [is_profile]);
    return(
        <Wrapper>
            {items.map((item,idx) => <PostItem key={idx} item={item}/>)}
        </Wrapper>
    )
}