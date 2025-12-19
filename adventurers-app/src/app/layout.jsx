import '../styles/styles.scss'
import { Provider } from "@/components/ui/provider"

export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}

export default function RootLayout({ children }) {

  return (
    <html suppressHydrationWarning={true}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}