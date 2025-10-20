'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout, DashboardHeader } from '@/components/shared/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Bell,
  Shield,
  Eye,
  Mail,
  Globe,
  Smartphone,
  Lock,
  Save,
  Trash2, 
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    bio: '',
    website: '',
    location: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailUpdates: true,
    pushOrders: true,
    pushMessages: false,
    pushUpdates: false,
    smsOrders: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showOrders: false,
    allowMessages: true
  })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'security', label: 'Seguridad', icon: Lock }
  ]

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Cambios guardados",
        description: "Tu perfil ha sido actualizado exitosamente",
      })
    }, 1000)
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación han sido guardadas",
      })
    }, 1000)
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Configuración actualizada",
        description: "Tu configuración de privacidad ha sido guardada",
      })
    }, 1000)
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Configuración"
        subtitle="Gestiona tu cuenta y preferencias"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Configuración' }
        ]}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Perfil */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información del Perfil
                  </CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y detalles de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="Ciudad, País"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="https://tusitio.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Cuéntanos sobre ti..."
                      rows={4}
                    />
                    <p className="text-sm text-gray-500">
                      {profileData.bio.length}/500 caracteres
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancelar</Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notificaciones */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Preferencias de Notificación
                  </CardTitle>
                  <CardDescription>
                    Configura cómo y cuándo quieres recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <h3 className="text-sm font-semibold">Notificaciones por Email</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Actualizaciones de órdenes</p>
                          <p className="text-xs text-gray-500">Recibe emails sobre el estado de tus pedidos</p>
                        </div>
                        <Switch
                          checked={notifications.emailOrders}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailOrders: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Promociones y ofertas</p>
                          <p className="text-xs text-gray-500">Recibe ofertas especiales y descuentos</p>
                        </div>
                        <Switch
                          checked={notifications.emailPromotions}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailPromotions: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Actualizaciones del producto</p>
                          <p className="text-xs text-gray-500">Nuevas características y mejoras</p>
                        </div>
                        <Switch
                          checked={notifications.emailUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailUpdates: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <h3 className="text-sm font-semibold">Notificaciones Push</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Órdenes y envíos</p>
                          <p className="text-xs text-gray-500">Estado de tus pedidos en tiempo real</p>
                        </div>
                        <Switch
                          checked={notifications.pushOrders}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushOrders: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Mensajes</p>
                          <p className="text-xs text-gray-500">Nuevos mensajes de vendedores</p>
                        </div>
                        <Switch
                          checked={notifications.pushMessages}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushMessages: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Actualizaciones</p>
                          <p className="text-xs text-gray-500">Novedades importantes de la plataforma</p>
                        </div>
                        <Switch
                          checked={notifications.pushUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushUpdates: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* SMS Notifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <h3 className="text-sm font-semibold">Notificaciones por SMS</h3>
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Actualizaciones de órdenes</p>
                          <p className="text-xs text-gray-500">Recibe SMS sobre tus pedidos importantes</p>
                        </div>
                        <Switch
                          checked={notifications.smsOrders}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsOrders: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Restaurar por Defecto</Button>
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar Preferencias'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacidad */}
            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacidad y Visibilidad
                  </CardTitle>
                  <CardDescription>
                    Controla quién puede ver tu información y actividad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <p className="text-sm font-medium">Perfil público</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Permite que otros usuarios vean tu perfil
                        </p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(checked) =>
                          setPrivacy({ ...privacy, profileVisible: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <p className="text-sm font-medium">Mostrar email</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Permite que vendedores vean tu email
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setPrivacy({ ...privacy, showEmail: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <p className="text-sm font-medium">Historial de órdenes visible</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Muestra tus compras anteriores en tu perfil
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showOrders}
                        onCheckedChange={(checked) =>
                          setPrivacy({ ...privacy, showOrders: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <p className="text-sm font-medium">Permitir mensajes</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Permite que vendedores te envíen mensajes directos
                        </p>
                      </div>
                      <Switch
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) =>
                          setPrivacy({ ...privacy, allowMessages: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Sobre tu privacidad</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Nunca compartiremos tu información personal con terceros sin tu consentimiento.
                          Lee nuestra{' '}
                          <a href="/privacy" className="underline">
                            política de privacidad
                          </a>{' '}
                          para más información.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancelar</Button>
                    <Button
                      onClick={handleSavePrivacy}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seguridad */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Seguridad de la Cuenta
                    </CardTitle>
                    <CardDescription>
                      Gestiona la seguridad de tu cuenta y contraseña
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Contraseña actual</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="••••••••"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Nueva contraseña</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Lock className="w-4 h-4 mr-2" />
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                    <CardDescription>
                      Acciones irreversibles relacionadas con tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-red-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Eliminar cuenta</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Una vez eliminada, tu cuenta no podrá ser recuperada
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
