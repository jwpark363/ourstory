import styled from "styled-components"
const Wrapper = styled.div`
    padding: 12px ;
    width: 100%;
    background-color: lightseagreen;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: FloralWhite;
    h1{
        font-size: 14px;
        font-weight: bold;
    }
`
export default function Bottom(){
    return(
        <Wrapper>
            <h1>2010년 1월부터, 현재 40명 회원 활동중</h1>
            <h1>***동호회</h1>
        </Wrapper>
    )
}