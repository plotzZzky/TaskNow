'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {

  function goToGitHub() { router.push("https://github.com/plotzzzky") }

  return (
    <footer>
      <div className='brand'>
        <span className='brand-title'> TaskNow </span>
        <span className='brand-name'> O jeito fácil de gerenciar sua vida. </span>
      </div>


      <div className='contacts'>
        <p> Contatos </p>

        <p>
          <FontAwesomeIcon icon={faEnvelope}/>
          <a> contato@TaskNow.com </a>
        </p>

        <p>
          <FontAwesomeIcon icon={faEnvelope}/>
          <a> equipe@TaskNow.com </a>
        </p>
      </div>

      <div className='contacts'>
        <p> Dev </p>

        <p onClick={goToGitHub}>
          <FontAwesomeIcon icon={faGithub} />
          <a> GitHub.com/plotzZzky </a>
        </p>
      </div>
    </footer>
  )
}