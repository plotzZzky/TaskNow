'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@comps/authContext'
import { retriveItemFromSessionStorage } from "@omps/ss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import ProjectCard from "@comps/tasks/projectCard";


export default function ProjectsPage() {
  const [token, updateToken] = useAuth();
  const router = useRouter();

  const [getCards, setCards] = useState([]);

  const [getTaskTitle, setTaskTitle] = useState('Nome do projeto');
  const [getTaskDesc, setTaskDesc] = useState('Descrição do projeto');

  useEffect(() => {
    loadProjects();
  }, [])

  async function loadProjects() {
    const cached = await retriveItemFromSessionStorage("projects");

    if (cached) {
      createCards(cached);

    } else {
      receiveProjetosFromBack();
    };
  };

  async function receiveProjetosFromBack() {
    // Busca as informações dos cards no back
    const url = process.env("BACK_PROJECTS_URL");

    const requestData = {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token
      },
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
        projects.map(({title, desc}, index) => (
          <ProjectCard key={index} title={title} desc={desc} createCards={createCards} />
      )));
    };
  };

  async function createNewProject() {
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

  const INPUT_CARD = () => {
    return (
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
    )
  }

  if (true) {
    return (
      <section>
        <h2> Seus projetos </h2>

        <div className="cards">
          {INPUT_CARD()}

          {getCards}
        </div>

      </section>
    )
  }
}