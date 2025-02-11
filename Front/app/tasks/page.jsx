'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import ProjectCard from "@comps/tasks/projectCard";


export default function Projects() {
  const [token, updateToken] = useAuth();
  const router = useRouter();

  const [getCards, setCards] = useState([])

  const [getTaskTitle, setTaskTitle] = useState('Nome do projeto')
  const [getTaskDesc, setTaskDesc] = useState('Descrição do projeto')

  useEffect(() => {
    checkLogin
  }, [])

  function checkLogin() {
    if (token === null) {
      router.push("/login/");
    }

    getAllCards();
  };

  function getAllCards() {
    // Busca as informações dos cards no back
    const url = "http://127.0.0.1:8000/projects/";

    const requestData = {
      method: 'GET',
      headers: { Authorization: 'Token ' + token },
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => {
        createCards(data);
    });
  };

  function createCards(projects) {
    // Cria os cards dos projetos
    if (projects) {
      setCards(
        projects.map((data, index) => (
          <ProjectCard key={index} data={data} createCards={createCards}></ProjectCard>
        ))
      );
    };
  };

  function createNewProject() {
    // Cria um novo projeto
    const url = 'http://127.0.0.1:8000/projects/'

    const form = new FormData()
    form.append("title", getTaskTitle)
    form.append("desc", getTaskDesc)

    const requestData = {
      method: 'POST',
      body: form,
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => {
        setTaskTitle("Nome da tarefa")
        setTaskDesc("Descrição da tarefa")
        createCards(data)
    });
  }

  function handleProjectTitle(event) {
    setTaskTitle(event.target.value);
  };

  function handleProjectDesc(event) {
    setTaskDesc(event.target.value);
  };

  return (
    <section>
      <h2> Seus projetos </h2>
      <div className="cards">
      
        <div className="margin">
          <div className="card">

              <div className="card-row">
                <FontAwesomeIcon className='card-big-btn' icon={faSquareCheck}/>
                <input className="card-input card-title" onChange={handleProjectTitle} value={getTaskTitle}></input>

                <div className="card-btns"> 
                  <FontAwesomeIcon icon={faFloppyDisk} onClick={createNewProject} className='card-btn'/>
                </div>
              </div>

              <div className="card-row">
                <textarea className="card-input" onChange={handleProjectDesc} value={getTaskDesc}></textarea>
              </div>

          </div>
        </div>

        {getCards}

      </div>
    </section>
  )
}