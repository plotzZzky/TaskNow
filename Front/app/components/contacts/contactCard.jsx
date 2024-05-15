import { useAuth } from "@comps/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'


export default function ContactCard(props) {
  const [Token, updateToken] = useAuth();

  function openWhatsapp() {
    const number = props.data.telephone.replace('(', '').replace(')', '').replace('-', '')
    const url = `https://api.whatsapp.com/send?phone=55${number}`
    window.open(url, "_blank").focus()
  }

  function emailTo() {
    const url = `mailto:${props.data.email}`
    window.open(url, "_blank").focus()
  }

  function deleteContact(event) {
    const contactId = props.data.id
    const url = `http://127.0.0.1:8000/contacts/${contactId}/`

    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + Token },
    }

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        event.stopPropagation();
        props.createCard(data)
      })
  }

  return (
    <div className='margin'>
      <div className='card' style={{ backgroundColor: props.data.color }}>

        <div className="card-row">
          <FontAwesomeIcon className='card-big-btn' icon={faUser}/>
          <span className='card-title card-input'> {props.data.name} </span>

          <div className="card-btns">
            <FontAwesomeIcon icon={faTrash} className="card-btn" onClick={deleteContact}/>
          </div>
        </div>

        <div className='card-row'>
          <a className='card-input click' id="TelephoneInput" onClick={openWhatsapp}> {props.data.telephone} </a>
          <a className='card-input click' id="EmailInput" onClick={emailTo}> {props.data.email} </a>
        </div>
      </div>
     </div> 
  )
}