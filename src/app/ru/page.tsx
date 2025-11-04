import { ContactForm } from '@/components/ContactForm'
import { Navbar } from '@/components/navbar'

export default function HomeRU() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <Navbar />
      
      <div className="min-h-screen">
        {/* Form */}
        <div className="flex items-center justify-center p-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}