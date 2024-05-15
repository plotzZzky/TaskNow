'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmerica, faEarthEurope, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import SiteCard from "@comps/siteCard";

export default function Sites() {
  const [Token, updateToken] = useAuth();
  const router = useRouter();

  const [getSitesCard, setSitesCard] = useState([]);

  const [getTitle, setTitle] = useState("Nome do site");
  const [getUrl, setUrl] = useState("www.example.com");
  const [getColor, setColor] = useState("");

  function checkLogin() {
    if (Token !== null && typeof Token === 'string') {
      getAllSites();
    } else {
      router.push("/login/");
    }
  };

  // Sites
  function getAllSites() {
    const url = "http://127.0.0.1:8000/websites/"
    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    }
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => { createSitesCard(data) }
      )
  }

  function createSitesCard(sites, index) {
    setSitesCard(
      sites.map((data) => (
        <SiteCard key={index} data={data} createCards={createSitesCard} ></SiteCard>))
    )
  }

  function saveNewSite() {
    const url = "http://127.0.0.1:8000/websites/"
    const formData = new FormData();
    formData.append("title", getTitle);
    formData.append("url", getUrl);
    formData.append("color", getColor)

    const data = {
      method: 'POST',
      headers: { Authorization: 'Token ' + Token },
      body: formData
    }

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        setFormDefault();
        createSitesCard(data)
      });
  }


  function setFormDefault() {
    // retorna os valores do form para os padrão
    setTitle("Nome do site")
    setUrl("www.example.com")
    setColor('')
  }

  function changeSiteName(event) {
    const value = event.target.value
    setTitle(value)
  }

  function changeSiteUrl(event) {
    const value = event.target.value
    setUrl(value)
  }

  function changeColor(event) {
    const value = event.target.value
    setColor(value)
  }

  useEffect(() => {
    checkLogin()
  }, []);


  return (
    <>
      <div className="page">
        <h2> Seus sites favoritos </h2>
        <div className="cards">
          <div className="margin">
            <div className='card' style={{background: getColor}}>

              <div className='card-row'>
                <FontAwesomeIcon className='card-big-btn' icon={faEarthAmerica}/>
                <input className="card-input card-title" value={getTitle} onChange={changeSiteName}></input>

                <div className='card-btns'>
                  <FontAwesomeIcon icon={faFloppyDisk} onClick={saveNewSite} className='card-btn'/>
                  <input type="Color" className="color-select" onChange={changeColor}></input>
                </div>
              </div>

              <div className="card-row">
                <input className='card-input' onChange={changeSiteUrl} value={getUrl}></input>
              </div>

            </div>
          </div>

          {getSitesCard}

        </div>
      </div>
    </>
  )
}