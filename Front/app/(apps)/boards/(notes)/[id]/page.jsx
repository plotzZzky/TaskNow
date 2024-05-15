'use client'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import NoteCard from '@comps/notes/noteCard'


export default function Notes() {
  const [Token, updateToken] = useAuth();
  const router = useRouter();
  const urlParamters = useParams()

  const [getNotesCard, setNotesCard] = useState([]);

  const [getTitle, setTitle] = useState('Titulo da nota');
  const [getDesc, setDesc] = useState('Nota de teste');
  const [getColor, setColor] = useState('rgb(182, 253, 206)');

  function checkLogin() {
    if (Token !== null && typeof Token === 'string') {
      getAllNotes()
    } else {
      router.push("/login/");
    }
  }

  // Notes
  function getAllNotes() {
    const boardId = urlParamters.id
    const url = `http://127.0.0.1:8000/notes/${boardId}/`
    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    }
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => { 
        createNotesCard(data) 
      })
  }

  function createNotesCard(notes) {
    if (notes) {
      setNotesCard(
        notes.map((data) => (
          <NoteCard key={data.id} data={data} update={getAllNotes}></NoteCard>))
      )
    } else {
      router.push("/login")
    }
  }

  function saveNewNote() {
    const url = "http://127.0.0.1:8000/notes/"
    const form = new FormData();
    form.append("boardId", urlParamters.id);
    form.append("title", getTitle);
    form.append("desc", getDesc);
    form.append("color", getColor)

    const data = {
      method: 'POST',
      headers: { Authorization: 'Token ' + Token },
      body: form
    }

    fetch(url, data)
      .then(() => {
        setFormDefault();
        getAllNotes();
      });
  }

  // retorna os valores do form para os padrão
  function setFormDefault() {
    setTitle('Titulo da nota')
    setDesc('Nota de teste')
    setColor('')
    document.getElementById("TitleInput").innerText = getTitle
  }

  // Sets
  function changeTitle(event) {
    const value = event.target.value
    setTitle(value)
  }

  function changeText(event) {
    const value = event.target.value
    setDesc(value)
  }

  function changeColor(event) {
    const value = event.target.value
    setColor(value)
  }

  useEffect(() => {
    checkLogin()
  }, []);


  return (
    <>
      <div className="page">
        <div className="cards">
          <div className="note-margin">
            <div className='note-card' style={{'background': getColor}}> 
              <input className='card-input card-title' id="TitleInput" value={getTitle} onChange={changeTitle}></input>
              
              <textarea 
                className='note-text' id="TextInput" wrap="hard" onChange={changeText} value={getDesc}>
              </textarea>

              <div className='card-row'>
                <FontAwesomeIcon icon={faFloppyDisk} onClick={saveNewNote} className='card-btn'/>
                <input type="Color" className="color-select" onChange={changeColor}></input>
              </div>
            </div>
          </div>

          {getNotesCard}
        </div>
      </div>
    </>
  )
}