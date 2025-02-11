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

  useEffect(() => {
    checkLogin()
  }, []);

  function checkLogin() {
    if (Token === null) {
      router.push("/login/");
    };

    getAllNotes();
  };

  function getAllNotes() {
    const boardId = urlParamters.id;
    const url = `http://127.0.0.1:8000/notes/${boardId}/`;

    const requestData = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => { createNotesCard(data) });
  };

  function createNotesCard(notes) {
    if (notes) {
      setNotesCard(
        notes.map((data) => (
          <NoteCard key={data.id} data={data} update={getAllNotes}></NoteCard>))
      )
    };
  };

  function saveNewNote() {
    const url = "http://127.0.0.1:8000/notes/"

    const form = new FormData();
    form.append("boardId", urlParamters.id);
    form.append("title", getTitle);
    form.append("desc", getDesc);
    form.append("color", getColor)

    const requestData = {
      method: 'POST',
      headers: { Authorization: 'Token ' + Token },
      body: form
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => {
        setFormToDefault();
        createNotesCard(data)
    });
  };

  // retorna os valores do form para os padrão
  function setFormToDefault() {
    setTitle('Titulo da nota');
    setDesc('Nota de teste');
    setColor('');
    document.getElementById("TitleInput").innerText = getTitle;
  };

  // Sets
  function handleTitle(event) {
    const value = event.target.value
    setTitle(value)
  }

  function handleText(event) {
    const value = event.target.value
    setDesc(value)
  }

  function handleColor(event) {
    const value = event.target.value
    setColor(value)
  }


  return (
    <section>
      <div className="cards">
        
        <div className="note-margin">
          <div className='note-card' style={{'background': getColor}}> 
            <input className='card-input card-title' id="TitleInput" value={getTitle} onChange={handleTitle}></input>
            
            <textarea 
              className='note-text' id="TextInput" wrap="hard" onChange={handleText} value={getDesc}>
            </textarea>

            <div className='card-row'>
              <FontAwesomeIcon icon={faFloppyDisk} onClick={saveNewNote} className='card-btn'/>

              <input type="Color" className="color-select" onChange={handleColor}></input>
            </div>
          </div>
        </div>

        {getNotesCard}

      </div>
    </section>
  )
}