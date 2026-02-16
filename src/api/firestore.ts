import { addDoc, collection, deleteDoc, doc, FirestoreError, 
    getDocs, orderBy, query, updateDoc, 
    where} from "firebase/firestore";
import { db } from "../firebase";
import type { IPost } from "../types";
import { addFile, deleteFile } from "./firestorage";
import { updateProfile, type User } from "firebase/auth";

interface ErrorCodeMap{
    [key: string]: string;
}
const ErrorCode: ErrorCodeMap ={
    permission_denied : "permission-denied",
    not_found : "not-found",
    aborted : "aborted"
}
type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
const COLLECTION = "post"
const DefaultErrorMessage = "알수 없는 오류 입니다. 다시시도해주세요."

const errorMessage = (code: ErrorCode) => {
    switch(code){
        case ErrorCode.permission_denied:
            return "권한이 없습니다."
        case ErrorCode.not_found:
            return "문서를 찾을 수 없습니다."
        case ErrorCode.aborted:
            return "치리중 문제가 발생하였습니다. 다시시도해주세요."
        default:
            return DefaultErrorMessage
    }
}

export interface IResult{
    result: boolean
    data: IPost[]
    message: string | null
}

export const getPosts = async (uid?:string) => {
    let result : IResult = {
        result: false,
        data: [],
        message: null
    }
    try{
        const doc_query = uid ? query(
            collection(db,COLLECTION),
            where("user_id","==",uid),
            orderBy("created_at", "desc")
        ) : query(
            collection(db,COLLECTION),
            orderBy("created_at", "desc")
        )
        const snapshot = await getDocs(doc_query)
        const posts = snapshot.docs.map(doc => ({
            ...doc.data(),
            doc_id: doc.id
        }));
        result.result = true
        result.data = posts as IPost[]
    }catch(err){
        result.result = false
        if(err instanceof FirestoreError){
            result.message = errorMessage(err.code as ErrorCode)
        }else{
            result.message = DefaultErrorMessage
        }
    }
    return result;
}

export const addPost = async (
    uid:string, 
    display_name: string | null,
    category: string, 
    message:string, 
    image_file:File | null) => {
    let result : IResult = {
        result: false,
        data: [],
        message: null
    }
    try{
        const doc_ref = await addDoc(collection(db,COLLECTION),{
                created_at: Date.now(),
                user_id: uid,
                display_name: display_name,
                category: category,
                message: message ? message : "",
                views: 0
        })
        //folder structure post_image/{user_id}/{doc_id}
        if(image_file){
            const image_url = await addFile(uid, doc_ref.id, image_file)
            await updateDoc(doc_ref, {
                "image_link": image_url
            })
        }
        console.log(doc_ref);
        result.result = true;
    }catch(err){
        console.log(err);
        result.result= false;
        if(err instanceof FirestoreError){
            result.message = errorMessage(err.code as ErrorCode)
        }else{
            result.message = DefaultErrorMessage
        }
    }
    return result;
}
export const updatePost = async (
    uid:string,
    doc_id:string, 
    category: string, 
    message:string, 
    image_file:File | null,
    image_link:string | undefined
) => {
    let result : IResult = {
        result: false,
        data: [],
        message: null
    }
    try{
        const doc_ref = doc(db,COLLECTION,doc_id)
        await updateDoc(doc_ref,{
                category: category,
                message: message ? message : "",
        })
        //folder structure post_image/{user_id}/{doc_id}
        if(image_file){
            //delete old image and add new image
            if(image_link)
                await deleteFile(uid,doc_id)
            const image_url = await addFile(uid, doc_id, image_file)
            await updateDoc(doc_ref, {
                "image_link": image_url
            })
        }
        result.result = true;
    }catch(err){
        console.log(err);
        result.result= false;
        if(err instanceof FirestoreError){
            result.message = errorMessage(err.code as ErrorCode)
        }else{
            result.message = DefaultErrorMessage
        }
    }
    return result;
}

export const deletePost = async (uid:string,doc_id:string) => {
    let result : IResult = {
        result: false,
        data: [],
        message: null
    }
    if(!uid || !doc_id) return result
    try{
        await deleteDoc(doc(db, COLLECTION, doc_id))
        await deleteFile(uid,doc_id)
        result.result = true;
    }catch(err){
        console.log(err);
        result.result= false;
        if(err instanceof FirestoreError){
            result.message = errorMessage(err.code as ErrorCode)
        }else{
            result.message = DefaultErrorMessage
        }       
    }
    return result;
}

export const deleteImage = async (uid:string,doc_id:string) => {
    let result : IResult = {
        result: false,
        data: [],
        message: null
    }
    if(!uid || !doc_id) return result
    console.log(uid,doc_id)
    try{
        await deleteFile(uid,doc_id)
        // update image link
        await updateDoc(doc(db, COLLECTION, doc_id),{
            "image_link":""
        })
        result.result = true;
    }catch(err){
        console.log(err);
        result.result= false;
        if(err instanceof FirestoreError){
            result.message = errorMessage(err.code as ErrorCode)
        }else{
            result.message = DefaultErrorMessage
        }       
    }
    return result;
}

export const updateName = async (user:User | null, user_name:string) => {
    if(!user) return null;
    const new_name = user_name.trim()
    if(!Boolean(new_name)) return null;
    if(new_name.length < 1) return null;
    try{
        await updateProfile(user, {
            displayName: user_name
        })
        return user_name
    }catch(err){
        console.log(err)
        throw err
    }
    return null;
}