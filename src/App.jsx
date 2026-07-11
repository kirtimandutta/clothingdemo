import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Menu } from 'lucide-react'
import { Component, Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react'
import WardrobeScene, { Loader } from './components/WardrobeScene'

gsap.registerPlugin(ScrollTrigger)

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-center text-zinc-300">
          <p className="max-w-md text-sm leading-relaxed">
            Unable to load <span className="font-semibold text-white">/leather_clothes.glb</span>.
            Add the file and refresh the page.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const [modelRoot, setModelRoot] = useState(null)

  const handleModelResolved = useCallback((resolvedModel) => {
    setModelRoot(resolvedModel)
  }, [])

  useLayoutEffect(() => {
    if (!stageRef.current || !modelRoot) {
      return undefined
    }

    const baseRotationY = Math.PI
    const baseRotationX = modelRoot.rotation.x
    const basePositionX = 0
    const basePositionY = modelRoot.position.y

    modelRoot.rotation.y = baseRotationY
    modelRoot.position.x = basePositionX

    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
        .to(
          modelRoot.rotation,
          {
            y: baseRotationY + Math.PI * 2,
            x: baseRotationX,
            ease: 'none',
          },
          0,
        )
        .to(
          modelRoot.position,
          {
            x: 0.75,
            y: basePositionY,
            ease: 'none',
          },
          0,
        )
    }, stageRef)

    return () => {
      modelRoot.rotation.y = baseRotationY
      modelRoot.rotation.x = baseRotationX
      modelRoot.position.x = basePositionX
      modelRoot.position.y = basePositionY
      context.revert()
    }
  }, [modelRoot])

  return (
    <main ref={rootRef} className="min-h-screen bg-black text-zinc-100">
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.6em] text-zinc-200">ARCHANA</p>
          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-zinc-400 md:flex">
            <a href="#vision" className="transition hover:text-white">Vision</a>
            <a href="#material" className="transition hover:text-white">Material</a>
            <a href="#shop" className="transition hover:text-white">Shop</a>
          </div>
          <button type="button" className="rounded-full border border-white/20 p-2 text-zinc-200 md:hidden">
            <Menu size={16} />
          </button>
        </div>
      </nav>

      <section ref={stageRef} className="relative min-h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <SceneErrorBoundary>
              <Canvas
                camera={{ position: [0, 0.45, 4.1], fov: 34, near: 0.1, far: 100 }}
                shadows
                dpr={[1, 2]}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
              >
                <Suspense fallback={<Loader />}>
                  <WardrobeScene onModelResolved={handleModelResolved} />
                </Suspense>
              </Canvas>
            </SceneErrorBoundary>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />

          <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 pt-20 lg:px-10">
            <header className="max-w-2xl space-y-6">
              <p className="text-xs uppercase tracking-[0.45em] text-zinc-400">Edition 2026</p>
              <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white md:text-7xl">
                THE ARCHANA COLLECTION
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-zinc-300 md:text-lg">
                Sculpted leather silhouettes with architectural lines and deep tonal contrasts.
                Scroll to rotate the model and reveal every edge under studio light.
              </p>
              <button
                type="button"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-black transition hover:bg-zinc-200"
              >
                Shop Now
                <ArrowUpRight size={16} />
              </button>
            </header>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-3 lg:px-10">
        <article id="vision" className="space-y-5 rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs uppercase tracking-[0.38em] text-zinc-500">01 / Vision</p>
          <h2 className="text-2xl font-medium text-white">Quiet Luxury</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            A restrained visual language built around negative space, exact tailoring, and camera-ready
            shadows inspired by high-fashion studio shoots.
          </p>
        </article>
        <article id="material" className="space-y-5 rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs uppercase tracking-[0.38em] text-zinc-500">02 / Material</p>
          <h2 className="text-2xl font-medium text-white">Leather Detail</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Roughness and metalness are tuned for premium leather reflections, giving each fold a subtle
            sheen without looking glossy or synthetic.
          </p>
        </article>
        <article id="shop" className="space-y-5 rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs uppercase tracking-[0.38em] text-zinc-500">03 / Access</p>
          <h2 className="text-2xl font-medium text-white">Curated Drop</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Explore the lookbook in motion, then move directly into purchase flows for each statement piece
            in the latest collection.
          </p>
        </article>
      </section>
    </main>
  )
}

export default App
