import { Inter } from 'next/font/google'
import { AuthProvider } from "@comps/authContext"
import AuthGuard from '@comps/authGuard'
import NavBar from '@comps/navbar'
import Footer from '@comps/footer'
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

            <AuthGuard>
              {children}
            </AuthGuard>
            
            <Footer/>
          </body>

        </AuthProvider>  
    </html>
  )
}
