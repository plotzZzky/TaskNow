import { Inter } from 'next/font/google'
import '../apps.css'
import './page.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Contatos - TaskNow ',
}

export default function RootLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  )
}
