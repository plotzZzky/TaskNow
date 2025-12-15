'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './authContext'
import { useGenericGoPage} from '@hooks/useGoPage'
import { useGoLoginPage } from './hooks/useGoLogin'
import { useGenericGoLogout } from './hooks/useLogout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from 'react-tooltip'
import { faUser, faHome, faQuestion, faUsers, faRightFromBracket, faImage } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function NavBar() {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const goLoginPage = useGoLoginPage();
  const goPage = useGenericGoPage();
  const goLogout = useGenericGoLogout();

  useEffect(() => {
    // Se executado indica estar no cliente
    setIsClient(true) // Usado para evitar erros de api do navegador não disponivel
  }, [])


  // * * * Funções de navegação pelas paginas * * *
  function goHomePage() {
    if (pathname !== '/') {
      goPage("HOME");

    } else {
      document.getElementById('Start').scrollIntoView();
    }
  };

  function goAboutPage() {
    document.getElementById('About').scrollIntoView();
  };

  function goFaqPage() {
    document.getElementById('Faq').scrollIntoView();
  };

  function goContactsPage() {
    goPage("CARDS");
  };

  function goNotesPage() {
    goPage("CARDS");
  };

  function goTasksPage() {
    goPage("CARDS");
  };

  function goWebsitePage() {
    goPage("CARDS");
  };


  const ABOUT_LINK = () => {
    if (isClient) {
      return pathname === '/' ? (
        <span onClick={goAboutPage}>
          <FontAwesomeIcon icon={faUsers} /> Sobre
        </span>
      ) : null
    }
  };

  const FAQ_LINK = () => {
    if (isClient) {
      return pathname === '/' ? (
        <span onClick={goFaqPage}>
          <FontAwesomeIcon icon={faQuestion} /> Dúvidas
        </span>
      ) : null
    }
  };

  const CONTACTS_LINK = () => {
    return isAuthenticated? (
      <span onClick={goContactsPage}>
        <FontAwesomeIcon icon={faImage}/> Contatos
      </span>
    ) : 
      null
  };

  const NOTES_LINK = () => {
    return isAuthenticated? (
      <span onClick={goNotesPage}>
        <FontAwesomeIcon icon={faImage}/> Notas
      </span>
    ) : 
      null
  };

  const TASKS_LINK = () => {
    return isAuthenticated? (
      <span onClick={goTasksPage}>
        <FontAwesomeIcon icon={faImage}/> Tarefas
      </span>
    ) : 
      null
  };

  const SITES_LINK = () => {
    return isAuthenticated? (
      <span onClick={goWebsitePage}>
        <FontAwesomeIcon icon={faImage}/> Sites
      </span>
    ) : 
      null
  };

  const LOGIN_LINK = () => {
    return !isAuthenticated? (
      <span onClick={goLoginPage}>
        <FontAwesomeIcon icon={faUser} /> Entrar
      </span>
    ) : ( 
      <span onClick={goLogout}>
        <FontAwesomeIcon icon={faRightFromBracket}/> Sair
      </span>     
    )
  };

  return (
    <nav>
      <span onClick={goHomePage}>
        <FontAwesomeIcon icon={faHome}/> Inicio 
      </span>

      {ABOUT_LINK()}

      {FAQ_LINK()}

      {CONTACTS_LINK()}

      {NOTES_LINK()}

      {TASKS_LINK()}

      {SITES_LINK()}

      {LOGIN_LINK()}

      <Tooltip id="toolTip"/>
    </nav>
  )
}