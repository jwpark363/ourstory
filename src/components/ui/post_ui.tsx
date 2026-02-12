import styled from "styled-components"

export const Wrapper = styled.div`
    width: 412px;
    margin: 24px 0px;
    padding: 12px;
    display: flex;
    background-color: Teal;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border: 1px solid CadetBlue;
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 400;
    color: white;
    &.img_button{
        position: relative;
        flex-direction: column;
        align-items: start;
        label{
            padding: 4px;
            border: 1px solid white;
            cursor: pointer;
        }
    }
    label{
        font-weight: 500;
    }
    input,select,option,textarea{
        padding: 4px 8px;
        width: 100%;
        font-size: 14px;
        &::placeholder{
            font-size: 14px;
            font-weight: 400;
        }
    }
    textarea{
        height: 120px;
        resize: none;
        font-weight: 540;
    }
    input[type='file']{
        display: none;
    }
    .img_preview{
        margin-top: 4px;
        border: 1px solid white;
        img{
            width: 100%;
        }
    }
`