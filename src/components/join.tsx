import { useForm, type SubmitHandler } from "react-hook-form";
import { Wrapper, Header, Form, Input } from "./ui/login_ui";
import { CircleX } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}
interface JoinProps{
  onClose: () => void
  handleLogin: (user:User) => void
}
export default function Join({onClose,handleLogin}:JoinProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignUpForm>();

  const onSubmit: SubmitHandler<SignUpForm> = (data) => {
    console.log("회원가입 데이터:", data);
    //패스워드 확인
    if(data.password !== data.password_confirm){
      setError("password_confirm",{
        type: "manual",
        message: "두 패스워드가 일치하지 않습니다."
      })
      return;
    }
    createUserWithEmailAndPassword(auth,data.email,data.password)
    .then((userCredential) => {
      console.log(userCredential)
      handleLogin(userCredential.user)
      onClose();
      toast.success("회원가입 되었습니다.",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
      });
      //update user display name
      updateProfile(userCredential.user,{
          displayName: data.name
      });
    }).catch((error) => {
      console.error(error.message)
      if(error instanceof FirebaseError){
        toast.info(error.code,{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
        })
      }else{
        toast.info("[에러]이메일/패스워드 확인하세요!",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
        })
      }
    });
  };

  return (
    <Wrapper>
      <Header>
        <h2>회원가입</h2>
        <div className="button">
          <CircleX size={22} onClick={onClose}/>
        </div>
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input>
          <input type="text" placeholder="이름"
            {...register("name", {
              required: "이름을 입력해주세요",
              minLength: {
                value: 2,
                message: "이름은 최소 2자 이상이어야 합니다"
              }
            })}
          />
        </Input>
          {errors.name && (
            <p>{errors.name.message}</p>
          )}
        <Input>
          <input type="email" placeholder="이메일"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식이 아닙니다"
              }
            })}
          />
        </Input>
          {errors.email && (
            <p>{errors.email.message}</p>
          )}
        <Input>
          <input type="password" placeholder="비밀번호"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다"
              }
            })}
          />
        </Input>
          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        <Input>
          <input type="password" placeholder="비밀번호 확인"
            {...register("password_confirm", {
              required: "비밀번호를 다시 입력해주세요",
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다"
              }
            })}
          />
        </Input>
          {errors.password_confirm && (
            <p>{errors.password_confirm.message}</p>
          )}
        <button type="submit">가입하기</button>
      </Form>
    </Wrapper>
  );
}