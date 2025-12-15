'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import "@comps/footer.css"


export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteDesc = process.env.NEXT_PUBLIC_SITE_DESC;
  
  const emails = [
    process.env.NEXT_PUBLIC_EMAIL,
  ]

  const EMAIL_LINKS = () => { // Cria os cards para cada e-mail de contato
    return (
      emails.map((email, index) => 
        <p key={index}>
          <FontAwesomeIcon icon={faEnvelope}/>
          <a> {email} </a>
        </p>
      )
    )
  };

  return (
    <footer>
      <header>
        <h3>
          {siteName}!
        </h3>

        <span>{siteDesc}</span>
      </header>

      <div>
        <p> Contatos: </p>
        {EMAIL_LINKS()}
      </div>
    </footer>
  )
}