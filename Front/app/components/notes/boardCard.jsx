import { useRouter } from "next/navigation"
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function BoardCard(props) {
  const router = useRouter()
  const [token, updateToken] = useAuth();

  function openProject() {
    router.push(`/boards/${props.data.id}/`)
  }

  function deleteBoard(event) {
    event.stopPropagation();

    const boardId = props.data.id
    const url = `http://127.0.0.1:8000/boards/${boardId}/`

    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + token },
    }

    fetch(url, data)
      .then(() => {
        props.getAllCards()
      })
  }


  return (
    <div className="margin" onClick={openProject}>
      <div className="card click">
        <div className='card-row'>
          <span className="card-title">{props.data.title}</span>

          <div className='card-btns'>
            <FontAwesomeIcon icon={faTrash} onClick={e => deleteBoard(e)} className='card-btn'/>
          </div>
        </div>

        <textarea className="card-input" value={props.data.desc} disabled></textarea>
      </div>
    </div>
  )
}