import { Environment, Float, Html } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Loader() {
  return (
    <Html center>
      <div className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-zinc-200">
        Loading collection...
      </div>
    </Html>
  )
}

function ModelLoadError({ attemptedPaths }) {
  return (
    <Html center>
      <div className="max-w-md rounded-xl border border-red-400/40 bg-black/80 p-4 text-left text-xs text-zinc-200">
        <p className="mb-2 font-semibold uppercase tracking-[0.2em] text-red-300">Model not found</p>
        <p className="mb-2">Place your GLB in `public` with one of these names:</p>
        <ul className="space-y-1 text-zinc-300">
          {attemptedPaths.map((path) => (
            <li key={path}>{path}</li>
          ))}
        </ul>
      </div>
    </Html>
  )
}

function LeatherModel() {
  const attemptedPaths = ['/leather_clothes.glb', '/Clothes_6.glb', '/clothes_6.glb']
  const [loadedScene, setLoadedScene] = useState(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const clonedScene = useMemo(() => {
    if (!loadedScene) {
      return null
    }

    const cloned = loadedScene.clone(true)
    const box = new Box3().setFromObject(cloned)

    if (!box.isEmpty()) {
      const size = new Vector3()
      const center = new Vector3()
      box.getSize(size)
      box.getCenter(center)
      cloned.position.sub(center)

      const maxAxis = Math.max(size.x, size.y, size.z) || 1
      const targetSize = 2.4
      const normalizedScale = targetSize / maxAxis
      cloned.scale.setScalar(normalizedScale)
    }

    return cloned
  }, [loadedScene])

  useEffect(() => {
    let isMounted = true
    const loader = new GLTFLoader()

    const tryLoad = (index) => {
      if (index >= attemptedPaths.length) {
        if (isMounted) {
          setLoadFailed(true)
        }
        return
      }

      loader.load(
        attemptedPaths[index],
        (gltf) => {
          if (isMounted) {
            setLoadedScene(gltf.scene)
            setLoadFailed(false)
          }
        },
        undefined,
        () => tryLoad(index + 1),
      )
    }

    tryLoad(0)

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!clonedScene) {
      return
    }

    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
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
          material.needsUpdate = true
        })
      }
    })

  }, [clonedScene])

  if (loadFailed) {
    return (
      <>
        <ModelLoadError attemptedPaths={attemptedPaths} />
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[1.3, 1.8, 0.6]} />
          <meshStandardMaterial color="#a58a68" roughness={0.55} metalness={0.2} />
        </mesh>
      </>
    )
  }

  if (!clonedScene) {
    return <Loader />
  }

  return (
    <group position={[0, -0.55, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}

export default function WardrobeScene({ onModelResolved }) {
  const animatedGroupRef = useRef(null)

  useEffect(() => {
    onModelResolved(animatedGroupRef.current)
    return () => onModelResolved(null)
  }, [onModelResolved])

  return (
    <>
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
        <Float
          speed={1.25}
          rotationIntensity={0.22}
          floatIntensity={0.4}
          floatingRange={[-0.18, 0.2]}
        >
          <LeatherModel />
        </Float>
      </group>
    </>
  )
}

export { Loader }
