import './globals.css'

export const metadata = { title: 'FluencyGo', description: 'IELTS 7.0+ бэлтгэл' }
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>
        <a href="#main" className="skip">Үндсэн агуулга руу очих</a>
        {children}
      </body>
    </html>
  )
}
