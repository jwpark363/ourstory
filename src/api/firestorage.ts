import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"
import { updateProfile, type User } from "firebase/auth"

const IMAGE_STORAGE = "post_image"
const AVATAR_STORAGE = "avatar_image"
export const addFile = async (uid:string, doc_id:string, file:File) => {
    if(!file) return null;
    try{
        const _ref = ref(storage, `${IMAGE_STORAGE}/${uid}/${doc_id}`)
        const image_ref = await uploadBytes(_ref, file)
        const image_url = await getDownloadURL(image_ref.ref)
        console.log(image_ref, image_url)
        return image_url
    }catch(err){
        console.log(err)
        throw err
    }
    return null;
}

export const deleteFile = async (uid:string, doc_id:string) => {
    if(!uid || !doc_id) return
    try{
        const _ref = ref(storage, `${IMAGE_STORAGE}/${uid}/${doc_id}`)
        await deleteObject(_ref)
    }catch(err){
        console.log(err)
        throw err
    }
}

export const uploadAvatar = async (user:User | null, avatar:File) => {
    if(!user) return null;
    if(!avatar) return null;
    try{
        const _ref = ref(storage, `${AVATAR_STORAGE}/${user.uid}`)
        const avatar_ref = await uploadBytes(_ref, avatar)
        const avatar_url = await getDownloadURL(avatar_ref.ref)
        console.log(avatar_ref, avatar_url)
        await updateProfile(user, {
            photoURL: avatar_url
        })
        return avatar_url
    }catch(err){
        console.log(err)
        throw err
    }
    return null;
}