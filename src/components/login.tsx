import { CircleX } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Wrapper, Header, Form, Input } from "./ui/login_ui";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, type User } from "firebase/auth";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

interface LoginForm {
  email: string;
  password: string;
}
interface LoginProps{
  onClose: () => void
  handleLogin: (user:User) => void
}
export default function Login({onClose, handleLogin}:LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    signInWithEmailAndPassword(auth,data.email,data.password)
    .then((userCredential) => {
      console.log(userCredential)
      handleLogin(userCredential.user)
      onClose();
      toast.success("로그인 되었습니다.",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
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
        toast.info("[로그인 에러]이메일/패스워드 확인하세요!",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      }
    });
  };

  return (
    <Wrapper>
      <Header>
        <h2>로그인</h2>
        <div className="button">
          <CircleX size={22} onClick={onClose}/>
        </div>
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">로그인</button>
      </Form>
    </Wrapper>
  );
}