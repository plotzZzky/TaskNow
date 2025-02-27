'use client'
import { useState, useEffect } from "react";
import { useAuth } from "@comps/authContext";
import ContactCard from "@comps/contacts/contactCard";
import ContactForm from "@comps/contacts/contactForm";

export default function Contacts() {
  const [Token, updateToken] = useAuth();

  const [getContactsCard, setContactsCard] = useState([]);

  useEffect(() => {
    getAllContacts();
  }, []);
 
  function getAllContacts() {
    const url = "http://127.0.0.1:8000/contacts/"

    const requestData = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => { createContactsCard(data) }
    );
  };

  function createContactsCard(contacts) {
    if (contacts) {
      setContactsCard(
        contacts.map((data) => (
          <ContactCard key={data.id} data={data} createCard={createContactsCard} ></ContactCard>))
      );
    };
  };


  return (
    <>
      <div className="page">
        <h2> Seus contatos </h2>
        <div className="cards">
          <ContactForm Token={Token} update={getAllContacts}></ContactForm>

          {getContactsCard}
        </div>
      </div>
    </>
  )
}