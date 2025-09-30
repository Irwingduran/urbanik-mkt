'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Leaf,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const isNewUser = searchParams.get('new_user') === 'true'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    state: '',
    birthDate: '',
    sustainabilityFocus: [] as string[],
    preferredCategories: [] as string[],
    priceRange: '',
    notifyNewProducts: true,
    notifyPriceAlerts: true,
    notifyOrderUpdates: true,
    notifySustainability: true,
    notifyMarketing: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const sustainabilityOptions = [
    'Energía Solar', 'Gestión de Agua', 'Movilidad Eléctrica',
    'Gestión de Residuos', 'Iluminación', 'Calidad del Aire'
  ]

  const priceRanges = [
    { value: '0-500', label: '$0 - $500 MXN' },
    { value: '500-2000', label: '$500 - $2,000 MXN' },
    { value: '2000-5000', label: '$2,000 - $5,000 MXN' },
    { value: '5000+', label: '$5,000+ MXN' }
  ]

  useEffect(() => {
    if (session?.user?.name) {
      const nameParts = session.user.name.split(' ')
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      }))
    }
  }, [session])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSustainabilityToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      sustainabilityFocus: prev.sustainabilityFocus.includes(option)
        ? prev.sustainabilityFocus.filter(item => item !== option)
        : [...prev.sustainabilityFocus, option]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preferredCategories: formData.sustainabilityFocus // Use sustainability focus as preferred categories
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Wait a moment then redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard?welcome=true')
        }, 2000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Please sign in to complete your profile setup.</p>
            <div className="mt-4 text-center">
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Profile Setup Complete!</h2>
            <p className="text-gray-600 mb-4">
              Welcome to RegenMarket! Your profile has been set up successfully.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <Sparkles className="w-4 h-4" />
              <span>Redirecting to your dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        {isNewUser && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to RegenMarket!</h1>
            <p className="text-gray-600">Let's set up your profile to get personalized recommendations</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <span>Complete Your Profile</span>
              {!isNewUser && <Badge variant="outline">Update Profile</Badge>}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      required
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      placeholder="+52 555 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthDate">Birth Date (Optional)</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="birthDate"
                      type="date"
                      className="pl-10"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="city"
                      className="pl-10"
                      placeholder="Ciudad de México"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CDMX"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>

              {/* Sustainability Interests */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span>Sustainability Interests</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sustainabilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={formData.sustainabilityFocus.includes(option)}
                        onCheckedChange={() => handleSustainabilityToggle(option)}
                      />
                      <Label htmlFor={option} className="text-sm cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>Preferred Price Range</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={range.value}
                        checked={formData.priceRange === range.value}
                        onCheckedChange={() => handleInputChange('priceRange', range.value)}
                      />
                      <Label htmlFor={range.value} className="text-sm cursor-pointer">
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="border-t pt-6">
                <Label className="font-medium mb-3 block">Notification Preferences</Label>
                <div className="space-y-3">
                  {[
                    { key: 'notifyNewProducts', label: 'New sustainable products' },
                    { key: 'notifyPriceAlerts', label: 'Price alerts and deals' },
                    { key: 'notifyOrderUpdates', label: 'Order updates and shipping' },
                    { key: 'notifySustainability', label: 'Sustainability tips and impact reports' },
                    { key: 'notifyMarketing', label: 'Marketing and promotional offers' }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={notification.key}
                        checked={formData[notification.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(notification.key, checked === true)}
                      />
                      <Label htmlFor={notification.key} className="text-sm cursor-pointer">
                        {notification.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Setting up your profile...' : 'Complete Profile Setup'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {!isNewUser && (
              <div className="mt-6 text-center">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Skip for now and go to dashboard
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}