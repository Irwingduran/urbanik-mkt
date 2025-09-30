"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Calendar, MapPin, Globe, Edit, Share2 } from "lucide-react"
import VendorHeader from "@/components/dashboard/vendor-header"
import CompanyHistory from "@/components/profile/company-history"
import RegenScoreChart from "@/components/profile/regen-score-chart"
import NFTEvolutionHistory from "@/components/profile/nft-evolution-history"
import ProductsServices from "@/components/profile/products-services"
import EnvironmentalImpact from "@/components/profile/environmental-impact"
import CustomerReviews from "@/components/profile/customer-reviews"

// Mock data - En producción vendría de la API
const vendorProfileData = {
  company: {
    name: "EcoTech Solutions",
    founded: "2018",
    location: "San Francisco, CA",
    website: "www.ecotech-solutions.com",
    email: "info@ecotech-solutions.com",
    phone: "+1 (555) 123-4567",
    employees: "50-100",
    description: "Empresa líder en soluciones tecnológicas sostenibles",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=800",
  },
  history: {
    founded: "2018",
    milestones: [
      {
        year: "2018",
        title: "Fundación de EcoTech Solutions",
        description: "Iniciamos con la misión de democratizar la tecnología sostenible",
        impact: "Primeros 5 productos eco-friendly lanzados",
      },
      {
        year: "2019",
        title: "Primera Certificación ISO 14001",
        description: "Obtuvimos nuestra primera certificación ambiental internacional",
        impact: "Reducción del 30% en emisiones de CO₂",
      },
      {
        year: "2020",
        title: "Expansión Internacional",
        description: "Llegamos a 15 países con nuestros productos sostenibles",
        impact: "500,000 toneladas de CO₂ evitadas",
      },
      {
        year: "2021",
        title: "Certificación B-Corp",
        description: "Nos convertimos en una empresa con propósito certificada",
        impact: "1M de litros de agua ahorrados",
      },
      {
        year: "2022",
        title: "Energía 100% Renovable",
        description: "Transición completa a energías limpias en todas nuestras operaciones",
        impact: "Huella de carbono negativa alcanzada",
      },
      {
        year: "2023",
        title: "Liderazgo en Innovación",
        description: "Reconocidos como la empresa más innovadora en sostenibilidad",
        impact: "2.4M toneladas de CO₂ evitadas acumuladas",
      },
      {
        year: "2024",
        title: "Marketplace EcoTech",
        description: "Lanzamiento en la plataforma EcoTech como proveedor estrella",
        impact: "REGEN SCORE de 78 puntos alcanzado",
      },
    ],
    vision: "Ser la empresa líder mundial en soluciones tecnológicas que regeneren el planeta",
    mission:
      "Desarrollar y comercializar tecnologías que no solo sean sostenibles, sino que activamente mejoren el medio ambiente",
    values: ["Innovación Sostenible", "Transparencia Total", "Impacto Positivo", "Colaboración Global"],
  },
  regenScoreHistory: [
    { month: "Ene 2024", score: 65, carbonReduction: 200, waterSaving: 80000, renewableEnergy: 75, wasteReduction: 85 },
    { month: "Feb 2024", score: 68, carbonReduction: 210, waterSaving: 85000, renewableEnergy: 78, wasteReduction: 87 },
    { month: "Mar 2024", score: 71, carbonReduction: 220, waterSaving: 95000, renewableEnergy: 80, wasteReduction: 88 },
    {
      month: "Abr 2024",
      score: 73,
      carbonReduction: 225,
      waterSaving: 105000,
      renewableEnergy: 82,
      wasteReduction: 90,
    },
    {
      month: "May 2024",
      score: 75,
      carbonReduction: 235,
      waterSaving: 115000,
      renewableEnergy: 83,
      wasteReduction: 91,
    },
    {
      month: "Jun 2024",
      score: 78,
      carbonReduction: 245,
      waterSaving: 125000,
      renewableEnergy: 85,
      wasteReduction: 92,
    },
  ],
  nftEvolution: [
    {
      level: "Semilla Verde",
      dateAchieved: "2024-01-15",
      score: 65,
      description: "Primer NFT como proveedor comprometido",
      image: "/placeholder.svg?height=150&width=150",
      benefits: ["Perfil verificado", "Acceso básico al marketplace"],
    },
    {
      level: "Hoja Creciente",
      dateAchieved: "2024-05-20",
      score: 75,
      description: "Evolución por mejoras sostenidas en métricas",
      image: "/placeholder.svg?height=150&width=150",
      benefits: ["Herramientas premium", "Descuentos en certificaciones", "Comunidad exclusiva"],
    },
  ],
  products: [
    {
      id: 1,
      name: "Panel Solar Inteligente X1",
      category: "Energía Limpia",
      price: "$1,299",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      reviews: 127,
      environmentalBenefits: [
        "Reduce emisiones de CO₂ en 2.5 toneladas/año",
        "Genera 4,500 kWh de energía limpia anualmente",
        "Materiales 95% reciclables",
        "Vida útil de 25+ años",
      ],
      certifications: ["Energy Star", "ISO 14001", "LEED Certified"],
      impact: {
        carbonSaved: "2.5 ton CO₂/año",
        energyGenerated: "4,500 kWh/año",
        materialsRecycled: "95%",
        waterSaved: "500 L/año",
      },
    },
    {
      id: 2,
      name: "Sistema de Filtrado Agua Quantum",
      category: "Tecnología del Agua",
      price: "$899",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      reviews: 89,
      environmentalBenefits: [
        "Purifica 10,000 litros de agua diarios",
        "Elimina 99.9% de contaminantes sin químicos",
        "Reduce uso de botellas plásticas en 90%",
        "Tecnología de filtrado cuántico patentada",
      ],
      certifications: ["NSF Certified", "WQA Gold Seal", "ISO 14001"],
      impact: {
        carbonSaved: "1.2 ton CO₂/año",
        waterPurified: "10,000 L/día",
        plasticReduced: "90%",
        chemicalsFree: "100%",
        energyEfficient: "80% menos consumo",
      },
    },
  ],
  reviews: [
    {
      id: 1,
      customerName: "María González",
      company: "Green Building Corp",
      rating: 5,
      date: "2024-01-10",
      comment:
        "Excelente calidad y verdadero compromiso ambiental. Los paneles solares superaron nuestras expectativas.",
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      customerName: "Carlos Ruiz",
      company: "Sustainable Hotels SA",
      rating: 5,
      date: "2024-01-05",
      comment:
        "El sistema de filtrado de agua ha transformado nuestras operaciones. Calidad excepcional y soporte técnico de primera.",
      verified: true,
      helpful: 18,
    },
    {
      id: 3,
      customerName: "Ana Martínez",
      company: "EcoResidences",
      rating: 4,
      date: "2023-12-20",
      comment: "Muy satisfecha con la compra. La instalación fue sencilla y el impacto ambiental es medible.",
      verified: true,
      helpful: 12,
    },
  ],
  overallImpact: {
    totalCO2Saved: "2,400,000",
    totalWaterSaved: "847,000,000",
    totalEnergyGenerated: "1,200",
    totalWasteReduced: "340,000",
    customersImpacted: "15,000",
    countriesServed: "23",
  },
}

export default function VendorProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader
        vendorData={{
          name: vendorProfileData.company.name,
          contactName: "Juan Pérez",
          email: vendorProfileData.company.email,
          memberSince: "2024-01-15",
          regenScore: 78,
          nftLevel: "Hoja Creciente",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl overflow-hidden">
            <img
              src={vendorProfileData.company.coverImage || "/placeholder.svg"}
              alt="Company Cover"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg p-4">
              <img
                src={vendorProfileData.company.logo || "/placeholder.svg"}
                alt={vendorProfileData.company.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="outline" className="bg-white/90">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" className="bg-white/90">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* Company Info */}
        <div className="ml-44 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendorProfileData.company.name}</h1>
              <p className="text-gray-600 mb-4">{vendorProfileData.company.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Fundada en {vendorProfileData.company.founded}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{vendorProfileData.company.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{vendorProfileData.company.employees} empleados</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{vendorProfileData.company.website}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <Award className="w-3 h-3 mr-1" />
                REGEN SCORE: 78
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">Proveedor Verificado</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">B-Corp Certified</Badge>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="nft">NFTs</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="impact">Impacto</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CompanyHistory history={vendorProfileData.history} />
              </div>
              <div>
                <CustomerReviews reviews={vendorProfileData.reviews} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <CompanyHistory history={vendorProfileData.history} detailed={true} />
          </TabsContent>

          <TabsContent value="analytics">
            <RegenScoreChart data={vendorProfileData.regenScoreHistory} />
          </TabsContent>

          <TabsContent value="nft">
            <NFTEvolutionHistory evolution={vendorProfileData.nftEvolution} />
          </TabsContent>

          <TabsContent value="products">
            <ProductsServices products={vendorProfileData.products} />
          </TabsContent>

          <TabsContent value="impact">
            <EnvironmentalImpact
              products={vendorProfileData.products}
              overallImpact={vendorProfileData.overallImpact}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
