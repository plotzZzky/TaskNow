'use client'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faHome, faQuestion, faUsers, faRightFromBracket, faCheckSquare, faNoteSticky, faGlobeEurope } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './authContext'
import './navbar.css'

export default function NavBar() {
  const [getToken, setToken] = useAuth();
  const router = useRouter();
  const getPath = usePathname();

  function openResponsiveMenu() {
    // Função que abre o menu no modo responsivo
    const navbar = document.getElementById("menu");
    if (navbar.className == "menu") {
      navbar.classList.add("responsive");
    } else {
      navbar.className = "menu";
    }
  };

  function closeResponsiveMenu() {
    // Função que fecha o menu no modo responsivo
    const navbar = document.getElementById("menu");
    navbar.classList.remove("responsive");
  };

  const ABOUT = () => {
    // Criam os item na navbar dependendo da pagina acessada
    return getPath === '/' ? (
      <span onClick={goAbout}>
        <FontAwesomeIcon icon={faUsers} className='icon-menu' /> Sobre
      </span>
    ) : null
  };

  const FAQ = () => {
    return getPath === '/' ? (
      <span onClick={goFaq}>
        <FontAwesomeIcon icon={faQuestion} className='icon-menu' /> Dúvidas
      </span>
    ) : null
  };

  const LOGIN = () => {
    return getToken === null? (
      <span onClick={goLogin}>
        <FontAwesomeIcon icon={faUser} className='icon-menu' /> Entrar
      </span>
    ) : (
      <span onClick={goLogin}>
        <FontAwesomeIcon icon={faRightFromBracket} className='icon-menu' /> Sair
      </span>
    )
  };

  const Contacts = () => {
    return getToken !== null? (
      <span onClick={goContacts}>
        <FontAwesomeIcon icon={faUser} className='icon-menu' /> Contatos
      </span>
    ) : null
  }

  const Notes = () => {
    return getToken !== null? (
      <span onClick={goNotes}>
        <FontAwesomeIcon icon={faNoteSticky} className='icon-menu' /> Notas
      </span>
    ) : null
  }

  const Projects = () => {
    return getToken !== null? (
      <span onClick={goTasks}>
        <FontAwesomeIcon icon={faCheckSquare} className='icon-menu' /> Tarefas
      </span>
    ) : null
  }

  const Sites = () => {
    return getToken !== null? (
      <span onClick={goSites}>
        <FontAwesomeIcon icon={faGlobeEurope} className='icon-menu' /> Sites
      </span>
    ) : null
  }

  //Funções de navegação pelas paginas
  function goHome() {
    if (getPath === '/') {
      document.getElementById('Start').scrollIntoView();
    } else {
      router.push('/')
    }
    closeResponsiveMenu();
  };

  function goAbout() {
    document.getElementById('About').scrollIntoView();
    closeResponsiveMenu();
  }

  function goFaq() {
    document.getElementById('Faq').scrollIntoView();
    closeResponsiveMenu();
  }

  function genericGoTo(value) {
    //Função generica para redirecionamento, se tokne for null redireciona para /login do contrario para a pagina passada como parametro
    if (getToken !== null && typeof getToken === 'string') {
      if (getPath !== value) {
        router.push(value);
      }
    } else {
      if (getPath === "/login") {
        showLoginAlert()
      } else {
        router.push("/login");
      }
    }
    closeResponsiveMenu();
  };
  
  function goContacts() {
    genericGoTo('/contacts')
  }

  function goTasks() {
    genericGoTo('/tasks')
  }

  function goNotes() {
    genericGoTo('/boards')
  }

  function goSites() {
    genericGoTo('/websites')
  }

  function goLogin() {
    if (getToken === null) {
      router.push("/login")
    } else {
      sessionStorage.removeItem("token")
      setToken(null)
      router.push('/')
    }
  }

  function showLoginAlert() {
    // Mostra o alerta de login
    const alert = document.getElementById('loginAlert');
    alert.style.visibility = 'visible';

    setTimeout(() => {
      alert.style.visibility = 'hidden';
    }, 2000);
  }

  return (
    <nav>
      <div className="menu" id="menu">

        <span id='menuBtn' onClick={openResponsiveMenu}>
          <FontAwesomeIcon icon={faBars} />
        </span>

        <span onClick={goHome}>
          <FontAwesomeIcon icon={faHome} /> Inicio 
        </span>

        {ABOUT()}

        {FAQ()}

        {Contacts()}

        {Notes()}

        {Projects()}

        {Sites()}

        {LOGIN()}

      </div>
    </nav>
  )
}