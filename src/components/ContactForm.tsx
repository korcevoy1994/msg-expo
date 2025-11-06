"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ContactFormStrings } from "@/i18n/ro"

// Словарь по умолчанию (русский)
const ruDefaults: ContactFormStrings = {
  title: "Контактная форма",
  description: "Заполните форму и мы свяжемся с вами в ближайшее время",
  labels: {
    firstName: "Имя",
    position: "Должность",
    email: "Email",
    phone: "Контактный номер",
    brand: "Бренд",
    companyName: "Юридическое название компании (необязательное поле)",
    servicesQuestion: "Какие услуги вас интересуют? *",
    consent: "Согласен на обработку персональных данных",
    message: "Дополнительная информация (необязательно)",
  },
  placeholders: {
    firstName: "Введите ваше имя",
    position: "Введите вашу должность",
    email: "example@company.com",
    phoneMask: "+373 XX XXX XXX",
    brand: "Введите название бренда",
    companyName: "Введите юридическое название",
    message: "Расскажите подробнее о вашем мероприятии или задайте вопросы...",
  },
  buttons: {
    selectAll: "Выбрать все",
    clearAll: "Очистить",
    submit: "Отправить заявку",
    submitting: "Отправка...",
  },
  services: [
    "Аренда технического оборудования",
    "Логистика мероприятия",
    "Режиссура мероприятия",
    "Организация мероприятия «под ключ»",
    "Услуги безопасности",
    "Видео продакшн",
    "Мерч",
    "Брендинг мероприятия",
  ],
  validation: {
    firstNameMin: "Имя должно содержать минимум 2 символа",
    positionMin: "Должность должна содержать минимум 2 символа",
    email: "Введите корректный email",
    phone: "Введите номер в формате +373 XX XXX XXX",
    brandMin: "Бренд должен содержать минимум 2 символа",
    companyNameMin: "Юридическое название компании должно содержать минимум 2 символа",
    servicesMin: "Выберите хотя бы одну услугу",
    consentRequired: "Необходимо согласие на обработку персональных данных",
  },
  messages: {
    submitSuccess: "Заявка успешно отправлена!",
    submitErrorPrefix: "Ошибка отправки:",
    networkErrorPrefix: "Ошибка сети:",
  },
}

// Список услуг теперь берется из словаря

export function ContactForm({ t }: { t?: ContactFormStrings }) {
  const dict = t ?? ruDefaults
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const PHONE_PREFIX = "+373 "

  const formatMoldovaLocal = (digits: string) => {
    const only = digits.replace(/\D/g, "").slice(0, 8)
    const p1 = only.slice(0, 2)
    const p2 = only.slice(2, 5)
    const p3 = only.slice(5, 8)
    return [p1, p2, p3].filter(Boolean).join(" ")
  }

  const extractLocalDigits = (value: string) => {
    const digits = value.replace(/[^\d]/g, "")
    return digits.startsWith("373") ? digits.slice(3) : digits
  }

  const buildPhoneValue = (localDigits: string) => PHONE_PREFIX + formatMoldovaLocal(localDigits)

  const formSchema = z.object({
    firstName: z.string().min(2, dict.validation.firstNameMin),
    position: z.string().min(2, dict.validation.positionMin),
    email: z.string().email(dict.validation.email),
    phone: z.string().regex(/^\+373\s\d{2}\s\d{3}\s\d{3}$/, dict.validation.phone),
    brand: z.string().min(2, dict.validation.brandMin),
    companyName: z.string().optional(),
    services: z.array(z.string()).min(1, dict.validation.servicesMin),
    message: z.string().optional(),
    consent: z.boolean().refine(v => v === true, { message: dict.validation.consentRequired }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      position: "",
      email: "",
      phone: "+373 ",
      brand: "",
      companyName: "",
      services: [],
      message: "",
      consent: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = { ...values, phone: values.phone.replace(/\s+/g, "") }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Submit error:', data)
        alert(`${dict.messages.submitErrorPrefix} ${data?.error || 'неизвестная ошибка'}`)
        return
      }

      alert(dict.messages.submitSuccess)
      form.reset()
      setSelectedServices([])
    } catch (e: any) {
      console.error(e)
      alert(`${dict.messages.networkErrorPrefix} ${e?.message || 'проверьте соединение'}`)
    }
  }

  const toggleService = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service]
    
    setSelectedServices(newServices)
    form.setValue("services", newServices, { shouldValidate: true })
  }

  const selectAllServices = () => {
    setSelectedServices(dict.services)
    form.setValue("services", dict.services, { shouldValidate: true })
  }

  const clearAllServices = () => {
    setSelectedServices([])
    form.setValue("services", [], { shouldValidate: true })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-2xl border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">{dict.title}</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            {dict.description}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Имя */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.firstName} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={dict.placeholders.firstName} 
                        {...field} 
                        className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Должность */}
            <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.position} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={dict.placeholders.position} 
                        {...field} 
                        className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.email} *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={dict.placeholders.email} 
                        {...field} 
                        className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Контактный номер */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  let inputRef: HTMLInputElement | null = null
                  const prefixLen = PHONE_PREFIX.length
                  return (
                    <FormItem>
                      <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.phone} *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder={dict.placeholders.phoneMask}
                          value={field.value ?? PHONE_PREFIX}
                          onChange={(e) => {
                            const local = extractLocalDigits(e.target.value)
                            const formatted = buildPhoneValue(local)
                            field.onChange(formatted)
                          }}
                          onPaste={(e) => {
                            e.preventDefault()
                            const text = (e.clipboardData || (window as any).clipboardData)?.getData("text") || ""
                            const local = extractLocalDigits(text)
                            const formatted = buildPhoneValue(local)
                            field.onChange(formatted)
                            setTimeout(() => {
                              const pos = (prefixLen + formatMoldovaLocal(local).length)
                              inputRef?.setSelectionRange(pos, pos)
                            }, 0)
                          }}
                          onKeyDown={(e) => {
                            const start = inputRef?.selectionStart ?? 0
                            if ((e.key === "Backspace" || e.key === "Delete") && start <= prefixLen) {
                              e.preventDefault()
                              inputRef?.setSelectionRange(prefixLen, prefixLen)
                            }
                            if (e.key === "ArrowLeft" && start <= prefixLen) {
                              e.preventDefault()
                              inputRef?.setSelectionRange(prefixLen, prefixLen)
                            }
                          }}
                          onFocus={() => {
                            setTimeout(() => {
                              const start = inputRef?.selectionStart ?? 0
                              if (start < prefixLen) inputRef?.setSelectionRange(prefixLen, prefixLen)
                            }, 0)
                          }}
                          maxLength={15}
                          pattern="^\+373\s\d{2}\s\d{3}\s\d{3}$"
                          ref={(el) => { inputRef = el; field.ref(el) }}
                          className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Бренд */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.brand} *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={dict.placeholders.brand} 
                              {...field} 
                              className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                )}
              />

              {/* Юридическое название компании */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel className="text-base text-gray-700 dark:text-gray-200">{dict.labels.companyName}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={dict.placeholders.companyName} 
                              {...field} 
                              className="text-lg py-6 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                )}
              />
            </div>



            {/* Услуги */}
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2">
                  <FormLabel className="text-base block mb-2 text-gray-700 dark:text-gray-200">{dict.labels.servicesQuestion}</FormLabel>
                </div>
                  <FormControl>
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={selectAllServices}
                          className="text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 text-xs"
                        >
                          {dict.buttons.selectAll}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearAllServices}
                          className="text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 text-xs"
                        >
                          {dict.buttons.clearAll}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dict.services.map((service) => (
                        <div
                          key={service}
                          className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                            selectedServices.includes(service)
                              ? "border-blue-400 bg-blue-100/50 dark:bg-blue-900/30 shadow-sm"
                              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                          onClick={() => toggleService(service)}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedServices.includes(service)
                              ? "border-blue-400 bg-blue-500"
                              : "border-gray-400 dark:border-gray-500"
                          }`}>
                            {selectedServices.includes(service) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <Label className="text-sm font-normal cursor-pointer flex-1 text-gray-700 dark:text-gray-200 leading-tight">
                            {service}
                          </Label>
                        </div>
                      ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Дополнительное сообщение */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">{dict.labels.message}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={dict.placeholders.message}
                      className="min-h-[100px] bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Согласие на обработку персональных данных */}
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 dark:text-gray-200">
                      {dict.labels.consent}
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full md:w-auto px-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-lg h-auto shadow-lg hover:shadow-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? dict.buttons.submitting : dict.buttons.submit}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  )
}