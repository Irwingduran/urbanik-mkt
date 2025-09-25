"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, MapPin, Heart, Leaf, Droplets, Zap, Recycle, Lightbulb } from "lucide-react"

interface UserFormProps {
  onSubmit: (data: Record<string, unknown>) => void
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    interests: [] as string[],
    sustainabilityGoals: [] as string[],
    monthlyBudget: "",
  })

  const interestOptions = [
    { id: "energia-limpia", label: "Energía Limpia", icon: Zap },
    { id: "agua-sostenible", label: "Tecnología del Agua", icon: Droplets },
    { id: "transporte-verde", label: "Transporte Sostenible", icon: Leaf },
    { id: "hogar-ecologico", label: "Hogar Ecológico", icon: Heart },
    { id: "reciclaje", label: "Reciclaje y Residuos", icon: Recycle },
    { id: "agricultura", label: "Agricultura Sostenible", icon: Leaf },
  ]

  const sustainabilityGoals = [
    "Reducir mi huella de carbono",
    "Ahorrar agua en mi hogar",
    "Usar 100% energía renovable",
    "Minimizar residuos",
    "Apoyar empresas locales",
    "Educación ambiental familiar",
  ]

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleInterestToggle = useCallback((interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }))
  }, [])

  const handleGoalToggle = useCallback((goal: string) => {
    setFormData((prev) => ({
      ...prev,
      sustainabilityGoals: prev.sustainabilityGoals.includes(goal)
        ? prev.sustainabilityGoals.filter((g) => g !== goal)
        : [...prev.sustainabilityGoals, goal],
    }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    },
    [formData, onSubmit],
  )

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu Perfil Eco-Friendly</h2>
        <p className="text-gray-600">
          Personaliza tu experiencia para encontrar productos que se alineen con tus valores
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="María"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="González"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="maria@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ciudad, País"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Intereses Sostenibles</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Selecciona las categorías que más te interesan</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interestOptions.map((interest) => {
                const Icon = interest.icon
                const isSelected = formData.interests.includes(interest.id)
                return (
                  <div
                    key={interest.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={isSelected} />
                      <Icon className={`w-5 h-5 ${isSelected ? "text-green-600" : "text-gray-500"}`} />
                      <span className={`font-medium ${isSelected ? "text-green-900" : "text-gray-700"}`}>
                        {interest.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Goals */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Objetivos de Sostenibilidad</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">¿Qué metas ambientales quieres alcanzar?</p>

            <div className="grid md:grid-cols-2 gap-4">
              {sustainabilityGoals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`goal-${index}`}
                    checked={formData.sustainabilityGoals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={`goal-${index}`} className="text-sm cursor-pointer flex-1">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>

            {formData.sustainabilityGoals.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Tus objetivos:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.sustainabilityGoals.map((goal, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Presupuesto Mensual (Opcional)</h3>
              <p className="text-sm text-gray-600">Esto nos ayuda a recomendarte productos adecuados</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {["< $100", "$100-500", "$500-1000", "> $1000"].map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => handleInputChange("monthlyBudget", budget)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    formData.monthlyBudget === budget
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Recomendaciones Personalizadas</h4>
              <p className="text-sm text-gray-700">
                Con base en tus intereses y objetivos, recibirás recomendaciones personalizadas de productos que te
                ayuden a alcanzar tus metas de sostenibilidad. También podrás seguir tu progreso e impacto ambiental a
                través de tu dashboard personal.
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
          Crear Mi Cuenta
        </Button>
      </form>
    </div>
  )
}
