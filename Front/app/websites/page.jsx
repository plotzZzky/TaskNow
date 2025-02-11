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

  useEffect(() => {
    checkLogin()
  }, []);

  function checkLogin() {
    if (Token === null) {
      router.push("/login/");
    };

    getAllSites();
  };


  function getAllSites() {
    const url = "http://127.0.0.1:8000/websites/"

    const requestData = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    }
    
    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => { createSitesCard(data) }
    );
  };

  function createSitesCard(sites, index) {
    if (sites) {
      setSitesCard(
        sites.map((data) => (
          <SiteCard key={index} data={data} createCards={createSitesCard} />))
      )
    }
  };

  function createNewSite() {
    const url = "http://127.0.0.1:8000/websites/";

    const form = new FormData();
    form.append("title", getTitle);
    form.append("url", getUrl);
    form.append("color", getColor);

    const requestData = {
      method: 'POST',
      headers: { Authorization: 'Token ' + Token },
      body: form
    }

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => {
        setFormDefault();
        createSitesCard(data);
    });
  };


  function setFormDefault() {
    // retorna os valores do form para os padrão
    setTitle("Nome do site");
    setUrl("www.example.com");
    setColor('');
  };

  function handleSiteName(event) {
    const value = event.target.value;
    setTitle(value);
  };

  function handleSiteUrl(event) {
    const value = event.target.value;
    setUrl(value);
  };

  function handleColor(event) {
    const value = event.target.value;
    setColor(value);
  };

  return (
    <section>
      <h2> Seus sites favoritos </h2>
      <div className="cards">
        <div className="margin">
          <div className='card' style={{background: getColor}}>

            <div className='card-row'>
              <FontAwesomeIcon className='card-big-btn' icon={faEarthAmerica}/>
              
              <input className="card-input card-title" value={getTitle} onChange={handleSiteName}></input>

              <div className='card-btns'>
                <FontAwesomeIcon icon={faFloppyDisk} onClick={createNewSite} className='card-btn'/>

                <input type="Color" className="color-select" onChange={handleColor}></input>

              </div>
            </div>

            <div className="card-row">
              <input className='card-input' onChange={handleSiteUrl} value={getUrl}></input>
            </div>

          </div>
        </div>

        {getSitesCard}

      </div>
    </section>
  )
}