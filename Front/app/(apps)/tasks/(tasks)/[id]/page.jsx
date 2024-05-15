'use client'
import { useState, useEffect } from "react";
import { useRouter, useParams} from "next/navigation";
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import TaskCard from "@comps/tasks/taskCard";


export default function Tasks() {
  const [token, updateToken] = useAuth();
  const router = useRouter();
  const urlParamters = useParams()
  const [getCards, setCards] = useState([])
  const [getTaskTitle, setTaskTitle] = useState('Nome da tarefa')
  const [getTaskDesc, setTaskDesc] = useState('Descrição da tarefa')

  function checkLogin() {
    if (token !== null && typeof token !== 'string') {
      router.push("/login/");
    }
  }

  function getAllCards() {
    // Busca as informações dos cards no back
    checkLogin()
    const taskId = urlParamters.id
    const url = `http://127.0.0.1:8000/tasks/${taskId}/`;

    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + token },
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
        <TaskCard key={index} data={data} createCards={createCards}></TaskCard>
      ))
    );
  }

  function createNewTask() {
    // Cria uma nova tarefa
    const url = 'http://127.0.0.1:8000/tasks/'

    const form = new FormData()
    form.append('projectId', urlParamters.id)
    form.append("title", getTaskTitle)
    form.append("desc", getTaskDesc)

    const header = {
      method: 'POST',
      body: form,
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, header)
      .then((res) => res.json())
      .then((data) => {
        setTaskTitle("Nome da tarefa")
        setTaskDesc("Descrição da tarefa")
        createCards(data)
      })
  }

  function changeTaskTitle(event) {
    setTaskTitle(event.target.value)
  }

  function changeTaskDesc(event) {
    setTaskDesc(event.target.value)
  }

  useEffect(() => {
    getAllCards()
  }, [])


  return (
    <div className="page">
      <h2> Suas Tarefas </h2>

      <div className="cards">
      
        <div className="margin">
          <div className="card">

              <div className="card-row">
                <FontAwesomeIcon className='card-big-btn' icon={faSquareCheck}/>
                <input className="card-input card-title" onChange={changeTaskTitle} value={getTaskTitle}></input>
                <div className="card-btns">
                  <FontAwesomeIcon icon={faFloppyDisk} onClick={createNewTask} className='card-btn'/>
                </div>
              </div>

              <div className="card-row">
                <textarea className="card-input" onChange={changeTaskDesc} value={getTaskDesc}></textarea>
              </div>

          </div>
        </div>

        {getCards}

      </div>
    </div>
  )
}