'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@comps/authContext';
import { useApi } from '@hooks/useApi';
import { useGenericGoPage } from '@hooks/useGoPage';
import InputPwd from '@/app/antigos/inputs/inputPwd';
import InputUser from '@/app/antigos/inputs/inputUser';
import InputAnswer from '@/app/antigos/inputs/inputAnswer';
import InputQuestion from '@/app/antigos/inputs/inputQuestion';
import ImgInput from '@/app/comps/inputs/inputImg';
import './page.css'


export default function AuthPage() {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const goFrontPage = useGenericGoPage();
  const fetchApi = useApi();

  // Show inputs and pages
  const [showRegister, setShowRegister] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showAlert, setShowAlert] = useState("");

  // User data
  const [getUsername, setUsername] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getpwd, setPwd] = useState("")
  const [getQuestion, setQuestion] = useState("");
  const [getAnswer, setAnswer] = useState("");
  const [getImageUser, setImageUser] = useState("");
  const [getFileUser, setFileUser] = useState("");

  //Validate
  const [userValid, setUserValid] = useState(false);
  const [pwd1Valid, setPwd1Valid] = useState(false);
  const [pwd2Valid, setPwd2Valid] = useState(false)
  const [questionValid, setQuestionValid] = useState(false)
  const [answerValid, setAnswerValid] = useState(false)


  useEffect(() => {
    if (isAuthenticated) {
      goFrontPage("CARDS");
    };

  }, [isAuthenticated, loading])

  // * * * Funções que controlam os inputs exibidos na pagina * * *
  function showLoginPage() { // Exibe os inputs para login
    genericShowPages(); 
  };

  function showRegisterPage() { // Exibe os inputs para registro
    genericShowPages(true);
  };

  function showRecoveryPage() { // Exibe os inputs para recuperar a senha
    setQuestion();
    genericShowPages(true, true);
  };

  function genericShowPages(register=false, recovery=false) {
    /** 
    * Função generica para selecionar quais inputs são visiveis na pagina
    */
    setShowRegister(register); // Mostra ou não os inputs para registro
    setShowRecovery(recovery); // Mostra ou não a pagina de recovery
  };

  async function loginFunction() {
    /**
    * Valida os campos, se tiver ok faz login e envia para pagina dos cards
    */
    if (pwd1Valid && userValid) {
      const requestData = createRequestDataAndForm();
      const response = await genericHTTPRequest("auth/login/", requestData, false);

      if (response.ok) {
        checkAuthStatus();

      } else {
        setShowAlert("Usuário ou senha incorretos.");
      }

    } else {
      setShowAlert("Prencha os dados de login corretamente");
    };
  };

  function registerFunction() {
    genericRegisterOrRecoveryFunction("auth/register/");
  }

  function recoveryFunction() {
    genericRegisterOrRecoveryFunction("auth/recovery/update/");
  }

  async function genericRegisterOrRecoveryFunction(url) {
    /**
    * Função usada para registro (recovery=false) e trocar a senha (recovery=true)
    * @param {string} url - A url para solicitação
    * 
    * - Valida os campos,
    * - Seleciona a url certa (register/recovery)
    * - Faz a solicitação, se retornar ok, envia o usuario para a pagian dos cards
    */
    if (userValid && pwd1Valid && pwd2Valid && getPassword === getpwd) {
      const requestData = createRequestDataAndForm(true);
      const response = await genericHTTPRequest(url, requestData);

      if (response.ok) {
        checkAuthStatus();

      } else {
        setShowAlert("Usuário ou senha incorretos.");
      }

    } else {
      setShowAlert("Prencha os dados corretamente para se registar.");
    };
  };

  async function receiveQuestion() {
    /**
    * Recebe a question para a recuperação da senha
    */
    if (userValid) {
      const requestData = createRequestDataAndForm();
      const response = await genericHTTPRequest("auth/recovery/", requestData, true);

      if (response) {
        setQuestion(response.question);
        setShowAlert("Preencha os dados corretamente para atualizar seu perfil.");

      } else {
        setShowAlert("Perfil não encontrado.")
      }

    } else {
      setShowAlert("Preencha um nome de usuario válido.");
    }
  };

  function createRequestDataAndForm(register=false) {
    /**
    * Cria o corpo da requisição com o formulario
    * @param {boolean} register - Cria o formulario para registro ou login
    * 
    * - Cria o novo formulario
    * - Se for registro=true, inclue os demais campos
    * - Cria o corpo da requisição
    */
    const form = new FormData();
    form.append("username", getUsername);
    form.append("password", getPassword);

    if (register) {
      form.append("pwd", getpwd);
      form.append("question", getQuestion);
      form.append("answer", getAnswer);

      if (getImageUser) {
        form.set('enctype', 'multipart/form-data');
        form.append("picture", getImageUser, getImageUser.name);
      }
    };

    const requestData = {
      method: "POST",
      body: form,
    };

    return requestData;
  };

  async function genericHTTPRequest(url, requestData, returnJson=false) {
    /**
    * Faz a solicitação e recebe a resposta
    * @param {string} url - A url do back
    * @param {json} requestData - Corpo da solicitação
    * @param {boolean} returnJson - A função deve retorna o response ou o data(json)
    */
    try {
      const response = await fetchApi(url, returnJson, requestData);

      if (returnJson) {
        return response; // Retorna o json (returnJson=true) sem verificar se esta ok, para evitar erros
      }
      
      if (!response.ok) { // Se a resposta for diferente de 2xx retorna um error
        const data = await response.json();
        setShowAlert(data); // Exibe a mensagem de erro
        return null;
      }

      return response; // Retorna o response se não for json

    } catch (error) {
      console.log(error);
      setShowAlert("error"); // Exibe a mensagem de erro
      return null;
    }
  };

  const alertMsg = () => { // Exibe a mensagem no topo da tela
    return showAlert?(
      <div id='loginAlert'>
        <span> {showAlert} </span>
      </div>
    ) : null
  };

  const LOGIN_PAGE = () => {
    if (!showRegister && !showRecovery) {
      return (
        <>
          <div id='loginAlign'>
            <h3> Entrar na sua conta </h3>

            <InputUser value={getUsername} setValue={setUsername} valid={userValid} setValid={setUserValid}/>
            <InputPwd value={getPassword} setValue={setPassword} valid={pwd1Valid} setValid={setPwd1Valid}/>

            <button onClick={loginFunction}> Entrar </button>

            <p onClick={showRegisterPage}> Registar </p>
            <p onClick={showRecoveryPage}> Recuperar senha </p>
          </div>
        </>
      )
    }
  };

  const REGISTER_PAGE = () => {
    if (showRegister && !showRecovery) {
      return (
        <>
          <div id='loginAlign'>
            <h3> Criar uma nova conta </h3>

            <ImgInput setImageUser={setImageUser} getFileUser={getFileUser} setFileUser={setFileUser}/>
            <InputUser value={getUsername} setValue={setUsername} valid={userValid} setValid={setUserValid}/>
            <InputPwd value={getPassword} setValue={setPassword} valid={pwd1Valid} setValid={setPwd1Valid}/>
            <InputPwd value={getpwd} setValue={setPwd} valid={pwd2Valid} setValid={setPwd2Valid} confirm={true}/>
            <InputQuestion value={getQuestion} setValue={setQuestion} valid={questionValid} setValid={setQuestionValid}/>
            <InputAnswer value={getAnswer} setValue={setAnswer} valid={answerValid} setValid={setAnswerValid}/>

            <button onClick={registerFunction}> Cadastrar </button>

            <p onClick={showLoginPage}> Entrar </p>
            <p onClick={showRecoveryPage}> Recuperar senha </p>
          </div>
        </>
      )
    }
  };

  const RECOVERY_PAGE = () => {
    if (showRecovery) {
      return getQuestion? (
        <div id='loginAlign'>
          <h3> Recuperar sua senha </h3>

          <InputUser value={getUsername} setValue={setUsername} valid={userValid} setValid={setUserValid}/>
          <InputPwd value={getPassword} setValue={setPassword} valid={pwd1Valid} setValid={setPwd1Valid}/>
          <InputPwd value={getpwd} setValue={setPwd} valid={pwd2Valid} setValid={setPwd2Valid} confirm={true}/>
          <InputQuestion value={getQuestion} setValue={setQuestion} valid={questionValid} setValid={setQuestionValid}/>
          <InputAnswer value={getAnswer} setValue={setAnswer} valid={answerValid} setValid={setAnswerValid}/>

          <button onClick={recoveryFunction}> Recuperar senha </button>

          <p onClick={showLoginPage}> Entrar </p>
          <p onClick={showRegisterPage}> Cadastre-se </p>
        </div>
      ) : (
        <div id='loginAlign'>
          <h3> Buscar perfil </h3>

          <InputUser value={getUsername} setValue={setUsername} valid={userValid} setValid={setUserValid}/>

          <button onClick={receiveQuestion}> Buscar </button>

          <p onClick={showLoginPage}> Entrar </p>
          <p onClick={showRegisterPage}> Cadastre-se </p>
        </div>
      )
    }
  };

  return (
    <section>
      <div id='login'>

        {alertMsg()}

        {LOGIN_PAGE()}

        {REGISTER_PAGE()}

        {RECOVERY_PAGE()}
        
      </div>
    </section>
  )
}