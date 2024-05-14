'use client'
import { useRouter } from 'next/navigation';
import { useAuth } from '@comps/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [Token, updateToken] = useAuth();
  const router = useRouter();

  const ABOUT = `Simplifique sua vida com o TaskNow - a plataforma tudo-em-um para gerenciar tarefas. 
  Organize, priorize e colabore de forma eficaz para alcançar seus objetivos com facilidade e praticidade.`

  const FAQ = [
    {
      question: "Quais serviços tenho acesso no TaskNow?",
      answer: "Você pode criar e salvar notas, tarefas, favoritos e contatos. Essas informações ficam salvas em nossos servidores de forma segura e podendo ser acessado de qualquer lugar."
    },
    {
      question: "TaskNow é totalmente gratuita?",
      answer: "Sim, TaskNow é uma plataforma totalmente gratuita. Todos os recursos essenciais estão disponíveis para os usuários sem custos associados."
    },
    {
      question: "As tarefas são salvas de forma segura?",
      answer: "Sim, TaskNow salva suas tarefas em banco de dados garantindo que elas estejam sempre acessiveis para você e seguras atraves de usuario e senha"
    },
    {
      question: "Como as tarefas são organizadas?",
      answer: "As tarefas são organizadas por projeto e ordenadas por status, baseado no nivel de execução da tarefa."
    },
    {
      question: "Como as notas são organizadas?",
      answer: "As tarefas são organizadas em quadros de notas, você tambem pode mudar a cor das notas para ajudar a identifica-las de forma mais rapida."
    },
    {
      "question": "Existe um limite de armazenamento para os dados no TaskNow?",
      "answer": "Atualmente, não impomos um limite de armazenamento para os dados dos usuários no TaskNow. Você pode armazenar quantas notas, tarefas e contatos desejar."
    },
    {
      "question": "Existe algum plano premium ou de assinatura no TaskNow?",
      "answer": "Atualmente, não oferecemos planos premium ou de assinatura. Todo o conjunto de recursos do TaskNow está disponível gratuitamente para todos os usuários."
    },
    {
      question: "Como faço para obter suporte técnico na TaskNow?",
      answer: "Para obter suporte técnico, visite nossa seção de Suporte em nosso site. Nossa equipe está pronta para ajudar a resolver qualquer dúvida ou problema que você possa ter."
    },
  ];

  // Cria os items do faq
  const faqItems = () => {
    return FAQ.map((data, index) => (
      <details className='details' key={index}>
        <summary className='summary'> {data.question} </summary>
        <a className='details-text'> {data.answer} </a>
      </details>
    ))
  }

  // Redireciona para a pagina do app ou login
  function goToLogin() {
    if (Token !== null && typeof Token === 'string') {
      router.push("/tasks");
    } else {
      router.push("/login");
    }
  }

  return (
    <div>
      <div className='page-home banner' id='Start'>
        <h1 className='big-title'> TaskNow <FontAwesomeIcon icon={faCheckSquare} className='market-icon' /> </h1>
        <h2 className='subtitle'> O jeito facil de gerenciar sua vida. </h2>

        <div className='home-align-btns'>
          <button onClick={goToLogin}> Começar agora! </button>
        </div>
      </div>

      <div className='page-home' id='About'>
        <h1> Sobre o TaskNow... </h1>
        <h2> {ABOUT} </h2>

        <h1> Benefícios: </h1>

        <p> - Manter suas ideias acessíveis em qualquer lugar e qualquer dispositivo</p>
        <p> - Manter suas ideias e projetos organizados facilita sua vida </p>
        <p> - BackUp de suas notas para não perder nada</p>
        <p> - Reduz seu impacto ambiental salvando suas ideias sem gastar papel </p>

      </div>

      <div className='page-home' id='Faq'>
        <h1> Duvias frequentes: </h1>
        {faqItems()}
      </div>
    </div>
  )
}