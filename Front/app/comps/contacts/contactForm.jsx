import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faUser } from '@fortawesome/free-solid-svg-icons'


export default function ContactForm(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined'? sessionStorage.getItem('token') : undefined);

  const [getName, setName] = useState("Nome");
  const [getEmail, setEmail] = useState("Email");
  const [getTelephone, setTelephone] = useState("Telefone");
  const [getColor, setColor] = useState("");


  function changeName(event) {
    setName(event.target.value)
  }

  function changeTelephone(event) {
    setTelephone(event.target.value)
  }

  function changeEmail(event) {
    setEmail(event.target.value)
  }

  function changeColor(event) {
    setColor(event.target.value)
  }

  function save_contact() {
    const url = "http://127.0.0.1:8000/contacts/"

    const formData = new FormData();
    formData.append('name', getName);
    formData.append('telephone', getTelephone);
    formData.append('email', getEmail);
    formData.append('color', getColor);

    const data = {
      method: 'POST',
      headers: { Authorization: 'Token ' + getToken },
      body: formData
    }

    fetch(url, data)
      .then(() => {
        props.update()
        setToDefault()
      })
  }

  // retorna os valores do form para os padrão
  function setToDefault() {
    const firstname = 'Nome'
    const telephone = 'Telefone'
    const email = 'Email'
    setName(firstname)
    setTelephone(telephone)
    setEmail(email)
    setColor('')
    document.getElementById("FirstnameInput").innerText = firstname
    document.getElementById("TelephoneInput").innerText = telephone
    document.getElementById("EmailInput").innerText = email
  }


  return (
    <div className='margin'>
      <div className='card' style={{ background: getColor }}>

        <div className="card-row">
          <FontAwesomeIcon className='card-big-btn' icon={faUser}/>
          <input contentEditable='true' className="card-input card-title" id="FirstnameInput" value={getName} onChange={changeName}></input>

          <div className="card-btns">
            <FontAwesomeIcon className='card-btn' icon={faFloppyDisk} onClick={save_contact}/>
            <input type="Color" className="color-select" onChange={changeColor}></input>
          </div>
        </div>

        <div className='card-row'>
          <input contentEditable='true' className='card-input' id="TelephoneInput" value={getTelephone} onChange={changeTelephone}></input>
          <input contentEditable='true' className='card-input' id="EmailInput" value={getEmail} onChange={changeEmail}></input>
        </div>
      </div>
    </div>
  )
}