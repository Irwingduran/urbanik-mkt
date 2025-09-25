import Link from "next/link"
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const footerLinks = {
    marketplace: [
      { name: "Explorar Productos", href: "/marketplace" },
      { name: "Categorías", href: "/categories" },
      { name: "Vendedores Verificados", href: "/vendors" },
      { name: "Ofertas Especiales", href: "/deals" },
    ],
    sustainability: [
      { name: "REGEN Score", href: "/regen-score" },
      { name: "Certificaciones", href: "/certifications" },
      { name: "Impacto Ambiental", href: "/impact" },
      { name: "NFTs Sostenibles", href: "/nfts" },
    ],
    support: [
      { name: "Centro de Ayuda", href: "/help" },
      { name: "Contacto", href: "/contact" },
      { name: "Términos de Servicio", href: "/terms" },
      { name: "Política de Privacidad", href: "/privacy" },
    ],
    vendors: [
      { name: "Vender en EcoMarket", href: "/sell" },
      { name: "Panel de Vendedor", href: "/dashboard/vendor" },
      { name: "Recursos para Vendedores", href: "/vendor-resources" },
      { name: "Programa de Afiliados", href: "/affiliates" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EcoMarket</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              El marketplace líder en productos y servicios sostenibles. Conectamos compradores conscientes con
              vendedores comprometidos con el planeta.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sustainability */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sostenibilidad</h3>
            <ul className="space-y-2">
              {footerLinks.sustainability.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vendedores</h3>
            <ul className="space-y-2">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 mb-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hola@ecomarket.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+52 55 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Ciudad de México, México</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 EcoMarket. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Certificado por:</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">B Corp Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
