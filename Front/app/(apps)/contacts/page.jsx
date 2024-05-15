'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@comps/authContext";
import ContactCard from "@comps/contacts/contactCard";
import ContactForm from "@comps/contacts/contactForm";

export default function Contacts() {
  const [Token, updateToken] = useAuth();
  const router = useRouter();

  const [getContactsCard, setContactsCard] = useState([]);

  const [getTitle, setTitle] = useState('Titulo da nota');
  const [getText, setText] = useState('Nota de test');
  const [getColor, setColor] = useState("");

  function checkLogin() {
    if (Token !== null && typeof Token === 'string') {
      getAllContacts()
    } else {
      router.push("/login/");
    }
  }

  // Contacts
  function getAllContacts() {
    let url = "http://127.0.0.1:8000/contacts/"
    let data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + Token}
    }
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => { createContactsCard(data) }
      )
  }

  function createContactsCard(contacts) {
    setContactsCard(
      contacts.map((data) => (
        <ContactCard key={data.id} data={data} createCard={createContactsCard} ></ContactCard>))
    )
  }

  useEffect(() => {
    checkLogin()
  }, []);


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