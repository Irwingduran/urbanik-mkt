"use client"

import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Leaf,
  Store,
  Sparkles,
  Building2,
  FileCheck,
  TrendingUp
} from "lucide-react"
import VendorForm from "@/components/onboarding/vendor-form"
import NFTEducation from "@/components/onboarding/nft-education"
import Completion from "@/components/onboarding/completion"
import { useVendorStatus } from "@/hooks/useVendorStatus"

const steps = [
  {
    id: "welcome",
    title: "Bienvenida",
    icon: Sparkles,
    description: "Empieza tu viaje"
  },
  {
    id: "form",
    title: "Información",
    icon: Building2,
    description: "Datos de tu negocio"
  },
  {
    id: "education",
    title: "NFT & Recompensas",
    icon: FileCheck,
    description: "Cómo funciona"
  },
  {
    id: "completion",
    title: "¡Listo!",
    icon: CheckCircle,
    description: "Comienza a vender"
  },
]

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { status: vendorStatus, hasVendorRole, isLoading: isLoadingVendorStatus } = useVendorStatus()

  const [currentStep, setCurrentStep] = useState(0)
  const [userType] = useState<"vendor">("vendor")
  const [formData, setFormData] = useState({})

  // Check if user is authenticated
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, router])

  // Redirect if user already has an active application or is already a vendor
  useEffect(() => {
    if (isLoadingVendorStatus) return

    // Redirect if user is already a vendor (approved)
    if (hasVendorRole) {
      router.push('/dashboard/vendor')
      return
    }

    // Redirect if user has a pending or in_review application
    if (vendorStatus === 'pending' || vendorStatus === 'in_review') {
      router.push('/dashboard')
      return
    }

    // Redirect if user is approved (double check with role)
    if (vendorStatus === 'approved') {
      router.push('/dashboard/vendor')
      return
    }

    // Allow access only if:
    // - vendorStatus === 'not_applied' (first time)
    // - vendorStatus === 'rejected' (can reapply)
  }, [vendorStatus, hasVendorRole, isLoadingVendorStatus, router])

  const currentStepId = steps[currentStep].id
  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFormSubmit = (data: Record<string, unknown>) => {
    setFormData(data)
    nextStep()
  }

  // Show loading state while checking authentication and vendor status
  if (!session || isLoadingVendorStatus) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Compact Header */}
<div className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">✓</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            Urbanika
          </h1>
          <p className="text-xs text-gray-500 font-medium">Onboarding Vendedor</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden sm:block">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Store className="w-3 h-3 mr-1" />
            Plan Starter
          </Badge>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">
            {session?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4 max-w-6xl h-full">
          {/* Compact Step Indicators */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      {/* Smaller Circle */}
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 mb-1
                          ${isActive
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-110"
                            : isCompleted
                              ? "bg-green-500 shadow-md"
                              : "bg-gray-200"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className={`w-5 h-5 ${isActive || isCompleted ? "text-white" : "text-gray-400"}`} />
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <p className={`text-[10px] font-semibold ${isActive ? "text-green-700" : isCompleted ? "text-green-600" : "text-gray-400"}`}>
                          {step.title}
                        </p>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-2 mb-6">
                        <div
                          className={`h-0.5 rounded-full transition-all duration-300 ${
                            index < currentStep ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="shadow-xl border-0 overflow-hidden h-[calc(100vh-220px)]">
            <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 h-full overflow-y-auto">
              <div className="p-6">

                {/* Welcome Step - Compact */}
                {currentStepId === "welcome" && (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                      ¡Bienvenido a Urbanika Marketplace! 🎉
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Únete a nuestra comunidad de vendedores sostenibles
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                          <Store className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">Vende tus Productos</h3>
                        <p className="text-xs text-gray-600">
                          Miles de compradores conscientes
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                          <FileCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">Certificación NFT</h3>
                        <p className="text-xs text-gray-600">
                          NFTs que evolucionan con tu impacto
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">Crece tu Negocio</h3>
                        <p className="text-xs text-gray-600">
                          Herramientas y analytics avanzados respaldados por AI y blockchain
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        onClick={nextStep}
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 shadow-lg"
                      >
                        Comenzar Registro
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-3">
                        Solo 5 minutos para completar
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Step */}
                {currentStepId === "form" && (
                  <VendorForm onSubmit={handleFormSubmit} />
                )}

                {/* Education Step */}
                {currentStepId === "education" && (
                  <NFTEducation userType={userType} onComplete={nextStep} />
                )}

                {/* Completion Step */}
                {currentStepId === "completion" && (
                  <Completion userType={userType} formData={formData} />
                )}
              </div>
            </div>
          </Card>

          {/* Compact Navigation Footer */}
          {currentStepId !== "welcome" && currentStepId !== "completion" && (
            <div className="flex justify-between items-center mt-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                size="sm"
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="text-xs">Anterior</span>
              </Button>

              <div className="text-[10px] text-gray-500">
                ¿Ayuda? <a href="/support" className="text-green-600 hover:underline">Contacto</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

