import { Inter } from 'next/font/google'
import '../../../../globals.css'
import '../../../apps.css'
import './page.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notas - TaskNow',
}

export default function RootLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  )
}
