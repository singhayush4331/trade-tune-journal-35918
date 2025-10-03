
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

// Simplified FloatingCard component with reduced geometry complexity
const FloatingCard = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = "#9333EA" }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useEffect(() => {
    // Pre-calculate rotation to avoid per-frame calculations
    if (meshRef.current) {
      meshRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, []);
  
  // Simplified animation with fewer calculations per frame
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.07 + rotation[0];
      meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.07 + rotation[1];
    }
  });

  return (
    <mesh ref={meshRef} position={new THREE.Vector3(...position)} scale={scale}>
      <boxGeometry args={[1, 0.6, 0.03]} /> {/* Reduced depth for better performance */}
      <meshStandardMaterial 
        color={color} 
        metalness={0.5} 
        roughness={0.3} 
        emissive={color}
        emissiveIntensity={0.1}
        toneMapped={true}
      />
    </mesh>
  );
};

// Optimized component that only loads when visible
const FloatingChart = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef<THREE.Group>(null!);
  // Preloaded texture with lower resolution
  const chartTexture = useTexture('/lovable-uploads/cd0c7104-628a-41b5-86e5-f28f244ceaf2.png');
  
  useEffect(() => {
    // Pre-set initial rotation
    if (meshRef.current) {
      meshRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.03 + rotation[0];
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.03 + rotation[1];
    }
  });

  return (
    <group ref={meshRef} position={new THREE.Vector3(...position)} scale={scale}>
      <mesh>
        <planeGeometry args={[2, 1.2]} />
        <meshBasicMaterial map={chartTexture} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const AnimatedText = ({ position = [0, 0, 0], text, color = "#ffffff" }) => {
  const textRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.getElapsedTime();
      // Less frequent updates for text animation
      textRef.current.position.y = position[1] + Math.sin(time * 0.7) * 0.04;
    }
  });

  return (
    <Text
      ref={textRef}
      position={new THREE.Vector3(...position)}
      fontSize={0.15}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

// Lazy-loaded scene content to improve initial render performance
const SceneContent = () => {
  const isMobile = useIsMobile();
  
  // Reduced number of elements for mobile
  const elements = isMobile ? 
    // Mobile - fewer elements
    [
      {
        type: 'card',
        position: [-1.2, 0.6, -0.5],
        rotation: [-0.2, 0.5, 0],
        scale: 0.6,
        color: "#4F46E5",
        floatSpeed: 1.5,
        floatIntensity: 0.8
      },
      {
        type: 'chart',
        position: [0, 0, 0.5],
        rotation: [-0.1, 0, 0],
        scale: 0.8,
        floatSpeed: 1.5,
        floatIntensity: 0.6
      },
      {
        type: 'text',
        position: [-1.2, 1.0, 0],
        text: "Analytics",
        color: "#9333EA",
        floatSpeed: 1.8,
        floatIntensity: 0.8
      },
      {
        type: 'text',
        position: [0, -0.8, 0],
        text: "Trading Journal",
        color: "#8B5CF6",
        floatSpeed: 1.5,
        floatIntensity: 0.7
      }
    ] :
    // Desktop - more elements
    [
      {
        type: 'card',
        position: [-1.5, 0.8, -0.5],
        rotation: [-0.2, 0.5, 0],
        scale: 0.7,
        color: "#4F46E5",
        floatSpeed: 1.5,
        floatIntensity: 1
      },
      {
        type: 'card',
        position: [1.5, 0.4, 0],
        rotation: [0.1, -0.3, 0],
        scale: 0.6,
        color: "#3B82F6",
        floatSpeed: 1.8,
        floatIntensity: 1
      },
      {
        type: 'chart',
        position: [0, 0, 1],
        rotation: [-0.1, 0, 0],
        scale: 1,
        floatSpeed: 1.5,
        floatIntensity: 0.7
      },
      {
        type: 'text',
        position: [-1.5, 1.2, 0],
        text: "Analytics",
        color: "#9333EA",
        floatSpeed: 1.8,
        floatIntensity: 0.8
      },
      {
        type: 'text',
        position: [1.5, -0.2, 0],
        text: "AI Powered",
        color: "#6366F1",
        floatSpeed: 1.3,
        floatIntensity: 0.6
      },
      {
        type: 'text',
        position: [0, -1, 0],
        text: "Trading Journal",
        color: "#8B5CF6",
        floatSpeed: 1.5,
        floatIntensity: 0.7
      }
    ];

  return (
    <group>
      {elements.map((elem, index) => (
        <Float
          key={index}
          speed={elem.floatSpeed * 0.8} // Reduced float speed
          rotationIntensity={0.4} // Less rotation intensity
          floatIntensity={elem.floatIntensity * 0.8} // Less float intensity
        >
          {elem.type === 'card' && (
            <FloatingCard 
              position={elem.position} 
              rotation={elem.rotation} 
              scale={elem.scale} 
              color={elem.color} 
            />
          )}
          {elem.type === 'chart' && (
            <FloatingChart 
              position={elem.position} 
              rotation={elem.rotation} 
              scale={elem.scale} 
            />
          )}
          {elem.type === 'text' && (
            <AnimatedText 
              position={elem.position} 
              text={elem.text} 
              color={elem.color} 
            />
          )}
        </Float>
      ))}
    </group>
  );
};

// Import useFrame function
import { useFrame } from '@react-three/fiber';

// Fallback loading component
const LoadingScene = () => {
  return <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshStandardMaterial color="#4F46E5" />
  </mesh>;
};

// Lazy-loading wrapper for the scene
const HeroScene = () => {
  // State to control whether to render the 3D scene
  const [shouldRender, setShouldRender] = useState(false);
  const isMobile = useIsMobile();
  
  // Wait for the page to load before rendering the 3D scene
  useEffect(() => {
    // Wait for initial load to complete
    if (document.readyState === 'complete') {
      // Delay scene rendering slightly
      setTimeout(() => setShouldRender(true), 100);
    } else {
      // Wait for page to load
      window.addEventListener('load', () => {
        setTimeout(() => setShouldRender(true), 100);
      });
    }
    
    return () => {
      window.removeEventListener('load', () => setShouldRender(true));
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {shouldRender && (
        <Canvas dpr={[1, isMobile ? 1.5 : 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <Suspense fallback={<LoadingScene />}>
            <SceneContent />
          </Suspense>
          {/* Reduced fog distance */}
          <fog attach="fog" args={["#000", 10, 15]} />
        </Canvas>
      )}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
};

export default HeroScene;
