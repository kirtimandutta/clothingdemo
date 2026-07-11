import { Center, Environment, Float, Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Box3, DoubleSide, SRGBColorSpace, Vector3 } from 'three'

const MODEL_PATH = '/leather_clothes.glb'
const MODEL_TARGET_SIZE = 2.4

function Loader() {
  return (
    <Html center>
      <div className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-zinc-200">
        Loading collection...
      </div>
    </Html>
  )
}

function BackgroundPlane() {
  const texture = useTexture('/redbackground.jpg')
  const { size, viewport } = useThree()

  useEffect(() => {
    if (!texture?.image) {
      return
    }

    texture.colorSpace = SRGBColorSpace

    const imageAspect = texture.image.width / texture.image.height
    const planeAspect = viewport.width / viewport.height

    if (planeAspect > imageAspect) {
      texture.repeat.set(imageAspect / planeAspect, 1)
      texture.offset.set((1 - texture.repeat.x) / 2, 0)
    } else {
      texture.repeat.set(1, planeAspect / imageAspect)
      texture.offset.set(0, (1 - texture.repeat.y) / 2)
    }

    texture.needsUpdate = true
  }, [texture, size, viewport])

  const coverScale = useMemo(() => {
    if (!texture?.image) {
      return [viewport.width / 2, viewport.height / 2, 1]
    }

    const canvasAspect = viewport.width / viewport.height
    const imageAspect = texture.image.width / texture.image.height

    if (canvasAspect > imageAspect) {
      return [viewport.width / 2, viewport.width / imageAspect / 2, 1]
    }

    return [viewport.height * imageAspect / 2, viewport.height / 2, 1]
  }, [texture, viewport])

  return (
    <mesh position={[0, 0, -1]} scale={coverScale} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.4}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function LeatherModel() {
  const { scene } = useGLTF(MODEL_PATH)

  const clonedScene = useMemo(() => {
    if (!scene) {
      return null
    }

    const cloned = scene.clone(true)
    const box = new Box3().setFromObject(cloned)

    if (!box.isEmpty()) {
      const size = new Vector3()
      const center = new Vector3()
      box.getSize(size)
      box.getCenter(center)
      cloned.position.sub(center)

      const maxAxis = Math.max(size.x, size.y, size.z) || 1
      cloned.scale.setScalar(MODEL_TARGET_SIZE / maxAxis)
    }

    return cloned
  }, [scene])

  useEffect(() => {
    if (!clonedScene) {
      return
    }

    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        node.frustumCulled = false
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material].filter(Boolean)
        materials.forEach((material) => {
          if ('roughness' in material) {
            material.roughness = 0.48
          }
          if ('metalness' in material) {
            material.metalness = 0.22
          }
          if ('envMapIntensity' in material) {
            material.envMapIntensity = 1.35
          }
          if ('side' in material) {
            material.side = DoubleSide
          }
          material.needsUpdate = true
        })
      }
    })
  }, [clonedScene])

  if (!clonedScene) {
    return <Loader />
  }

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  )
}

useGLTF.preload(MODEL_PATH)
useTexture.preload('/redbackground.jpg')

export default function WardrobeScene({ onModelResolved }) {
  const animatedGroupRef = useRef(null)

  useEffect(() => {
    onModelResolved(animatedGroupRef.current)
    return () => onModelResolved(null)
  }, [onModelResolved])

  return (
    <>
      <BackgroundPlane />
      <Environment preset="studio" />
      <ambientLight intensity={0.32} />
      <spotLight
        position={[3.5, 6, 4.5]}
        angle={0.34}
        penumbra={0.5}
        intensity={58}
        castShadow
        color="#f8f7f2"
      />
      <pointLight position={[-2, 1.5, -1]} intensity={7} color="#7f8594" />
      <group ref={animatedGroupRef}>
        <Suspense fallback={<Loader />}>
          <Float
            speed={1.25}
            rotationIntensity={0.22}
            floatIntensity={0.4}
            floatingRange={[-0.18, 0.2]}
          >
            <LeatherModel />
          </Float>
        </Suspense>
      </group>
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={0.3} radius={0.8} />
      </EffectComposer>
    </>
  )
}

export { Loader }
