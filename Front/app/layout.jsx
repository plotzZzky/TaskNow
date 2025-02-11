import { Inter } from 'next/font/google'
import { AuthProvider } from '@comps/authContext'
import NavBar from './components/navbar'
import Footer from './components/footer'
import '@app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskNow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <AuthProvider>
          <header>
            <NavBar/>
          </header>

          <body className={inter.className}>

            {children}

            <Footer/>
          </body>

        </AuthProvider>  
    </html>
  )
}
