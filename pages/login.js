import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Button from './components/Button';
import Input from './components/Input';
import useMutation from '../libs/client/useMutation';
import classNames from '../libs/client/classNames';
import useUser from '../libs/client/useUser';
import useKoreaTimeNow from '../libs/client/useKoreaTimeNow';
import UserContext from '../libs/client/UserContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
// import TopNavbar from './components/TopNavbar';
// import { useSWRConfig } from 'swr';

const Login = () => {

    const router = useRouter();
    const { isLoggedIn, isEmailVerified, data: userData, mutate: boundMutate, isValidating, isLoading } = useUser();
    // const { mutate: unboundMutate, cache } = useSWRConfig();

    const [mutateLogin, { data: loginData, isLoading: isLoginLoading }] = useMutation("/api/users/login");
    const [mutatePasswordLogin, { data: passwordLoginData, isLoading: isPasswordLoginLoading, error: passwordLoginError }] = useMutation("/api/users/password-login");
    const [mutateFullName, { data: fullNameData, isLoading: isFullNameLoading, error: fullNameError }] = useMutation("/api/users/full-name");
    const [mutatePhone, { data: phoneData, isLoading: isPhoneLoading, error: phoneError }] = useMutation("/api/users/phone");
    // const [mutateNickname, { data: nicknameData, isLoading: isNicknameLoading, error: nicknameError }] = useMutation("/api/users/nickname");
    const [mutateNewPassword, { data: newPasswordData, isLoading: isNewPasswordLoading, error: newPasswordError }] = useMutation("/api/users/new-password");
    const [mutateEmailVerification, { data: emailVerificationData, loading: isEmailVerificationLoading, error: emailVerificationError }] = useMutation("/api/users/email-verification");
    // const [mutateUserVerificationStatus, { data: userVerificationStatusData, loading: isUserVerificationStatusLoading, error: userVerificationStatusError }] = useMutation("/api/users/verification-status");
    // const [mutateConfirmation, { data: confirmationData, isLoading: isConfirmationLoading }] = useMutation("/api/users/confirm");

    const { register: emailRegister, handleSubmit: emailHandleSubmit, reset: resetEmail } = useForm();
    const { register: phoneRegister, handleSubmit: phoneHandleSubmit, reset: resetPhone } = useForm();
    const { register: fullNameRegister, handleSubmit: fullNameHandleSubmit, reset: resetFullName } = useForm();
    // const { register: nicknameRegister, handleSubmit: nicknameHandleSubmit, reset: resetNickname } = useForm();
    const { register: newPasswordRegister, handleSubmit: newPasswordHandleSubmit, reset: resetNewPassword } = useForm();
    const { register: passwordLoginRegister, handleSubmit: passwordLoginHandleSubmit, reset: resetPasswordLogin } = useForm();

    const [method, setMethod] = useState("email");
    const userContext = useContext(UserContext); 

    const [submittedUserAccountInfo, setSubmittedUserAccountInfo] = useState({});
    const [isEmailLoginRequest, setIsEmailLoginRequest] = useState(false);
    const [isNewEmailAccountCreationCompleted, setIsNewEmailAccountCreationCompleted] = useState(false);
    const [isPasswordLoginRequest, setIsPasswordLoginRequest] = useState(false);
    const [isPasswordLoginCompleted, setIsPasswordLoginCompleted] = useState(false);
    const [isFullNameCreationRequest, setIsFullNameCreationRequest] = useState(false);
    const [isFullNameCreationCompleted, setIsFullNameCreationCompleted] = useState(false);
    // const [isNicknameCreationRequest, setIsNicknameCreationRequest] = useState(false);
    // const [isNicknameCreationCompleted, setIsNicknameCreationCompleted] = useState(false);
    const [isNewPasswordCreationRequest, setIsNewPasswordCreationRequest] = useState(false);
    const [isNewPasswordCreationCompleted, setIsNewPasswordCreationCompleted] = useState(false);
    const [isPhoneCreationRequest, setIsPhoneCreationRequest] = useState(false);
    const [isPhoneCreationCompleted, setIsPhoneCreationCompleted] = useState(false);
    const [isEmailVerificationRequest, setIsEmailVerificationRequest] = useState(false);
    const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  
    const onEmailValid = (validForm) => {
        if (isLoginLoading || !validForm) return;
        mutateLogin(validForm);
        setSubmittedUserAccountInfo(validForm);
        setIsEmailLoginRequest(true);
    };

    const onPhoneValid = (validForm) => {
      const phone = "010" + validForm?.phone?.replace(/[^0-9]*/g, "");
      if (!submittedUserAccountInfo?.email || isPhoneLoading || !phone) return;
      mutatePhone({ ...submittedUserAccountInfo, phone }); 
      setSubmittedUserAccountInfo({ ...submittedUserAccountInfo, phone });
  };

    const onFullNameValid = (validForm) => {
      if (!submittedUserAccountInfo?.email || isFullNameLoading || !validForm) return;
      mutateFullName({ ...submittedUserAccountInfo, ...validForm });
    };

    // const onNicknameValid = (validForm) => {
    //   if (!submittedUserAccountInfo || isFullNameLoading) return;
    //   mutateNickname({ ...submittedUserAccountInfo, ...validForm });
    // };

    const onNewPasswordValid = (validForm) => {
        if (!submittedUserAccountInfo?.email || isNewPasswordLoading || !validForm) return;
        mutateNewPassword({ ...submittedUserAccountInfo, ...validForm });
    };

    const onPasswordLoginValid = (validForm) => {
        if (!submittedUserAccountInfo?.email || isPasswordLoginLoading || !validForm) return;
        mutatePasswordLogin({ ...submittedUserAccountInfo, ...validForm });
    };

    useEffect(() => {
        if (loginData && loginData?.ok) { // && loginData?.submittedUserAccountInfo?.email
          setIsEmailLoginRequest(false);
          setIsNewEmailAccountCreationCompleted(true);
          boundMutate();
          // resetEmail();
        };
        // if (loginData && loginData?.ok && loginData?.userSession?.isLoggedIn) {
        //   boundMutate();
        // };
    }, [loginData]);

    useEffect(() => {
      if (submittedUserAccountInfo?.email && isNewEmailAccountCreationCompleted && !loginData?.userProfile?.isAlreadyRegistered && !isFullNameCreationRequest) { // && submittedUserAccountInfo?.email && 
          setIsFullNameCreationRequest(true); 
      }
      else if (submittedUserAccountInfo?.email && isNewEmailAccountCreationCompleted && loginData?.userProfile?.isAlreadyRegistered && !isPasswordLoginRequest) { // && submittedUserAccountInfo?.email
          setIsPasswordLoginRequest(true);
      };
    }, [isNewEmailAccountCreationCompleted]);

    useEffect(() => {
        if (passwordLoginData && passwordLoginData?.ok) {
            setIsPasswordLoginRequest(false);
            setIsPasswordLoginCompleted(true);
        };
    }, [passwordLoginData]);

    useEffect(() => {
      if (isPasswordLoginCompleted) {
        boundMutate();
        router.push("/");
      };
  }, [isPasswordLoginCompleted]);

    useEffect(() => {
      if (fullNameData && fullNameData?.ok) {
          setIsFullNameCreationRequest(false);
          setIsFullNameCreationCompleted(true);
          // setIsNicknameCreationRequest(true);
          // setIsNewPasswordCreationRequest(true);
      };
    }, [fullNameData]);

    useEffect(() => {
      if (isFullNameCreationCompleted && !isNewPasswordCreationRequest) {
          // setIsFullNameCreationRequest(false);
          setIsNewPasswordCreationRequest(true);
      };
    }, [isFullNameCreationCompleted]);

    // useEffect(() => {
    //   if (nicknameData && nicknameData?.ok) {
    //       setIsNicknameCreationRequest(false);
    //       setIsNicknameCreationCompleted(true);
    //       setIsNewPasswordCreationRequest(true);
    //   };
    // }, [nicknameData]);

    useEffect(() => {
        if (newPasswordData && newPasswordData?.ok) {
            setIsNewPasswordCreationRequest(false);
            setIsNewPasswordCreationCompleted(true);
        };
    }, [newPasswordData]);

    useEffect(() => {
      if (isNewPasswordCreationCompleted && !isPhoneCreationRequest) {
        // setIsNewPasswordCreationRequest(false);
        setIsPhoneCreationRequest(true);
        // setIsEmailVerificationRequest(true);
        // console.log("isEmailVerificationRequest: ", isEmailVerificationRequest);
      };
    }, [isNewPasswordCreationCompleted]);

    useEffect(() => {
      if (phoneData && phoneData?.ok) { // && phoneData?.submittedUserAccountInfo?.phone
          // if (isPhoneLoading) return;
          setIsPhoneCreationRequest(false);
          setIsPhoneCreationCompleted(true);
          // setSubmittedUserAccountInfo({ ...submittedUserAccountInfo, ...phoneData?.submittedUserAccountInfo });
      };
      // if (phoneData && phoneData?.ok && !phoneData?.submittedUserAccountInfo?.phone) {
      //   if (isPhoneLoading) return;
      //   setIsPhoneCreationRequest(false);
      //   setIsPhoneCreationCompleted(true);
      // };
    }, [phoneData]);

    useEffect(() => {
      if (isPhoneCreationCompleted) {
          setIsEmailVerificationRequest(true);
      };
    }, [isPhoneCreationCompleted]);

    useEffect(() => {
      if (isEmailVerificationRequest) { // submittedUserAccountInfo?.email && 
          if (isEmailVerificationLoading || !submittedUserAccountInfo?.email) return;
          // console.log("submittedUserAccountInfo: ", submittedUserAccountInfo);
          mutateEmailVerification({ submittedUserAccountInfo });
      };
    }, [isEmailVerificationRequest]);

    useEffect(() => {
        if (emailVerificationData && emailVerificationData?.ok) { 
            setIsEmailVerificationRequest(false);
            setIsEmailVerificationSent(true);
            console.log("Your verification email has been sent at:\n", useKoreaTimeNow());
            // console.log("A verification email has been sent to:\n", submittedUserAccountInfo?.email);
        };
    }, [emailVerificationData]);

    useEffect(() => {
      if (isEmailVerificationSent) {
        boundMutate();
      };
  }, [isEmailVerificationSent]);
  
  return ( 
    <>
    <div className="w-full max-w-xl mx-auto">

    <Head>
        <title>Seodaemun Museum of Natural History: Login</title>
    </Head>

    <div className="mt-16 px-4">
      <h3 className={`font-bold text-center text-gray-700 ${userContext?.isKoreanOption ? "text-2xl md:text-3xl" : "text-lg md:text-2xl"}`}>
          {userContext?.isKoreanOption ? "서대문자연사박물관" : "Seodaemun Museum of Natural History"}
      </h3>
      <div className="mt-8">
        <div>
        {/***** 이메일 상위 제목 (시작) *****/}
        <div className="flex flex-col items-center">
        <div className="grid border-b w-full mt-8 grid-cols-1">
                <button
                    className={classNames(
                    "pb-4 font-medium text-medium border-b-2",
                    method === "email"
                        ? " border-green-500 text-green-500"
                        : "border-transparent hover:text-gray-400 text-gray-500"
                    )}
                >
                    {isPasswordLoginRequest
                    ? (userContext?.isKoreanOption ? "로그인" : "Login")
                    
                    : isPasswordLoginCompleted // || isLoggedIn
                    ? (userContext?.isKoreanOption ? "로그인 완료!" : "Login success!")

                    : isFullNameCreationRequest || isNewPasswordCreationRequest || isPhoneCreationRequest || isEmailVerificationRequest || isEmailVerificationSent
                    ? (userContext?.isKoreanOption ? "회원가입" : "Create a new account")

                    : (userContext?.isKoreanOption ? "로그인 및 회원가입" : "Login & Join")}

                </button>
            </div>

        </div>
        {/***** 이메일 상위 제목 (끝) *****/}
                        
        {/***** 이메일 주소 입력칸 (시작) *****/}
        {!isNewEmailAccountCreationCompleted && !(isLoggedIn && isEmailVerified) // !loginData && !loginData?.ok && !(isLoggedIn && isEmailVerified)

        ?
        <form
            onSubmit={emailHandleSubmit(onEmailValid)}
            className="flex flex-col mt-8 space-y-4 mb-4"
        >
            {method === "email"
            
            ? 
            <Input
                register={emailRegister("email", {
                required: true,
                })}
                name="email"
                label={userContext?.isKoreanOption ? "이메일 입력" : "Enter your email"}
                type="email"
                placeholder={userContext?.isKoreanOption ? "ex. email@naver.com" : "ex. email@gmail.com"}
                language={userContext?.isKoreanOption ? "korean" : "english"}
                required
            />
            : null} 

            <div className="mt-4">
                <Button text={isLoginLoading ? `${userContext?.isKoreanOption ? "로딩 중..." : "Loading..."}` : `${userContext?.isKoreanOption ? "다음" : "Next"}`} />
            </div>
        </form>

        : null}

        {isPasswordLoginRequest && !isPasswordLoginCompleted && !(isLoggedIn && isEmailVerified)
        ?
        <form
            onSubmit={passwordLoginHandleSubmit(onPasswordLoginValid)}
            className="flex flex-col mt-8 space-y-4 mb-4"
        >
            <Input
            register={passwordLoginRegister("password")}
            name="password"
            label={userContext?.isKoreanOption ? "비밀번호 인증" : "Verifying your password"}
            type="password"
            kind="password"
            placeholder={userContext?.isKoreanOption ? "비밀번호를 입력해주세요" : "Please enter your password"}
            language={userContext?.isKoreanOption ? "korean" : "english"}
            required
            />
            <div className="mt-4">
                <Button text={isNewPasswordLoading ? `${userContext?.isKoreanOption ? "인증 중..." : "Verifying..."}` : `${userContext?.isKoreanOption ? "다음" : "Next"}`} />
            </div>
        </form> 

        : null}

        {isNewEmailAccountCreationCompleted && isFullNameCreationRequest && !isFullNameCreationCompleted && !(isLoggedIn && isEmailVerified)
        ?
        <form
            onSubmit={fullNameHandleSubmit(onFullNameValid)}
            className="flex flex-col mt-8 space-y-4 mb-4"
        >
            <Input
            register={fullNameRegister("fullName")}
            name="fullName"
            label={userContext?.isKoreanOption ? "사용자 이름" : "Full Name"}
            type="text"
            kind="text"
            placeholder={userContext?.isKoreanOption ? "본인의 이름을 입력해주세요" : "Enter your full name"}
            language={userContext?.isKoreanOption ? "korean" : "english"}
            required
            />
            <div className="mt-4">
                <Button text={isFullNameLoading ? `${userContext?.isKoreanOption ? "이름 업데이트 중..." : "Updating your full name..."}` : `${userContext?.isKoreanOption ? "다음" : "Next"}`} />
            </div>
        </form> 

        : null}

        {isFullNameCreationCompleted && isNewPasswordCreationRequest && !isNewPasswordCreationCompleted && !(isLoggedIn && isEmailVerified) // isNicknameCreationCompleted
        ?
        <form
            onSubmit={newPasswordHandleSubmit(onNewPasswordValid)}
            className="flex flex-col mt-8 space-y-4 mb-4"
        >
            <Input
            register={newPasswordRegister("newPassword")}
            name="newPassword"
            label={userContext?.isKoreanOption ? "새로운 비밀번호" : "New Password"}
            type="password"
            kind="password"
            placeholder={userContext?.isKoreanOption ? "새로운 비밀번호를 입력해주세요" : "Please enter your new password"}
            language={userContext?.isKoreanOption ? "korean" : "english"}
            required
            />
            <div className="mt-4">
                <Button text={isNewPasswordLoading ? `${userContext?.isKoreanOption ? "새로운 비밀번호 설정 중..." : "Setting a new password..."}` : `${userContext?.isKoreanOption ? "다음" : "Next"}`} />
            </div>
        </form> 

        : null}

        {isNewPasswordCreationCompleted && isPhoneCreationRequest && !isPhoneCreationCompleted && !(isLoggedIn && isEmailVerified) // isNicknameCreationCompleted
        ?
        <form
            onSubmit={phoneHandleSubmit(onPhoneValid)}
            className="flex flex-col mt-8 space-y-4 mb-4"
        >
            <Input
            register={phoneRegister("phone")}
            name="phone"
            label={userContext?.isKoreanOption ? "휴대폰 번호" : "Phone Number"}
            type="text"
            kind="phone"
            placeholder={userContext?.isKoreanOption ? "휴대폰 번호 뒷자리를 입력해주세요" : "Please enter your phone number"}
            language={userContext?.isKoreanOption ? "korean" : "english"}
            required
            />
            <div className="mt-4">
                <Button text={isPhoneLoading ? `${userContext?.isKoreanOption ? "휴대폰 번호 업데이트 중..." : "Updating your phone number..."}` : `${userContext?.isKoreanOption ? "다음" : "Next"}`} />
            </div>
        </form> 

        : null} 


        {isPhoneCreationCompleted && !(isLoggedIn && isEmailVerified) // && submittedUserAccountInfo?.email // isNewPasswordCreationCompleted
        ? 
        <div className="flex flex-col mt-8 mb-4">
            <p className="text-xs text-red-500 mb-5 mt-3">
                {userContext?.isKoreanOption ? `*본인인증 이메일이 ${submittedUserAccountInfo?.email}로 전송되었습니다.` : `*A verification email has been sent to ${submittedUserAccountInfo?.email}.`}
            </p>
            <div className="-mt-1">
              <button
                disabled={true}
                className="w-full text-base bg-green-500 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium"
              >
                {isEmailVerificationLoading ? `${userContext?.isKoreanOption ? "인증 이메일 전송 중..." : "Sending an email..."}`: `${userContext?.isKoreanOption ? "이메일을 확인해주세요!" : "Please check your email!"}`}
              </button>
            </div>
        </div>

        : null}

        </div>
        
        {/* 네이버 & 카카오 & 구글 간편로그인 */}
        {!isNewEmailAccountCreationCompleted && !(isLoggedIn && isEmailVerified) // !loginData?.ok

        ?
        <div className="mt-12">

          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 mt-6 gap-3 w-full">
            <button className="shadow-md flex justify-center items-center py-2 px-4 rounded-md bg-[#ffe812] text-sm font-normal text-gray-700">
              <Image 
                className="rounded-lg" 
                src={"/kakao-logo.png"} 
                alt="kakao-logo" 
                width={27}
                height={27}
                priority={true}
              />
              <span className="ml-3">
                {userContext?.isKoreanOption ? "카카오 계정으로 로그인" : "Continue with Kakao"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 mt-6 gap-3 w-full">
            <button className="shadow-md flex justify-center items-center py-2 px-4 rounded-md bg-[#03c75a] text-sm font-normal text-white">
              <Image 
                className="rounded-lg" 
                src={"/naver-logo.png"} 
                alt="naver-logo" 
                width={30}
                height={30}
                priority={true}
              />
              <span className="ml-3">
                {userContext?.isKoreanOption ? "네이버 계정으로 로그인" : "Continue with Naver"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 mt-6 gap-3 w-full">
            <button className="shadow-md flex justify-center items-center py-2 px-4 rounded-md bg-white text-sm font-normal text-gray-700 hover:bg-gray-50">
              <div className={userContext?.isKoreanOption ? "-ml-[11px]" : "ml-[7px]"} />
              <Image 
                className="rounded-md" 
                src={"/google-logo.png"} 
                alt="google-logo" 
                width={23}
                height={23}
                priority={true}
              />
              <span className="ml-3">
                {userContext?.isKoreanOption ? "구글 계정으로 로그인" : "Continue with Google"}
              </span>
            </button>
          </div>
        </div>

        : null}

      </div>
    </div>
    
  </div>
  
  {/* <Footer /> */}
  </>
  );
};

export default Login;