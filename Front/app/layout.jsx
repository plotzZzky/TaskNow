import { Inter } from 'next/font/google'
import { AuthProvider } from "@comps/authContext"
import AuthGuard from '@comps/authGuard'
import NavBar from '@comps/navbar'
import Footer from '@/app/antigos/footer'
import '@app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskNow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <AuthProvider>
          <body className={inter.className}>
            <header>
              <NavBar/>
            </header>

            <AuthGuard>
              {children}
            </AuthGuard>
            
            <Footer/>
          </body>
        </AuthProvider>  
    </html>
  )
}
