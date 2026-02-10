import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`
export default function Talking(){
    return(
        <Wrapper>
            <p>이야기들...</p>
        </Wrapper>
    )
}