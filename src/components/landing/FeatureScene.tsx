
import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Text, 
  Line, 
  OrbitControls,
  Stars,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Enhanced GraphNode component with better visuals
const GraphNode = ({ position = [0, 0, 0], color = "#9333EA", size = 0.3, connectTo = [], pulseSpeed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Add gentle rotation to nodes
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.2;
    }
    
    // Add pulsing effect to the glow
    if (glowRef.current && glowRef.current.material instanceof THREE.Material) {
      const pulse = Math.sin(time * pulseSpeed) * 0.1 + 0.9;
      glowRef.current.scale.set(pulse, pulse, pulse);
      glowRef.current.material.opacity = 0.6 + Math.sin(time * pulseSpeed) * 0.2;
    }
  });

  // Create THREE.Color objects for the Line component
  const colorObject = useMemo(() => new THREE.Color(color), [color]);
  const targetColor = useMemo(() => new THREE.Color("#4F46E5"), []);

  return (
    <>
      {/* Connection lines to other nodes */}
      {connectTo.map((targetPos, index) => (
        <Line 
          key={index}
          points={[position, targetPos]}
          color={color}
          lineWidth={1.5}
          opacity={0.6}
          transparent
          dashed={false}
        />
      ))}
      
      {/* Main sphere node */}
      <mesh ref={meshRef} position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.2} 
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Outer glow effect */}
      <mesh ref={glowRef} position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[size * 1.4, 24, 24]} />
        <meshBasicMaterial 
          color={color} 
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

// Interactive data points that float above the chart
const DataPoint = ({ position, size = 0.1, color = "#4F46E5" }) => {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y += Math.sin(time * 2) * 0.0005;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.5}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Enhanced data visualization chart with depth and animation
const DataChart = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  // Create a simple chart texture programmatically
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;  // Reduced size
    canvas.height = 128; // Reduced size
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a gradient background for our chart
      const gradient = ctx.createLinearGradient(0, 0, 0, 128);
      gradient.addColorStop(0, '#4444FF');
      gradient.addColorStop(0.5, '#4488FF');
      gradient.addColorStop(1, '#44FFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 128);
      
      // Draw some chart-like lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Draw a line chart pattern
      let lastY = 90;
      for (let x = 0; x < 256; x += 10) {
        const y = 60 + Math.sin(x * 0.05) * 30 + Math.random() * 15;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        lastY = y;
      }
      ctx.stroke();
      
      // Add some grid lines - fewer than before
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      for (let y = 0; y < 128; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 128);
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
  
  // Generate fewer random data points
  const dataPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 8; i++) {  // Reduced from 15
      points.push({
        position: [
          (Math.random() * 3.5 - 1.75) * 0.8,
          (Math.random() * 0.5) + 0.2,
          (Math.random() * 0.5) - 0.25
        ],
        color: [
          "#4F46E5",
          "#8B5CF6", 
          "#A855F7",
          "#3B82F6"
        ][Math.floor(Math.random() * 4)],
        size: 0.03 + Math.random() * 0.04
      });
    }
    return points;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.03;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={new THREE.Vector3(...position)} 
      rotation={new THREE.Euler(...rotation)} 
      scale={scale}
    >
      {/* Background card with depth */}
      <mesh position={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[4.2, 2.4, 0.1]} />
        <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Chart using our generated gradient texture */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 2.25]} />
        <meshBasicMaterial map={gradientTexture} transparent opacity={0.95} />
      </mesh>
      
      {/* Data points floating above the chart */}
      {dataPoints.map((point, index) => (
        <DataPoint 
          key={index} 
          position={point.position as [number, number, number]} 
          color={point.color}
          size={point.size}
        />
      ))}
      
      {/* Title with better typography */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
        letterSpacing={-0.05}
        material-toneMapped={false}
      >
        Trading Analytics
      </Text>
      
      {/* Decorative elements */}
      <mesh position={[1.8, 1.4, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[-1.8, 1.4, 0.05]} rotation={[0, 0, Math.PI / 6]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Simplified 3D network graph with fewer nodes and connections
const NetworkGraph = () => {
  // Reduced number of nodes
  const nodes = useMemo(() => [
    { position: [-2.2, 0.3, 0], color: "#4F46E5", connections: [[0, 1.5, 0], [2, -1, 0]], size: 0.18, pulseSpeed: 0.7 },
    { position: [2.2, 0.5, 0], color: "#3B82F6", connections: [[0, 1.5, 0], [-1, -2, 1]], size: 0.2, pulseSpeed: 0.9 },
    { position: [0, 1.8, 0], color: "#9333EA", connections: [[-1, -2, 1], [1.5, -1, -1]], size: 0.22, pulseSpeed: 1.2 },
    { position: [-1.5, -1.7, 1], color: "#8B5CF6", connections: [[1.5, -1, -1]], size: 0.17, pulseSpeed: 0.8 },
    { position: [1.8, -1.2, -0.5], color: "#6366F1", connections: [[2.2, 0.5, 0]], size: 0.19, pulseSpeed: 1.0 },
  ], []);

  return (
    <group>
      {nodes.map((node, index) => (
        <Float
          key={index}
          speed={1 + index * 0.2}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <GraphNode 
            position={node.position as [number, number, number]} 
            color={node.color} 
            connectTo={node.connections.map(conn => conn as [number, number, number])}
            size={node.size}
            pulseSpeed={node.pulseSpeed}
          />
        </Float>
      ))}
      
      <DataChart 
        position={[0, -0.3, -1]} 
        rotation={[-0.1, 0, 0]} 
        scale={0.9} 
      />
    </group>
  );
};

// Fallback component to show while scene is loading
const LoadingFallback = () => (
  <Html center>
    <div className="text-white bg-background/80 p-4 rounded-md text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-2"></div>
      <p>Loading 3D Scene...</p>
    </div>
  </Html>
);

// Main scene component with enhanced atmosphere and error handling
const FeatureScene = () => {
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering Canvas
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full absolute top-0 left-0 -z-0 flex items-center justify-center">
        <div className="text-white bg-background/80 p-4 rounded-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-2"></div>
          <p>Initializing 3D Scene...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full absolute top-0 left-0 -z-0">
      <Canvas 
        dpr={[1, 1.2]} // Reduced DPR for better performance
        className="bg-gradient-to-br from-background/90 to-card/50"
        gl={{ 
          powerPreference: "high-performance",
          antialias: false, // Disable antialiasing for better performance
          alpha: true
        }}
        performance={{ min: 0.5 }} // Allow performance scaling
      >
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.2} color="#8B5CF6" />
          
          <NetworkGraph />
          
          {/* Reduced star count and complexity */}
          <Stars radius={100} depth={40} count={200} factor={3} saturation={0.5} fade speed={0.5} />
          
          <fog attach="fog" args={["#000", 8, 15]} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.2}
            autoRotate
            autoRotateSpeed={0.2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FeatureScene;
