// WriteForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Wrapper, Form, Input } from "./ui/post_ui";
import styled from "styled-components";
import { Trash2 } from "lucide-react";
import { addPost } from "../api/firestore";
import type { User } from "firebase/auth";

const XButton = styled.div`
    position: absolute;
    right: 10px;
    margin: 4px;
    cursor: pointer;
`
const ButtonWrapper = styled.div`
    display: flex;
    gap: 12px;
`
interface FormValues{
    message: string;
    category: string;
    image_file: FileList;
};
interface PostProps{
    user: User | null
    onClose: () => void
}
export default function Post({user, onClose}:PostProps) {
    if(!user) return null;

    const { register, resetField,handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
    const [preview, setPreview] = useState<string | null>(null);
    const onSubmit = (data: FormValues) => {
        (async () => {
            await addPost(user.uid, 
                user.displayName, 
                data.category,
                data.message, 
                data.image_file?.[0])
        })();
        reset();
        setPreview(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file){
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleDelete = () => {
        setPreview(null)
        resetField("image_file",)
    }
return (
    <Wrapper>
    <Form onSubmit={handleSubmit(onSubmit)}>
    <Input>
    <select
        {...register("category", { required: "카테고리를 선택해주세요." })}
    >
        <option value="일반">일반</option>
        <option value="공지">공지</option>
        <option value="일정">일정</option>
    </select>
    </Input>
    {errors.category && (
        <p style={{ color: "red" }}>{errors.category.message}</p>
    )}
    <Input>
    <textarea
        {...register("message", { required: "내용을 입력해주세요.", maxLength:150 })}
        placeholder="내용을 입력하세요" maxLength={150}
    />
    </Input>
    {errors.message && (
    <p style={{ color: "red" }}>{errors.message.message}</p>
    )}
    <Input style={{ marginBottom: 12 }} className="img_button">
    <label>이미지 업로드
    <input
        type="file"
        accept="image/*"
        {...register("image_file", 
            {
                validate: {
                    lessThan5MB: (files) =>
                        !files[0] || files[0].size < 5 * 1024 * 1024 || "5MB 이하만 업로드 가능합니다.",
                },
                onChange:handleImageChange
            })}
    /></label>
    <XButton onClick={handleDelete}><Trash2 size={20} /></XButton>
    {preview && (
        <div className="img_preview">
        <img src={preview} alt="preview"/>
        </div>
    )}
    </Input>
    <ButtonWrapper>
        <button type="submit">작성하기</button>
        <button type="button" onClick={onClose}>닫기</button>
    </ButtonWrapper>
    </Form>
    </Wrapper>
);
}