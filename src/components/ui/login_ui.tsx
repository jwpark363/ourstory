import styled from "styled-components"

export const Wrapper = styled.div`
   width: 380px;
   margin: 24px 0px;
   padding: 12px;
   display: flex;
   background-color: Teal;
   flex-direction: column;
   align-items: center;
   gap: 12px;
   border: 1px solid CadetBlue;
`
export const Header = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid white;
  font-size: 18px;
  font-weight: bold;
  .button{
    cursor: pointer;
  }
`
export const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    button{
    all: unset;
    padding: 4px 12px;
    border: 1px solid white;
    cursor: pointer;
    }
    p{
        font-size: 12px;
        color: yellow;
    }
`
export const Input = styled.div`
    width: 280px;
    display: flex;
    justify-content: space-between;
    label{
    font-weight: 600;
    }
`