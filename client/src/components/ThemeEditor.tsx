'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Type, Layout, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  borderRadius: string
  spacing: string
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
  spacing: '1rem'
}

const colorPresets = [
  { name: 'Lojistik Mavi', primary: '#1e40af', secondary: '#0ea5e9', accent: '#22c55e' },
  { name: 'Nakliye Yeşil', primary: '#059669', secondary: '#10b981', accent: '#3b82f6' },
  { name: 'Depo Turuncu', primary: '#ea580c', secondary: '#f59e0b', accent: '#dc2626' },
  { name: 'Kargo Mor', primary: '#7c3aed', secondary: '#a855f7', accent: '#06b6d4' },
  { name: 'Operasyon Gri', primary: '#374151', secondary: '#6b7280', accent: '#059669' },
  { name: 'Profesyonel', primary: '#1f2937', secondary: '#4b5563', accent: '#dc2626' }
]

const fontPresets = [
  { name: 'Inter (Profesyonel)', value: 'Inter' },
  { name: 'Roboto (Modern)', value: 'Roboto' },
  { name: 'Open Sans (Okunabilir)', value: 'Open Sans' },
  { name: 'Poppins (Şık)', value: 'Poppins' },
  { name: 'Montserrat (Kurumsal)', value: 'Montserrat' },
  { name: 'Source Sans Pro (Temiz)', value: 'Source Sans Pro' }
]

export default function ThemeEditor() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'presets'>('colors')
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [previewMode, setPreviewMode] = useState(false)

  const updateTheme = (key: keyof ThemeConfig, value: string) => {
    const newTheme = { ...theme, [key]: value }
    setTheme(newTheme)
    
    // Apply theme to document
    const root = document.documentElement
    root.style.setProperty('--primary-color', newTheme.primaryColor)
    root.style.setProperty('--secondary-color', newTheme.secondaryColor)
    root.style.setProperty('--accent-color', newTheme.accentColor)
    root.style.setProperty('--background-color', newTheme.backgroundColor)
    root.style.setProperty('--text-color', newTheme.textColor)
    root.style.setProperty('--border-radius', newTheme.borderRadius)
    root.style.setProperty('--spacing', newTheme.spacing)
    
    // Apply font family
    document.body.style.fontFamily = newTheme.fontFamily
  }

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateTheme('primaryColor', preset.primary)
    updateTheme('secondaryColor', preset.secondary)
    updateTheme('accentColor', preset.accent)
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
    // Reset to default values
    const root = document.documentElement
    root.style.removeProperty('--primary-color')
    root.style.removeProperty('--secondary-color')
    root.style.removeProperty('--accent-color')
    root.style.removeProperty('--background-color')
    root.style.removeProperty('--text-color')
    root.style.removeProperty('--border-radius')
    root.style.removeProperty('--spacing')
    document.body.style.fontFamily = 'Inter'
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="icon"
        >
          <Palette className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* Theme Editor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tema Editörü</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </Button>
              </div>

              {/* Preview Toggle */}
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Önizleme Modu</span>
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'colors', label: 'Renkler', icon: Palette },
                  { id: 'typography', label: 'Tipografi', icon: Type },
                  { id: 'layout', label: 'Düzen', icon: Layout },
                  { id: 'presets', label: 'Şablonlar', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Color Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  {/* Color Presets */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Renk Hazır Şablonları</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyColorPreset(preset)}
                          className="p-3 border rounded-lg hover:border-blue-500 transition-colors"
                        >
                          <div className="flex space-x-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <span className="text-sm font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Özel Renkler</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ana Renk</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) => updateTheme('primaryColor', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={theme.primaryColor}
                            onChange={(e) => updateTheme('primaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">İkincil Renk</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.secondaryColor}
                            onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={theme.secondaryColor}
                            onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vurgu Rengi</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.accentColor}
                            onChange={(e) => updateTheme('accentColor', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={theme.accentColor}
                            onChange={(e) => updateTheme('accentColor', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Font Ailesi</h3>
                    <div className="space-y-2">
                      {fontPresets.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => updateTheme('fontFamily', font.value)}
                          className={`w-full p-3 text-left border rounded-lg transition-colors ${
                            theme.fontFamily === font.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Köşe Yuvarlaklığı</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Köşeli (Endüstriyel)', value: '0rem' },
                        { name: 'Küçük (Minimal)', value: '0.25rem' },
                        { name: 'Orta (Standart)', value: '0.5rem' },
                        { name: 'Büyük (Modern)', value: '0.75rem' },
                        { name: 'Çok Büyük (Yumuşak)', value: '1rem' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateTheme('borderRadius', option.value)}
                          className={`w-full p-3 text-left border rounded-lg transition-colors ${
                            theme.borderRadius === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Kart Gölgesi Stili</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Minimal', value: 'shadow-sm' },
                        { name: 'Standart', value: 'shadow-md' },
                        { name: 'Belirgin', value: 'shadow-lg' },
                        { name: 'Güçlü', value: 'shadow-xl' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            // Apply shadow class to all cards
                            const cards = document.querySelectorAll('.shadow-lg, .shadow-md, .shadow-sm, .shadow-xl')
                            cards.forEach(card => {
                              card.className = card.className.replace(/shadow-\w+/g, option.value)
                            })
                          }}
                          className="w-full p-3 text-left border rounded-lg transition-colors border-gray-200 hover:border-gray-300"
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Arayüz Yoğunluğu</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Kompakt (Daha Fazla İçerik)', value: 'compact' },
                        { name: 'Standart (Dengeli)', value: 'standard' },
                        { name: 'Geniş (Rahat)', value: 'spacious' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            // Apply spacing based on option
                            const root = document.documentElement
                            switch(option.value) {
                              case 'compact':
                                root.style.setProperty('--spacing', '0.5rem')
                                root.style.setProperty('--padding', '1rem')
                                break
                              case 'standard':
                                root.style.setProperty('--spacing', '1rem')
                                root.style.setProperty('--padding', '1.5rem')
                                break
                              case 'spacious':
                                root.style.setProperty('--spacing', '1.5rem')
                                root.style.setProperty('--padding', '2rem')
                                break
                            }
                          }}
                          className="w-full p-3 text-left border rounded-lg transition-colors border-gray-200 hover:border-gray-300"
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Presets Tab */}
              {activeTab === 'presets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">3PL Lojistik Temaları</h3>
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Profesyonel Lojistik',
                          description: 'Kurumsal mavi tonları, güvenilir görünüm',
                          colors: { primary: '#1e40af', secondary: '#0ea5e9', accent: '#22c55e' },
                          font: 'Inter',
                          radius: '0.5rem'
                        },
                        {
                          name: 'Modern Depo',
                          description: 'Yeşil tonları, doğal ve temiz',
                          colors: { primary: '#059669', secondary: '#10b981', accent: '#3b82f6' },
                          font: 'Roboto',
                          radius: '0.75rem'
                        },
                        {
                          name: 'Endüstriyel',
                          description: 'Gri tonları, dayanıklı ve güçlü',
                          colors: { primary: '#374151', secondary: '#6b7280', accent: '#059669' },
                          font: 'Open Sans',
                          radius: '0.25rem'
                        },
                        {
                          name: 'Dinamik Operasyon',
                          description: 'Turuncu tonları, enerjik ve aktif',
                          colors: { primary: '#ea580c', secondary: '#f59e0b', accent: '#dc2626' },
                          font: 'Poppins',
                          radius: '0.5rem'
                        }
                      ].map((preset, index) => (
                        <div
                          key={preset.name}
                          className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                          onClick={() => {
                            updateTheme('primaryColor', preset.colors.primary)
                            updateTheme('secondaryColor', preset.colors.secondary)
                            updateTheme('accentColor', preset.colors.accent)
                            updateTheme('fontFamily', preset.font)
                            updateTheme('borderRadius', preset.radius)
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                            <div className="flex space-x-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.colors.primary }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.colors.secondary }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.colors.accent }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{preset.description}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Font: {preset.font} • Radius: {preset.radius}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hızlı Uygulamalar</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          updateTheme('primaryColor', '#1e40af')
                          updateTheme('secondaryColor', '#0ea5e9')
                          updateTheme('accentColor', '#22c55e')
                          updateTheme('fontFamily', 'Inter')
                          updateTheme('borderRadius', '0.5rem')
                        }}
                        className="p-3 border rounded-lg hover:border-blue-500 transition-colors text-center"
                      >
                        <div className="text-sm font-medium">Lojistik Mavi</div>
                      </button>
                      <button
                        onClick={() => {
                          updateTheme('primaryColor', '#059669')
                          updateTheme('secondaryColor', '#10b981')
                          updateTheme('accentColor', '#3b82f6')
                          updateTheme('fontFamily', 'Roboto')
                          updateTheme('borderRadius', '0.75rem')
                        }}
                        className="p-3 border rounded-lg hover:border-blue-500 transition-colors text-center"
                      >
                        <div className="text-sm font-medium">Depo Yeşil</div>
                      </button>
                      <button
                        onClick={() => {
                          updateTheme('primaryColor', '#374151')
                          updateTheme('secondaryColor', '#6b7280')
                          updateTheme('accentColor', '#059669')
                          updateTheme('fontFamily', 'Open Sans')
                          updateTheme('borderRadius', '0.25rem')
                        }}
                        className="p-3 border rounded-lg hover:border-blue-500 transition-colors text-center"
                      >
                        <div className="text-sm font-medium">Endüstriyel</div>
                      </button>
                      <button
                        onClick={() => {
                          updateTheme('primaryColor', '#ea580c')
                          updateTheme('secondaryColor', '#f59e0b')
                          updateTheme('accentColor', '#dc2626')
                          updateTheme('fontFamily', 'Poppins')
                          updateTheme('borderRadius', '0.5rem')
                        }}
                        className="p-3 border rounded-lg hover:border-blue-500 transition-colors text-center"
                      >
                        <div className="text-sm font-medium">Operasyon</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <Button
                  onClick={resetTheme}
                  variant="outline"
                  className="w-full"
                >
                  Varsayılana Sıfırla
                </Button>
                <Button
                  onClick={() => {
                    // Save theme to localStorage
                    localStorage.setItem('customTheme', JSON.stringify(theme))
                    alert('Tema kaydedildi!')
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Temayı Kaydet
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-25 z-30"
          />
        )}
      </AnimatePresence>
    </>
  )
}
