'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      if (formData.email && formData.password) {
        window.location.href = '/dashboard'
      } else {
        setError('Geçersiz email veya şifre')
      }
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anasayfaya Dön
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 glass bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative shadow-xl"
            >
              <Package className="h-12 w-12 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Giriş Yap
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Hesabınıza giriş yaparak sisteme erişim sağlayın
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                  E-posta Adresi
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ornek@email.com"
                  required
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 backdrop-blur-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-3">
                  Şifre
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-300 text-sm bg-red-500/20 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Giriş yapılıyor...
                    </div>
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/20 backdrop-blur-sm">
              <h4 className="text-sm font-medium text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Demo Hesapları
              </h4>
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div 
                  className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" 
                  onClick={() => setFormData({email: 'admin@ayazlojistik.com', password: '123456'})}
                >
                  <span className="text-white/90 font-medium">Admin</span>
                  <span className="text-white/60">admin@ayazlojistik.com</span>
                </div>
                <div 
                  className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" 
                  onClick={() => setFormData({email: 'ops@ayazlojistik.com', password: '123456'})}
                >
                  <span className="text-white/90 font-medium">Operasyon</span>
                  <span className="text-white/60">ops@ayazlojistik.com</span>
                </div>
                <div 
                  className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" 
                  onClick={() => setFormData({email: 'warehouse@ayazlojistik.com', password: '123456'})}
                >
                  <span className="text-white/90 font-medium">Depo</span>
                  <span className="text-white/60">warehouse@ayazlojistik.com</span>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-3 text-center">Hesaplara tıklayarak otomatik doldur</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}