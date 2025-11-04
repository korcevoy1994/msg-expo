export type ContactFormStrings = {
  title: string
  description: string
  labels: {
    firstName: string
    position: string
    email: string
    phone: string
    brand: string
    companyName: string
    fiscalCode: string
    servicesQuestion: string
    message: string
  }
  placeholders: {
    firstName: string
    position: string
    email: string
    phoneMask: string
    brand: string
    companyName: string
    fiscalCode: string
    message: string
  }
  buttons: {
    selectAll: string
    clearAll: string
    submit: string
    submitting: string
  }
  services: string[]
  validation: {
    firstNameMin: string
    positionMin: string
    email: string
    phone: string
    brandMin: string
    companyNameMin: string
    servicesMin: string
  }
  messages: {
    submitSuccess: string
    submitErrorPrefix: string
    networkErrorPrefix: string
  }
}

export const ro: ContactFormStrings = {
  title: "Formular de contact",
  description: "Completați formularul și vă contactăm curând",
  labels: {
    firstName: "Nume",
    position: "Funcție",
    email: "Email",
    phone: "Număr de telefon",
    brand: "Brand",
    companyName: "Denumirea juridică a companiei",
    fiscalCode: "Cod fiscal (opțional)",
    servicesQuestion: "Ce servicii vă interesează? *",
    message: "Informații suplimentare (opțional)",
  },
  placeholders: {
    firstName: "Introduceți numele dvs.",
    position: "Introduceți funcția dvs.",
    email: "exemplu@companie.md",
    phoneMask: "+373 XX XXX XXX",
    brand: "Introduceți numele brandului",
    companyName: "Introduceți denumirea juridică",
    fiscalCode: "Introduceți codul fiscal",
    message: "Descrieți evenimentul sau adresați întrebări...",
  },
  buttons: {
    selectAll: "Selectați toate",
    clearAll: "Ștergeți",
    submit: "Trimite cererea",
    submitting: "Se trimite...",
  },
  services: [
    "Închiriere echipamente tehnice",
    "Logistica evenimentului",
    "Regia evenimentului",
    "Organizare eveniment la cheie",
    "Servicii de securitate",
    "Video producție",
    "Merch",
    "Brandingul evenimentului",
  ],
  validation: {
    firstNameMin: "Numele trebuie să aibă minim 2 caractere",
    positionMin: "Funcția trebuie să aibă minim 2 caractere",
    email: "Introduceți un email valid",
    phone: "Introduceți numărul în formatul +373 XX XXX XXX",
    brandMin: "Brandul trebuie să aibă minim 2 caractere",
    companyNameMin: "Denumirea juridică a companiei trebuie să aibă minim 2 caractere",
    servicesMin: "Selectați cel puțin un serviciu",
  },
  messages: {
    submitSuccess: "Cererea a fost trimisă cu succes!",
    submitErrorPrefix: "Eroare la trimitere:",
    networkErrorPrefix: "Eroare de rețea:",
  },
}