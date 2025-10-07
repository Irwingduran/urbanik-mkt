"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Leaf, Heart, ShoppingBag } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    marketplace: {
      title: "Marketplace",
      links: [
        { name: "Explorar Productos", href: "/marketplace" },
        { name: "Productos Destacados", href: "/marketplace?featured=true" },
        { name: "Ofertas Especiales", href: "/marketplace?sale=true" },
        { name: "Categorías", href: "/marketplace#categories" },
        { name: "Vendedores", href: "/vendors" }
      ]
    },
    company: {
      title: "Compañía",
      links: [
        { name: "Sobre Nosotros", href: "/about" },
        { name: "Nuestra Misión", href: "/impact" },
        { name: "Impacto Regenerativo", href: "/regen-score" },
        { name: "Blog", href: "/blog" },
        { name: "Contacto", href: "/contact" }
      ]
    },
    forVendors: {
      title: "Para Vendedores",
      links: [
        { name: "Vender en Urbanika", href: "/sell" },
        { name: "Onboarding", href: "/onboarding" },
        { name: "Centro de Vendedores", href: "/dashboard/vendor" },
        { name: "Recursos", href: "/help" },
        { name: "Promociones", href: "/promotions" }
      ]
    },
    support: {
      title: "Soporte",
      links: [
        { name: "Centro de Ayuda", href: "/help" },
        { name: "Preguntas Frecuentes", href: "/help#faq" },
        { name: "Envíos y Devoluciones", href: "/help#shipping" },
        { name: "Métodos de Pago", href: "/help#payment" },
        { name: "Garantía de Impacto", href: "/help#impact" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Términos y Condiciones", href: "/terms" },
        { name: "Política de Privacidad", href: "/privacy" },
        { name: "Política de Cookies", href: "/cookies" },
        { name: "Política de Reembolso", href: "/refund-policy" },
        { name: "Accesibilidad", href: "/accessibility" }
      ]
    }
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/urbanika", color: "hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/0xurbanika", color: "hover:text-sky-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/0xurbanika", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/0xurbanika", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/urbanika", color: "hover:text-red-500" }
  ]

  const impactStats = [
    { value: "12,458+", label: "Compras Sostenibles" },
    { value: "284K kg", label: "CO₂ Reducido" },
    { value: "156", label: "Comunidades" },
    { value: "$2.1M", label: "Invertido en Proyectos" }
  ]


  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
            {/* Impact Stats Banner */}
            <div className="border-b border-gray-700 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              Nuestro Impacto Colectivo
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-black text-white mb-1 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
         {/* Newsletter Section */}
         <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Mail className="w-6 h-6 text-green-400" />
                Suscríbete a Nuestro Newsletter
              </h3>
              <p className="text-gray-400">
                Recibe las últimas novedades sobre productos sostenibles, ofertas exclusivas y nuestro impacto regenerativo.
              </p>
            </div>
            <div>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Suscribirse
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                Al suscribirte, aceptas nuestra política de privacidad. Puedes cancelar en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Urbanika
              </h2>
              <p className="text-sm text-gray-400">Marketplace Regenerativo</p>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectamos a consumidores conscientes con productos que regeneran el planeta.
              Cada compra cuenta, cada decisión importa.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Ciudad de México, México</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="tel:+525512345678" className="hover:text-green-400 transition-colors">
                  +52 55 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="mailto:hola@urbanika.com" className="hover:text-green-400 transition-colors">
                  hola@urbanika.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-3">Síguenos</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 text-center md:text-left">
              <p className="mb-2">
                © {currentYear} Urbanika Marketplace. Todos los derechos reservados.
              </p>
              <p className="flex items-center justify-center md:justify-start gap-1">
                Hecho con <Heart className="w-4 h-4 text-green-500 fill-current" /> para un planeta mejor
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">
                <span className="text-green-400 font-semibold">100% Seguro</span> |
                <span className="ml-1">Envío a todo México</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
