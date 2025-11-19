"use client"

import { useState, useCallback } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  Info,
} from "lucide-react"
import { DOCUMENT_REQUIREMENTS } from "@/lib/regenmark"
import type { RegenMarkType } from "@prisma/client"

interface DocumentUploadFormProps {
  regenMarkType: RegenMarkType
  onDocumentsChange: (files: File[]) => void
}

export default function DocumentUploadForm({
  regenMarkType,
  onDocumentsChange,
}: DocumentUploadFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const requirements = DOCUMENT_REQUIREMENTS[regenMarkType]

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      addFiles(files)
    },
    []
  )

  const addFiles = (newFiles: File[]) => {
    const updatedFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(updatedFiles)
    onDocumentsChange(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(updatedFiles)
    onDocumentsChange(updatedFiles)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [uploadedFiles])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Requirements */}
      <div>
        <h3 className="font-semibold mb-3">Documentos Requeridos</h3>
        <div className="space-y-2">
          {requirements.required.map((req, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      {requirements.optional.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Documentos Opcionales
            <Badge variant="outline" className="text-xs">
              Recomendados
            </Badge>
          </h3>
          <div className="space-y-2">
            {requirements.optional.map((req, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Cargar Documentos
        </Label>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Arrastra y suelta tus archivos aquí, o
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Seleccionar Archivos
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Formatos aceptados: PDF, JPG, PNG, DOC, DOCX (máx. 10MB por archivo)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">
            Archivos Cargados ({uploadedFiles.length})
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Importante:</strong> Los documentos serán revisados por nuestro
          equipo de evaluadores. Asegúrate de que toda la información sea
          legible y esté actualizada. El proceso de evaluación toma entre 15-43
          horas dependiendo de la complejidad.
        </AlertDescription>
      </Alert>

      {/* Upload Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
        <h4 className="font-semibold mb-2">Consejos para tu solicitud:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Asegúrate de que los documentos estén actualizados (último año)</li>
          <li>Las imágenes deben ser claras y legibles</li>
          <li>Los PDFs deben contener texto seleccionable cuando sea posible</li>
          <li>
            Incluye documentos opcionales para aumentar tu puntuación
          </li>
          <li>Todos los documentos deben estar en español o inglés</li>
        </ul>
      </div>
    </div>
  )
}
