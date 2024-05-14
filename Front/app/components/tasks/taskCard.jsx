import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import CommentCard from "./commentCard";
import { useAuth } from '@comps/authContext'


export default function TaskCard(props) {
  const [token, updateToken] = useAuth();
  const router = useRouter();

  const allStatus = ["Adiada", "Nada feito", "Em andamento", "Concluido"]

  const [getCards, setCards] = useState([]);
  const [getComment, setComment] = useState('');
  const [getColor, setColor] = useState('red');


  function checkTaskStatus() {
    const colors = ['grey', 'red', 'orange', 'green']
    setColor(colors[props.data.status])
  }

  function updateTaskStatus(event, increase=false) {
    // Muda o estato da tarefa selecionada
    event.preventDefault();

    const oldValue = parseInt(props.data.status)
    const newValue = increase? oldValue + 1 : oldValue - 1

    const url = `http://127.0.0.1:8000/tasks/${props.data.id}/`
    const form = new FormData()
    form.append('status', newValue)

    const header = {
      method: 'PATCH',
      headers: { Authorization: 'Token ' + token },
      body: form,
    }

    fetch(url, header)
      .then(res => res.json())
      .then(() => {
        checkTaskStatus()
        props.getAllCards()
      })
  }

  function deleteTask(event) {
    // Apaga a tarefa selecionada
    event.preventDefault();

    const url = `http://127.0.0.1:8000/tasks/${props.data.id}/`
    const header = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, header)
      .then(res => res.json())
      .then(() => {
        props.getAllCards()
      })
  }

  function getAllComments() {
    // Busca a lista de comentariod no back
    const url = `http://127.0.0.1:8000/comments/${props.data.id}/`;

    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + token },
    };

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        showComments(data);
      });
  }

  function showComments(value) {
    // Cria os cards dos comenantarios da tarefa atual
    setCards(
      value.map((data, index) => (
        <CommentCard key={index} data={data} show={showComments}></CommentCard>
      ))
    );
  }

  const handleKeyDown = (event) => {
    // verifica se o botão apertado for o enter
    if (event.key === 'Enter') {
      createNewComment()
    }
  }

  function createNewComment() {
    // Cria um novo comentario na tarefa atual
    const url = 'http://127.0.0.1:8000/comments/'

    const form = new FormData()
    form.append("comment", getComment)
    form.append("taskId", props.data.id)

    const header = {
      method: 'POST',
      body: form,
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, header)
      .then((res) => res.json())
      .then((data) => {
        setComment('')
        showComments(data)
      })
  }

  function changeCommentValue(event) {
    setComment(event.target.value)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [props.data.status])

  return (
    <div className="margin">
      <details className="card" onClick={getAllComments} style={{borderColor: getColor}}>

        <summary className="align-task">
          <div className='card-row'>
            <span className='card-title' style={{color: getColor}}> {props.data.title} </span>

            <div className='card-btns'>
              <FontAwesomeIcon icon={faArrowUp} onClick={e => updateTaskStatus(e, true)} className='card-btn'/>
              <FontAwesomeIcon icon={faArrowDown} onClick={e => updateTaskStatus(e)} className='card-btn'/>
              <FontAwesomeIcon icon={faTrash} onClick={e => deleteTask(e)} className='card-btn'/>
            </div>
          </div>

          <div className='card-row'>
            <span className='task-data'> {props.data.date} </span>
            <span className='task-data'> {allStatus[props.data.status]} </span>
          </div>

        </summary>

        <textarea disabled className="card-input" value={props.data.desc}></textarea>

        {getCards}

        <div className="comment-div">
          <input className="comment-input" value={getComment} 
            onChange={e => changeCommentValue(e)} onKeyDown={handleKeyDown}
            />
        </div>

      </details>
    </div>
  )
}