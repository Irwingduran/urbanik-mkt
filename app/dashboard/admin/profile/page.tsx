'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Shield, Settings, Clock, Key, Activity } from 'lucide-react'

export default function AdminProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    } else if (session?.user) {
      setAdminInfo({
        name: session.user.name || '',
        email: session.user.email || '',
        role: 'ADMIN',
      })
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-purple-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setAdminInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving admin profile:', adminInfo)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Perfil del Administrador</h1>
          <p className="text-gray-600 mt-2">Gestiona tu cuenta y configuración del sistema</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Información Personal
                    </CardTitle>
                    <CardDescription>Actualiza tu información de perfil</CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'default' : 'outline'}
                  >
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={adminInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={adminInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 hover:bg-purple-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrador
                    </Badge>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    Guardar Cambios
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-red-600" />
                  Seguridad
                </CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Cambiar Contraseña</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Ingresa tu contraseña actual"
                      className="max-w-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Ingresa una nueva contraseña"
                      className="max-w-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
                      className="max-w-md"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Actualizar Contraseña
                  </Button>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Autenticación de Dos Factores (2FA)</h3>
                  <p className="text-sm text-gray-600">
                    Añade una capa adicional de seguridad a tu cuenta
                  </p>
                  <Badge variant="outline">No habilitado</Badge>
                  <Button variant="outline">Habilitar 2FA</Button>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Sesiones Activas</h3>
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Esta Sesión</p>
                          <p className="text-sm text-gray-600">Navegador actual</p>
                        </div>
                        <Badge>Activa</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline">Cerrar Todas las Sesiones</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Registro de Actividad
                </CardTitle>
                <CardDescription>Historial de acciones recientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Activity Items */}
                  {[
                    {
                      action: 'Acceso a la plataforma',
                      timestamp: 'Hoy a las 10:30 AM',
                      icon: <Clock className="w-4 h-4 text-blue-600" />,
                    },
                    {
                      action: 'Revisión de solicitudes de vendedores',
                      timestamp: 'Hoy a las 9:15 AM',
                      icon: <Activity className="w-4 h-4 text-green-600" />,
                    },
                    {
                      action: 'Actualización de configuración del sistema',
                      timestamp: 'Ayer a las 3:45 PM',
                      icon: <Settings className="w-4 h-4 text-purple-600" />,
                    },
                    {
                      action: 'Cambio de contraseña',
                      timestamp: 'Hace 5 días',
                      icon: <Key className="w-4 h-4 text-red-600" />,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="mt-1">{item.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-600">{item.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rol</p>
                  <p className="text-2xl font-bold text-gray-900">Administrador</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Permisos</p>
                  <p className="text-2xl font-bold text-gray-900">Totales</p>
                </div>
                <Key className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="text-2xl font-bold text-green-600">Activo</p>
                </div>
                <Activity className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
