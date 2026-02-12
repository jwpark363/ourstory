import styled from "styled-components"
import type { IPost } from "../types"
import PostItem from "./talking_item"
import { useEffect, useState } from "react"
import { getPosts } from "../api/firestore"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    /* border-top: 1px solid ivory; */
`
export default function Talking(){
    const [items, setItems] = useState<IPost[]>([])
    const getPostList = ()=>{
        (async () => {
            const results = await getPosts();
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
  }, []);
    return(
        <Wrapper>
            {items.map((item,idx) => <PostItem key={idx} item={item}/>)}
        </Wrapper>
    )
}