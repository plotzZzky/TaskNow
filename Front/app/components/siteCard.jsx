import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function SiteCard(props) {
  const [Token, updateToken] = useAuth();

  function goSite() {
    const url = props.data.url
    window.open('https://' + url, "_blank").focus()
  }

  function deleteSite(event) {
    event.stopPropagation();

    const siteId = props.data.id
    const url = `http://127.0.0.1:8000/websites/${siteId}/`

    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + Token },
    }

    fetch(url, data)
      .then(() => {
        props.update()
      })
  }

  return (
    <div className="margin">
      <div className='card' style={{ backgroundColor: props.data['color'], cursor: 'pointer' }}  onClick={goSite}>
        <div className='card-row'>
          <span className="card-title">{props.data.title}</span>

          <div className='card-btns'>
            <FontAwesomeIcon icon={faTrash} onClick={e => deleteSite(e)} className='card-btn'/>
          </div>
        </div>

        <div className='card-row'>
          <a className='card-input' id="UrlInput" >{props.data.url} </a>
        </div>
        
      </div>
    </div>  
  )
}