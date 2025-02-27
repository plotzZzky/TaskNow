import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@comps/authContext'


export default function CommentCard(props) {
  const [token, updateToken] = useAuth();

  function deleteTask(event) {
    // Apaga a tarefa
    event.stopPropagation()

    const url = `http://127.0.0.1:8000/comments/${props.data.id}/`
    const header = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, header)
      .then(res => res.json())
      .then(data => {
        props.show(data)
      })
  }

  return (
    <div className='comment-div'>
      <div className='comment-card'> {props.data.text} </div>
      <FontAwesomeIcon icon={faTrash} onClick={e => deleteTask(e)} className='task-btn'/>
    </div>
  )
}