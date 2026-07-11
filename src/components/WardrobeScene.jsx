import { Center, Environment, Float, Html, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Box3, DoubleSide, Vector3 } from 'three'

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
          material.transparent = false
          material.opacity = 1
          material.depthWrite = true
          if ('transmission' in material) {
            material.transmission = 0
          }
          if ('emissive' in material && material.emissive) {
            material.emissive.setHex(0x000000)
          }
          if ('emissiveIntensity' in material) {
            material.emissiveIntensity = 0
          }
          if ('roughness' in material) {
            material.roughness = 0.62
          }
          if ('metalness' in material) {
            material.metalness = 0.12
          }
          if ('envMapIntensity' in material) {
            material.envMapIntensity = 0.55
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

export default function WardrobeScene({ onModelResolved }) {
  const animatedGroupRef = useRef(null)

  useEffect(() => {
    onModelResolved(animatedGroupRef.current)
    return () => onModelResolved(null)
  }, [onModelResolved])

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Environment preset="studio" environmentIntensity={0.45} />
      <ambientLight intensity={0.18} />
      <spotLight
        position={[3.5, 6, 4.5]}
        angle={0.34}
        penumbra={0.65}
        intensity={12}
        castShadow
        color="#f0eeea"
      />
      <directionalLight position={[-3, 2, 2]} intensity={1.2} color="#c8ccd4" />
      <pointLight position={[-2, 1.5, -1]} intensity={1.5} color="#7f8594" />
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
    </>
  )
}

export { Loader }
