import styled from "styled-components"
import type { IPost } from "../types"
import { CalendarCheck, ImageOff, Megaphone, MessageCircle, SquarePen, Trash2 } from "lucide-react"
import { auth } from "../firebase"
import { useState } from "react"
import UpdatePost from "./update_post"
import { deleteImage, deletePost } from "../api/firestore"
import { useConfirm } from "./use-confirm"

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 12px;
    border-bottom: 1px solid whitesmoke;
`
const ItemWrapper = styled.div`
    margin-bottom: 12px;
    width: 80%;
    min-height: 100px;
    padding: 4px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 16px;
    @media (max-width: 420px) {
        width: 94%;
    }
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    div{
        display: flex;
        gap: 12px;
        align-items: center;
    }
`
const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
`
const Content = styled.div`
    margin: 12px 8px;
    color: yellow;
    font-weight: 500;
    line-height: 20px;
`
const Image = styled.div<{$link?:string}>`
    height: ${props => props.$link ? "180px" : "100%"};
    background-image: ${props => props.$link ? `url(${props.$link})` : ""};
    background-size: cover;
    background-position: center;
    @media (max-width: 600px) {
        height: ${props => props.$link ? "100px" : "100%"};   
    }
`
const Button = styled.div`
    cursor: pointer;
`
interface ItemProps{
    item: IPost
}
export default function PostItem({item}:ItemProps){
    const [is_update, setUpdate] = useState(false);
    const {confirm, ConfirmModal} = useConfirm();

    const toDate = (datetime:number) => {
        const date = new Date(datetime)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    const deleteAll = async (user_id:string, doc_id:string) => {
        console.log('delete message');
        const ok = await confirm("정말 삭제하시겠습니까");
        console.log(ok);
        if(ok)
            await deletePost(user_id, doc_id)
    }
    const deletePostImage = async (user_id:string, doc_id:string) => {
        console.log('delete image');
        await deleteImage(user_id, doc_id)
    }
return(
    <Wrapper>
        <ItemWrapper>
            <Header>
                <div>
                    {
                        item.category === "공지" ? <Megaphone size={18}/> :
                        item.category === "일정" ? <CalendarCheck size={18} /> :
                        <MessageCircle size={18} /> 
                    }
                    <span>{item.display_name}</span>    
                </div>
                <div>
                    <span>{toDate(item.created_at)}</span>
                    {item.user_id === auth.currentUser?.uid && 
                        <>
                            <Button onClick={() => setUpdate(true)}><SquarePen size={20} /></Button>
                            {item.image_link && <Button onClick={()=>deletePostImage(item.user_id, item.doc_id)}><ImageOff size={20} /></Button>}
                            <Button onClick={() => deleteAll(item.user_id, item.doc_id)}><Trash2 size={20} /></Button>
                        </>
                    }
                </div>
            </Header>
            <ContentWrapper>
                <Content><pre>{item.message}</pre></Content>
                <Image $link={item.image_link ? item.image_link : ""}/>
            </ContentWrapper>
        </ItemWrapper>
        {is_update && <UpdatePost post={item} onClose={() => setUpdate(false)}/>}
    </Wrapper>
)
}