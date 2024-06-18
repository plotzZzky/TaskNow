import { Inter } from 'next/font/google'
import '../apps.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quadros De Notas - TaskNow',
}

export default function RootLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  )
}
