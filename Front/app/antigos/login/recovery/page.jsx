'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputPwd from '@/app/antigos/inputs/inputPwd';
import InputUser from '@/app/antigos/inputs/inputUser';
import InputAnswer from '@/app/antigos/inputs/inputAnswer';


export default function Login() {
  const [getVisibility, setVisibility] = useState(false)
  const router = useRouter();

  const [question, setQuestion] = useState("Digite o nome do usario para aparecer sua pergunta")
  const [getAnswer, setAnswer] = useState("");
  const [getUsername, setUsername] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getpwd, setPwd] = useState("")

  //Validate
  const [UserValid, setUserValid] = useState(false);
  const [Pwd1Valid, setPwd1Valid] = useState(false);
  const [Pwd2Valid, setPwd2Valid] = useState(false)
  const [AnswerValid, setAnswerValid] = useState(false)

  // Redireciona para a pagina de login
  function redirectToLogin() {
    router.push('/login');
  };


  function receiveQuestionTimer (value) {
    // Função para verificar se o usuario terminou de digitar o username e então buscar a question
    let timerId; // Timer para buscar o username
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      receiveQuestion(value);
    }, 1000);
  };

  function receiveQuestion(value) {
    // Função que busca a question do usuario para recuperar a senha
    const url = 'http://127.0.0.1:8000/users/question/';

    const form = new FormData();
    form.append("username", value || getUsername)

    const requestData = {
      method: 'POST',
      body: form
    };

    fetch(url, requestData)
    .then((res) => res.json())
    .then((data) => {
      if (data.msg) {
        const tip = document.getElementById("recoveryTip");
        tip.innerText = data.msg;
      } else {
        setQuestion(data['question']);
        setVisibility(true);
      }
    });
  };

  // Função de recuperação de senha
  function recoveyFunc() {
    const url = 'http://127.0.0.1:8000/users/recovery/';

    const form = new FormData();
    form.append("username", getUsername);
    form.append("answer", getAnswer);
    form.append("password", getPassword);
    form.append("pwd", getpwd);

    const requestData = {
      method: 'POST',
      body: form
    };

    fetch(url, requestData)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        const tip = document.getElementById("recoveryTip");
        tip.innerText = data.error;
      } else {
        router.push('/login');
      }
    });
  };

  return (
    <section>
      <div className='page banner'>
        <div className="login-page">
          <div className="login-alert" id='loginAlert'>
            <a> Você precisa fazer login!</a>
          </div>
          
          <div className='login-div' id='signupTab'>
            <h2> Recuperar senha </h2>

            <div className='align-input'>
              <h3 style={{visibility: getVisibility? 'visible' : 'hidden'}}> Sua frase de recuperação: </h3>

              <span> {question} </span>

              <InputUser username={setUsername} valid={UserValid} setValid={setUserValid} tip='recoveryTip' action={receiveQuestionTimer}></InputUser>

              <div style={{visibility: getVisibility? 'visible' : 'hidden'}}>
                <InputAnswer answer={setAnswer} valid={AnswerValid} setValid={setAnswerValid} tip='recoveryTip'></InputAnswer>
                <InputPwd password={setPassword} valid={Pwd1Valid} setValid={setPwd1Valid} placeholder="Digite a nova senha" tip='recoveryTip'></InputPwd>
                <InputPwd password={setPwd} valid={Pwd2Valid} setValid={setPwd2Valid} placeholder="Comfirme a nova senha" tip='recoveryTip'></InputPwd>
              </div>
            </div>

            <h3 id='recoveryTip'> </h3>

            <button className='btn-login' onClick={recoveyFunc}> Recuperar </button>

            <p onClick={redirectToLogin}> Entrar </p>
          </div>
        </div>
      </div>
    </section>
  )
}