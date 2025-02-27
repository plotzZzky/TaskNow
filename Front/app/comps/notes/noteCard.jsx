import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function NoteCard(props) {
  const [token, updateToken] = useAuth();

  // Formata a data para ser exibida
  function formatDate(value) {
    if (value) {
    const date = value.split("-")
    return `${date[2]}/${date[1]}/${date[0]}`
    }
  }
  
  function deleteNote(event) {
    const noteId = props.data.id
    const url = `http://127.0.0.1:8000/notes/${noteId}/`

    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, data)
      .then(() => {
        props.update()
      })
      event.stopPropagation();
  }

  return (
    <div className='note-margin'>
      <div className='note-card' style={{ backgroundColor: props.data.color }}>
        <a className='card-title'> {props.data.title} </a>
        <pre className='note-text'>
          {props.data.desc}
        </pre>
        <div className='card-row'>
          <FontAwesomeIcon icon={faTrash} onClick={deleteNote} className='card-btn'/>
          <a className='note-date'> {formatDate(props.data.date)} </a>
        </div>
      </div>
    </div>
  )
}