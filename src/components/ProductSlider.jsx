import { ChevronLeft, ChevronRight, Eye, ShoppingBag, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const PRODUCTS = [
  {
    id: 1,
    name: 'Cashmere Wrap Coat',
    category: 'Outerwear',
    price: 74900,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80',
    description: 'Double-faced cashmere with a relaxed wrap silhouette and hidden tie closure.',
  },
  {
    id: 2,
    name: 'Silk Slip Dress',
    category: 'Dresses',
    price: 52900,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80',
    description: 'Bias-cut silk with a fluid drape and adjustable spaghetti straps.',
  },
  {
    id: 3,
    name: 'Tailored Blazer',
    category: 'Tailoring',
    price: 45900,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop&q=80',
    description: 'Structured shoulders and a nipped waist for a sharp, architectural line.',
  },
  {
    id: 4,
    name: 'Pleated Midi Skirt',
    category: 'Skirts',
    price: 31900,
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop&q=80',
    description: 'Fine accordion pleats in a mid-weight crepe with a clean A-line fall.',
  },
  {
    id: 5,
    name: 'Leather Mini Dress',
    category: 'Dresses',
    price: 58900,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop&q=80',
    description: 'Supple lambskin with minimal seaming and a sculpted body-conscious fit.',
  },
  {
    id: 6,
    name: 'Cropped Knit Top',
    category: 'Knitwear',
    price: 24900,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=80',
    description: 'Merino rib knit with a cropped hem and raw-edge neckline detail.',
  },
  {
    id: 7,
    name: 'Structured Trench',
    category: 'Outerwear',
    price: 79900,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128f2?w=600&h=800&fit=crop&q=80',
    description: 'Water-resistant cotton gabardine with storm flap and belted waist.',
  },
  {
    id: 8,
    name: 'Evening Column Gown',
    category: 'Evening',
    price: 102900,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop&q=80',
    description: 'Floor-length column silhouette in matte satin with a low back cut.',
  },
]

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

function ProductSlider() {
  const scrollRef = useRef(null)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [cartNotice, setCartNotice] = useState(null)

  const scroll = (direction) => {
    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector('[data-product-card]')
    const gap = 24
    const scrollAmount = card ? card.offsetWidth + gap : container.clientWidth * 0.75

    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })

    setCartNotice(product.name)
    window.setTimeout(() => setCartNotice(null), 2400)
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  useEffect(() => {
    if (!quickViewProduct) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setQuickViewProduct(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [quickViewProduct])

  return (
    <>
      <section id="collection" className="border-t border-white/10 pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.38em] text-zinc-500">04 / Collection</p>
              <h2 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
                Featured Pieces
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                Curated silhouettes from the latest drop — scroll to explore each look.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {cartCount > 0 && (
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                  Bag · {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  aria-label="Previous products"
                  className="rounded-full border border-white/15 p-3 text-zinc-300 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  aria-label="Next products"
                  className="rounded-full border border-white/15 p-3 text-zinc-300 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent" />

            <div
              ref={scrollRef}
              className="product-slider flex gap-6 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {PRODUCTS.map((product) => (
                <article
                  key={product.id}
                  data-product-card
                  className="group w-[72vw] shrink-0 sm:w-[280px] md:w-[300px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition duration-300 group-hover:border-white/20">
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/50 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                        >
                          <Eye size={13} />
                          Quick View
                        </button>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black transition hover:bg-zinc-200"
                        >
                          <ShoppingBag size={13} />
                          Add to Bag
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 p-5">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                        {product.category}
                      </p>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-medium leading-snug text-white">{product.name}</h3>
                        <p className="shrink-0 text-sm tabular-nums text-zinc-300">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setQuickViewProduct(null)}
          role="presentation"
        >
          <div
            className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${quickViewProduct.name}`}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/15 p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="aspect-[3/4] bg-zinc-900 md:aspect-auto">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center space-y-5 p-8">
              <p className="text-xs uppercase tracking-[0.38em] text-zinc-500">
                {quickViewProduct.category}
              </p>
              <h3 className="text-2xl font-medium text-white">{quickViewProduct.name}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{quickViewProduct.description}</p>
              <p className="text-xl tabular-nums text-white">{formatPrice(quickViewProduct.price)}</p>
              <button
                type="button"
                onClick={() => {
                  addToCart(quickViewProduct)
                  setQuickViewProduct(null)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-black transition hover:bg-zinc-200"
              >
                <ShoppingBag size={15} />
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {cartNotice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-zinc-950/95 px-5 py-3 text-xs uppercase tracking-[0.2em] text-zinc-200 shadow-lg backdrop-blur-md">
          Added · {cartNotice}
        </div>
      )}
    </>
  )
}

export default ProductSlider
