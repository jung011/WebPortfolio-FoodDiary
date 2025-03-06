import React, { ChangeEvent, Key, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import InputBox from 'components/InputBox';
import { SignInRequestDto, SignUpRequestDto } from 'apis/request/login';
import { signInRequest, signUpRequest } from 'apis';
import { SignInResponseDto, SignUpResponseDto } from 'apis/response/login';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

  //          state:global          //
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [cookies, setCookie] = useCookies();
  const navigator = useNavigate();

  //          component: SignInCard          //
  const SignInCard = () => {

    const eamilRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    const [error, setError] = useState<boolean>(false);

    

    //          function:          //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const {code} = responseBody;
      if (code === 'DBE') alert('데이타베이스 오류입니다');
      if (code === 'SF' || code === 'VF') setError(true);
      if (code !== 'SU') return;

      const {token, expirationTime} = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookie('accessToken', token, { expires, path: MAIN_PATH()});
      navigator(MAIN_PATH());
    }


    //          event handler:          //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const {value} = event.target;
      setEmail(value);
    }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const {value} = event.target;
      setPassword(value);
    }

    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = {email, password};
      signInRequest(requestBody).then(signInResponse);
    }

    const onSignUpLinkClickHandler = () => {
      setView('sign-up');
    }

    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      }
      else {
        setPasswordType('text')
        setPasswordButtonIcon('eye-light-on-icon');
      }
    }

    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }

    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignInButtonClickHandler();
    }

    return (
      <div className='login-card'>
        <div className='login-card-box'>
          <div className='login-card-top'>
            <div className='login-card-title-box'>
              <div className='login-card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={eamilRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler}></InputBox>
            <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요.' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}></InputBox>  
          </div>
          <div className='login-card-bottom'>
            {error &&
            <div className='login-sign-in-error-box'>
              <div className='login-sign-in-error-message'>
                {'이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'}
              </div>
            </div>
            }
            <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
            <div className='login-description-box'>
              <div className='login-description'>{'신규 사용자이신가요? '}<span className='login-description-link' onClick={onSignUpLinkClickHandler}>{'회원가입'}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  //          component: SignUpCard          //
  const SignUpCard = () => {
    //          state: Ref          //
    const eamilRef = useRef<HTMLInputElement | null>(null); 
    const passwordRef = useRef<HTMLInputElement | null>(null); 
    const passwordCheckRef = useRef<HTMLInputElement | null>(null); 
    const nicknameRef = useRef<HTMLInputElement | null>(null); 
    //          state:            //
    const [page, setPage]= useState<1 | 2>(1);
    const [email, setEmail] = useState<string>('');
    const [password, setPaswword] = useState<string>('');
    const [passwordCheck, setPaswwordCheck] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
    //          state: Type          //
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');
    //          state: Error          //
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
    const [isNicknameError, setNicknameError] = useState<boolean>(false);
    const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);
    //          state: Message          //
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    //          state: Icon          //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

    //          event handler: SingUp Response          //
    
    const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const {code} = responseBody;
      if (code === 'DE') {
        setEmailError(true);
        setEmailErrorMessage('중복되는 이메일 주소입니다');
      } 

      if (code === 'DN') {
        setNicknameError(true);
        setNicknameErrorMessage('중복되는 닉네임입니다');
      }  

      if (code === 'VF') alert( '모든 값을 입력하세요');
      if (code === 'DBE') alert( '데이터베이스 오류입니다');

      if (code !== 'SU') return;

      setView('sign-in');
  
    }

    //          event handler: SingUp ChangeHandler          //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPaswword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPaswwordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
    }

    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    }
    //          event handler: SingUp Click           //
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === 'eye-light-off-icon') {
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      }
      else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
      }
    }

    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === 'eye-light-off-icon') {
        setPasswordCheckButtonIcon('eye-light-on-icon');
        setPasswordCheckType('text');
      }
      else {
        setPasswordCheckButtonIcon('eye-light-off-icon');
        setPasswordCheckType('password');
      }
    }

    const onNextButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.')
      }
      const isCheckedPasswword = password.trim().length >= 8;
      if (!isCheckedPasswword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요')
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지않습니다.')
      }
      if(!isEmailPattern || !isCheckedPasswword || !isEqualPassword) return;
      setPage(2);
    }

    const onSignInLinkClickHandler = () => {
      setView('sign-in');
    }

    const onSignUpButtonClickHandler = () => {
      
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailPattern = emailPattern.test(email);

      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.')
      }
      const isCheckedPasswword = password.trim().length >= 8;
      if (!isCheckedPasswword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요')
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지않습니다.')
      }

      if(!isEmailPattern || !isCheckedPasswword || !isEqualPassword) {
        setPage(1);
        return;
      }

      const hasNickname = nickname.length !==0;
      if(!hasNickname) {
        setNicknameError(true);
        setNicknameErrorMessage('닉네임을 입력해주세요')
      }

      if(!agreedPersonal) setAgreedPersonalError(true);

      if(!hasNickname || !agreedPersonal) return;

      const requestBody: SignUpRequestDto = {email, password, nickname, agreedPersonal};
      signUpRequest(requestBody).then(signUpResponse);
    }

    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    }


    //          event handler: SingUp KeyDown         //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }

    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    }

    const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onNextButtonClickHandler();
    }

    const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    }

    //          effect: signUp          //
    useEffect (() => {
      if (page === 2) {
        if(!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page])
    //           render : SingUp          //
    return (
      <div className='login-card'>
        <div className='login-card-box'>
          <div className='login-card-top'>
            <div className='login-card-title-box'>
              <div className='login-card-title'>{'회원가입'}</div>
              <div className='login-card-page'>{`${page}/2`}</div>
            </div>
            {page ===1 && (
              <>
                <InputBox ref={eamilRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요' value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}></InputBox>
                <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해주세요' value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMessage} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}></InputBox>
                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해주세요' value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler}></InputBox>
              </>
            )}
             {page ===2 && (
              <>
                <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해주세요' value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError} message={nicknameErrorMessage} onKeyDown={onNicknameKeyDownHandler}></InputBox>
              </>
            )}
        </div>     
        <div className='login-card-bottom'>
        {page ===1 && (
           <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
        )}
        {page ===2 && (
          <>
            <div className='login-consent-box'>
              <div className='login-check-box' onClick={onAgreedPersonalClickHandler}>
                  <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
              </div>
              <div className={isAgreedPersonalError ? 'login-consent-title-error' : 'login-consent-title'}>{'개인정보동의'}</div>
              <div className='login-consent-link'>{'더보기 >'}</div>
            </div>
            <div className='black-large-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
          </>
        )}
          <div className='login-description-box'>
            <div className='login-description'>{'이미 계정이 있으신가요? '}<span className='login-description-link' onClick={onSignInLinkClickHandler}>{'로그인'}</span></div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  //          render:메인           //
  return (
    <div id='login-wrapper'>
        <div className='login-container'>
          <div className='login-jumbotron-box'>
            <div className='login-jumbotron-contents'>
              <div className='login-logo-icon'></div>
                <div className='login-jumbotron-text-box'>
                  <div className='login-jumbotron-text'>{'환영합니다.'}</div>
                  <div className='login-jumbotron-text'>{'맛집을 알려주세요.'}</div>
                </div>
            </div>
          </div>
          {view === 'sign-in' && <SignInCard></SignInCard>}
          {view === 'sign-up' && <SignUpCard></SignUpCard>}
        </div>
    </div>
  )
}
