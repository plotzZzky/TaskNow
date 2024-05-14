import { useRouter } from "next/navigation"
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function ProjectCard(props) {
  const router = useRouter()
  const [token, updateToken] = useAuth();

  function openProject() {
    router.push(`/tasks/${props.data.id}/`)
  }

  function deleteProject(event) {
    event.stopPropagation();

    const projectId = props.data.id
    const url = `http://127.0.0.1:8000/projects/${projectId}/`

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
            <FontAwesomeIcon icon={faTrash} onClick={e => deleteProject(e)} className='card-btn'/>
          </div>
        </div>

        <textarea disabled className="card-input" value={props.data.desc} ></textarea>
      </div>
    </div>
  )
}