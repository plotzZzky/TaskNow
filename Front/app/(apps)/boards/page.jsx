'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import BoardCard from "@comps/notes/boardCard";


export default function Boards() {
  const [Token, updateToken] = useAuth();
  const router = useRouter();
  const [getCards, setCards] = useState([])
  const [getBoardTitle, setBoardTitle] = useState('Nome do quadro')
  const [getBoardDesc, setBoardDesc] = useState('Descrição do quadro')

  function checkLogin() {
    if (Token !== null && typeof Token !== 'string') {
      router.push("/login/");
    }
  }

  function getAllBoards() {
    // Busca as informações dos cards no back
    checkLogin()
    const url = "http://127.0.0.1:8000/boards/";

    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token },
    };

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        createCards(data);
      });
  }

  function createCards(value) {
    // Cria os cards das tarefas
    setCards(
      value.map((data, index) => (
        <BoardCard key={index} data={data} getAllCards={getAllBoards}></BoardCard>
      ))
    );
  }

  function createNewBoard() {
    // Cria uma nova tarefa
    const url = 'http://127.0.0.1:8000/boards/'

    const form = new FormData()
    form.append("title", getBoardTitle)
    form.append("desc", getBoardDesc)

    const header = {
      method: 'POST',
      body: form,
      headers: { Authorization: 'Token ' + Token },
    }

    fetch(url, header)
      .then((res) => res.json())
      .then((data) => {
        setBoardTitle("Nome da tarefa")
        setBoardDesc("Descrição da tarefa")
        getAllBoards()
      })
  }

  function changeBoardTitle(event) {
    setBoardTitle(event.target.value)
  }

  function changeBoardDesc(event) {
    setBoardDesc(event.target.value)
  }

  useEffect(() => {
    getAllBoards()
  }, [])


  return (
    <div className="page">
      <h2> Seus quadros de notas </h2>
      <div className="cards">
      
        <div className="margin">
          <div className="card">
              <div className="card-row">
                <FontAwesomeIcon className='card-big-btn' icon={faNoteSticky}/>
                <input className="card-input card-title" onChange={changeBoardTitle} value={getBoardTitle}></input>

                <div className="card-btns">
                  <FontAwesomeIcon icon={faFloppyDisk} onClick={createNewBoard} className='card-btn'/>
                </div>
              </div>

              <div className="card-row">
                <textarea className="card-input" onChange={changeBoardDesc} value={getBoardDesc}></textarea>
              </div>
          </div>
        </div>

        {getCards}

      </div>
    </div>
  )
}