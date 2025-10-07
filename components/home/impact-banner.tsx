'use client';

import { useState, useEffect } from 'react';

// Datos de ejemplo para los productos
const sustainableProducts = [
  {
    id: 1,
    name: "Kit de Cultivo en Casa",
    description: "Cultiva tus propias hierbas y vegetales con este kit ecológico.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 15,
    badge: "Oferta",
    icon: "🌱",
    color: "from-green-700/30 to-emerald-800/30"
  },
  {
    id: 2,
    name: "Botella Reutilizable",
    description: "Hecha con materiales 100% reciclados y libre de BPA.",
    price: 18.50,
    badge: "Más Vendido",
    icon: "♻️",
    color: "from-blue-700/30 to-cyan-800/30"
  },
  {
    id: 3,
    name: "Camiseta Orgánica",
    description: "Confeccionada con algodón orgánico y tintes naturales.",
    price: 32.00,
    badge: "Nuevo",
    icon: "👕",
    color: "from-emerald-700/30 to-teal-800/30"
  },
  {
    id: 4,
    name: "Bolso de Yute Natural",
    description: "Bolso biodegradable perfecto para tus compras diarias.",
    price: 22.99,
    originalPrice: 27.99,
    discount: 18,
    badge: "Eco",
    icon: "👜",
    color: "from-amber-700/30 to-orange-800/30"
  },
  {
    id: 5,
    name: "Juego de Cubiertos de Bambú",
    description: "Alternativa sostenible a los cubiertos desechables.",
    price: 15.75,
    badge: "Popular",
    icon: "🍴",
    color: "from-lime-700/30 to-green-800/30"
  },
  {
    id: 6,
    name: "Cepillo de Dientes de Bambú",
    description: "Biodegradable y con cerdas naturales.",
    price: 8.99,
    badge: "Esencial",
    icon: "🪥",
    color: "from-teal-700/30 to-cyan-800/30"
  }
];

export default function ImpactBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const productsPerPage = 3;

  // Calcular el número total de slides
  const totalSlides = Math.ceil(sustainableProducts.length / productsPerPage);

  // Obtener productos actuales para mostrar
  const currentProducts = sustainableProducts.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, totalSlides, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="h-auto min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-blue-900 relative overflow-hidden flex items-center py-12">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-green-400/30 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 rounded-full bg-emerald-400/20 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-blue-400/40 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl px-8 py-6 text-center border border-green-500/20 shadow-2xl">
          
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-lg uppercase tracking-wide">
              Productos Sostenibles Destacados
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
              Consumo con
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Propósito
              </span>
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto mt-4">
              Descubre productos que no solo satisfacen tus necesidades, sino que también generan un impacto positivo.
            </p>
          </div>

          {/* Carrusel de Productos */}
          <div className="relative mb-8">
            {/* Controles del carrusel */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/30 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Indicadores */}
              <div className="flex space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-green-400 scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/30 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Productos del carrusel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white/5 rounded-2xl p-5 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 group hover:scale-105"
                >
                  <div className={`relative h-40 bg-gradient-to-br ${product.color} rounded-xl mb-4 flex items-center justify-center overflow-hidden`}>
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{product.icon}</span>
                    </div>
                    <div className={`absolute top-3 right-3 ${
                      product.badge === "Oferta" ? "bg-green-600" :
                      product.badge === "Más Vendido" ? "bg-emerald-600" :
                      product.badge === "Nuevo" ? "bg-blue-600" :
                      product.badge === "Eco" ? "bg-amber-600" :
                      product.badge === "Popular" ? "bg-purple-600" :
                      "bg-teal-600"
                    } text-white text-xs font-bold px-2 py-1 rounded-full`}>
                      {product.badge}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-400 font-bold text-lg">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <span className="text-green-300 text-xs font-bold ml-2">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors group-hover:scale-105">
                      Ver Producto
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Contador de productos */}
            <div className="text-center mt-6">
              <span className="text-gray-300 text-sm">
                Mostrando {currentIndex * productsPerPage + 1}-{Math.min((currentIndex + 1) * productsPerPage, sustainableProducts.length)} de {sustainableProducts.length} productos
              </span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-lg text-white font-semibold">
              <span className="text-green-300">Únete a miles de consumidores conscientes</span> - Tu compra genera Impacto
            </p>
        </div>
       </div>
      </div>
    </section>
  );
}