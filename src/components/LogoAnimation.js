'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function LogoAnimation({ onAnimComplete, triggerBurstRef }) {
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const gsapCtxRef = useRef(null);

  // Mouse Parallax coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // References to meshes for GSAP animation
  const leftSphereRef = useRef(null);
  const centerSphereRef = useRef(null);
  const rightSphereRef = useRef(null);

  const flashRef = useRef(null);
  const shockRing1Ref = useRef(null);
  const shockRing2Ref = useRef(null);
  const shockMat1Ref = useRef(null);
  const shockMat2Ref = useRef(null);

  // Curves & Particles
  const curvesRef = useRef([]);
  const pulseParticlesRef = useRef([]);
  const burstParticlesRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // --- 1. Custom Textures (Canvas 2D) ---
    // Particle Spark Texture
    const createSparkTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Lens Flare Flash Texture
    const createFlashTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.1, '#ffffff');
      grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.55, 'rgba(31, 255, 122, 0.25)'); // Cyan/Green halo
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const sparkTex = createSparkTexture();
    const flashTex = createFlashTexture();

    // --- 2. Three.js Setup ---
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 240;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Premium cinematic tone mapping configuration
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 3. Cinematic Multi-Lighting Setup (For physical glass shaders) ---
    // A. Ambient Light for base transmissive visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // B. High-intensity Key Directional Light (top-left) for sharp, premium highlights
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(80, 120, 100);
    scene.add(keyLight);

    // C. Fill Directional Light (bottom-right) for soft rim contours
    const fillLight = new THREE.DirectionalLight(0x7eb0ff, 1.6);
    fillLight.position.set(-80, -120, -50);
    scene.add(fillLight);

    // D. Soft Point Light near the origin to illuminate the intersections
    const pointLight = new THREE.PointLight(0xffffff, 2.5, 300);
    pointLight.position.set(0, 0, 40);
    scene.add(pointLight);

    // --- 4. Creating 3D Physical Glass Spheres ---
    const sphereScale = 95;
    const sphereGeom = new THREE.SphereGeometry(0.5, 64, 64);

    // Left glass sphere: BLUE (representing R in color swap brand rules)
    const leftMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f6fff,
      emissive: 0x05163b,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.82,
      thickness: 2.0,
      ior: 1.52,
      transparent: true,
      opacity: 0.95
    });
    const leftSphere = new THREE.Mesh(sphereGeom, leftMat);
    leftSphere.scale.set(0.001, 0.001, 0.001);
    scene.add(leftSphere);
    leftSphereRef.current = leftSphere;

    // Center glass sphere: GREEN (representing G)
    const centerMat = new THREE.MeshPhysicalMaterial({
      color: 0x1fff7a,
      emissive: 0x053b16,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.82,
      thickness: 2.0,
      ior: 1.52,
      transparent: true,
      opacity: 0.95
    });
    const centerSphere = new THREE.Mesh(sphereGeom, centerMat);
    centerSphere.scale.set(0.001, 0.001, 0.001);
    scene.add(centerSphere);
    centerSphereRef.current = centerSphere;

    // Right glass sphere: RED (representing B in color swap brand rules)
    const rightMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2d1f,
      emissive: 0x3b0505,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.82,
      thickness: 2.0,
      ior: 1.52,
      transparent: true,
      opacity: 0.95
    });
    const rightSphere = new THREE.Mesh(sphereGeom, rightMat);
    rightSphere.scale.set(0.001, 0.001, 0.001);
    scene.add(rightSphere);
    rightSphereRef.current = rightSphere;

    // Central Flash Sprite
    const flashMat = new THREE.SpriteMaterial({ map: flashTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0 });
    const flash = new THREE.Sprite(flashMat);
    flash.scale.set(1, 1, 1);
    scene.add(flash);
    flashRef.current = flash;

    // Concentric Shockwave Rings
    const ringGeom = new THREE.RingGeometry(0.1, 60, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ringMesh1 = new THREE.Mesh(ringGeom, ringMat1);
    scene.add(ringMesh1);
    shockRing1Ref.current = ringMesh1;
    shockMat1Ref.current = ringMat1;

    const ringMesh2 = new THREE.Mesh(ringGeom, ringMat1); // reuse geometry
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x1fff7a, // Cyan-Green halo
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ringMesh2Instance = new THREE.Mesh(ringGeom, ringMat2);
    scene.add(ringMesh2Instance);
    shockRing2Ref.current = ringMesh2Instance;
    shockMat2Ref.current = ringMat2;

    // --- 5. Holographic Scope Parade Setup ---
    const lineColors = [0x1f6fff, 0x1fff7a, 0xff2d1f]; // Blue (left), Green (center), Red (right)
    const curvePoints = 120;
    
    for (let c = 0; c < 3; c++) {
      const subLines = [];
      const subOffsets = [-14, 0, 14];
      const ampMults = [0.72, 1.0, 0.72];
      const opacityMults = [0.4, 0.75, 0.4];

      for (let s = 0; s < 3; s++) {
        const positions = new Float32Array(curvePoints * 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
          color: lineColors[c],
          transparent: true,
          opacity: 0,
          linewidth: s === 1 ? 2.5 : 1.0,
          blending: THREE.AdditiveBlending
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        subLines.push({ 
          line, 
          xOffset: subOffsets[s], 
          ampMult: ampMults[s], 
          opacityMult: opacityMults[s] 
        });
      }
      
      curvesRef.current.push({ subLines, colorIdx: c });

      // Flowing Pulse Particles along the main line (s = 1)
      const pCount = 12;
      const pPositions = new Float32Array(pCount * 3);
      const pGeometry = new THREE.BufferGeometry();
      pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      
      const pMat = new THREE.PointsMaterial({
        color: lineColors[c],
        size: 7.0,
        transparent: true,
        opacity: 0,
        map: sparkTex,
        blending: THREE.AdditiveBlending
      });
      
      const pts = new THREE.Points(pGeometry, pMat);
      scene.add(pts);
      pulseParticlesRef.current.push({
        points: pts,
        offsets: Array.from({ length: pCount }, (_, i) => i / pCount)
      });
    }

    // --- 6. Collision Spark Particles Setup ---
    const burstCount = 320;
    const burstGeom = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVel = new Float32Array(burstCount * 3);
    const burstCol = new Float32Array(burstCount * 3);

    const colorsPalette = [
      new THREE.Color('#1f6fff'), // Blue
      new THREE.Color('#1fff7a'), // Green
      new THREE.Color('#xff2d1f')  // Red
    ];

    for (let i = 0; i < burstCount; i++) {
      burstPos[i * 3] = 0;
      burstPos[i * 3 + 1] = 0;
      burstPos[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = 3.5 + Math.random() * 6.0;

      burstVel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      burstVel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      burstVel[i * 3 + 2] = Math.cos(phi) * speed;

      const col = colorsPalette[i % 3];
      burstCol[i * 3] = col.r;
      burstCol[i * 3 + 1] = col.g;
      burstCol[i * 3 + 2] = col.b;
    }

    burstGeom.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    burstGeom.setAttribute('color', new THREE.BufferAttribute(burstCol, 3));

    const burstMat = new THREE.PointsMaterial({
      size: 5.5,
      map: sparkTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    const burstParticles = new THREE.Points(burstGeom, burstMat);
    scene.add(burstParticles);
    burstParticlesRef.current = burstParticles;

    // --- 7. Mouse Move Parallax Handler ---
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.12;
      mouseRef.current.targetY = -(e.clientY - window.innerHeight / 2) * 0.12;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 8. Rendering Loop ---
    let time = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      time = clock.getElapsedTime();
      requestRef.current = requestAnimationFrame(tick);

      // Lerp camera parallax coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      
      camera.position.x = mouseRef.current.x;
      camera.position.y = mouseRef.current.y;
      camera.lookAt(0, 0, 0);

      // A. Animate Oscilloscope Waveforms
      curvesRef.current.forEach((curveObj, cIdx) => {
        const freq = 0.016;
        const speedFactor = 2.4;
        const phaseOffset = time * speedFactor + cIdx * (Math.PI * 2 / 3);

        curveObj.subLines.forEach((subObj) => {
          const line = subObj.line;
          const posAttr = line.geometry.attributes.position;
          const positions = posAttr.array;
          const amplitude = (gsap.getProperty(line.material, 'amplitude') ?? 0) * subObj.ampMult;

          for (let i = 0; i < curvePoints; i++) {
            const x = (i - curvePoints / 2) * 8.0 + subObj.xOffset;
            const angle = (x - subObj.xOffset) * freq + phaseOffset;
            const jitter = Math.sin(x * 0.5 + time * 18) * (amplitude * 0.03);
            const y = Math.sin(angle) * amplitude + Math.cos(x * 0.008 - time * 0.4) * (amplitude * 0.35) + jitter;
            const z = Math.cos(angle * 0.8) * 15 - 40;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
          }
          posAttr.needsUpdate = true;
        });

        // B. Animate flow particles along the main line (s = 1 subline)
        const pulseObj = pulseParticlesRef.current[cIdx];
        const pPositions = pulseObj.points.geometry.attributes.position.array;
        const mainSubLine = curveObj.subLines[1];
        const amplitude = gsap.getProperty(mainSubLine.line.material, 'amplitude') ?? 0;
        
        pulseObj.offsets.forEach((offset, pIdx) => {
          pulseObj.offsets[pIdx] = (offset + 0.004) % 1.0;
          const currOffset = pulseObj.offsets[pIdx];
          
          const x = (currOffset - 0.5) * curvePoints * 8.0;
          const angle = x * freq + phaseOffset;
          const y = Math.sin(angle) * amplitude + Math.cos(x * 0.008 - time * 0.4) * (amplitude * 0.35);
          const z = Math.cos(angle * 0.8) * 15 - 40;

          pPositions[pIdx * 3] = x;
          pPositions[pIdx * 3 + 1] = y;
          pPositions[pIdx * 3 + 2] = z;
        });
        pulseObj.points.geometry.attributes.position.needsUpdate = true;
      });

      // C. Move burst particles with drag deceleration
      const burstObj = burstParticlesRef.current;
      if (burstObj && burstObj.material.opacity > 0.01) {
        const positions = burstObj.geometry.attributes.position.array;
        const posAttr = burstObj.geometry.attributes.position;
        const decay = 0.985;
        
        for (let i = 0; i < burstCount; i++) {
          positions[i * 3] += burstVel[i * 3];
          positions[i * 3 + 1] += burstVel[i * 3 + 1];
          positions[i * 3 + 2] += burstVel[i * 3 + 2];
          
          burstVel[i * 3] *= decay;
          burstVel[i * 3 + 1] *= decay;
          burstVel[i * 3 + 2] *= decay;
        }
        posAttr.needsUpdate = true;
      }

      // D. Ambient Floating drift coordinates
      const floatAmp = 3.2;
      const speedFactor = 1.1;
      
      if (leftSphere.scale.x > 0.1) {
        const leftTargetY = -26 + Math.sin(time * speedFactor) * floatAmp;
        const leftTargetX = -48 + Math.cos(time * speedFactor * 0.8) * (floatAmp * 0.8);
        leftSphere.position.y = leftTargetY;
        leftSphere.position.x = leftTargetX;
      }
      
      if (centerSphere.scale.x > 0.1) {
        const centerTargetY = 52 + Math.sin(time * speedFactor * 1.1 + 1.2) * floatAmp;
        const centerTargetX = 0 + Math.cos(time * speedFactor * 0.75 + 0.5) * (floatAmp * 0.8);
        centerSphere.position.y = centerTargetY;
        centerSphere.position.x = centerTargetX;
      }
      
      if (rightSphere.scale.x > 0.1) {
        const rightTargetY = -26 + Math.sin(time * speedFactor * 0.9 + 2.4) * floatAmp;
        const rightTargetX = 48 + Math.cos(time * speedFactor * 0.85 + 1.5) * (floatAmp * 0.8);
        rightSphere.position.y = rightTargetY;
        rightSphere.position.x = rightTargetX;
      }

      renderer.render(scene, camera);
    };

    // --- 9. Timeline Animations (GSAP) ---
    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        onComplete: () => {
          if (onAnimComplete) onAnimComplete();
        }
      });

      // A. Waveforms activation
      curvesRef.current.forEach((curveObj) => {
        curveObj.subLines.forEach((subObj) => {
          subObj.line.material.amplitude = 0;
          mainTl.to(subObj.line.material, {
            amplitude: 28,
            opacity: 0.16 * subObj.opacityMult,
            duration: 1.0,
            ease: 'power2.out'
          }, 0);
        });
        
        mainTl.to(pulseParticlesRef.current[curveObj.colorIdx].points.material, {
          opacity: 0.35,
          duration: 1.0,
          ease: 'power2.out'
        }, 0);
      });

      // B. Collision Shockwaves & Volumetric Emergence
      mainTl.addLabel('collision', '0.2');
      
      mainTl.set(flash.scale, { x: 5, y: 5 }, 'collision');
      mainTl.to(flash.scale, { x: 400, y: 400, duration: 0.3, ease: 'power2.out' }, 'collision');
      mainTl.fromTo(flash.material, 
        { opacity: 0 },
        { opacity: 1, duration: 0.05, ease: 'none' }, 
        'collision'
      );
      mainTl.to(flash.material, { opacity: 0, duration: 0.25, ease: 'power3.out' }, 'collision+=0.05');

      // Shockwave Ring 1 (White)
      mainTl.set(ringMesh1.scale, { x: 0.01, y: 0.01, z: 0.01 }, 'collision');
      mainTl.fromTo(ringMat1, { opacity: 0.85 }, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 'collision');
      mainTl.to(ringMesh1.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 0.7, ease: 'power2.out' }, 'collision');

      // Shockwave Ring 2 (Cyan-Green)
      mainTl.set(ringMesh2.scale, { x: 0.01, y: 0.01, z: 0.01 }, 'collision');
      mainTl.fromTo(ringMat2, { opacity: 0.65 }, { opacity: 0, duration: 0.9, ease: 'power3.out' }, 'collision+=0.04');
      mainTl.to(ringMesh2.scale, { x: 3.5, y: 3.5, z: 3.5, duration: 0.9, ease: 'power3.out' }, 'collision+=0.04');

      // Sparks release
      mainTl.fromTo(burstMat,
        { opacity: 0 },
        { opacity: 1, duration: 0.04 },
        'collision'
      );
      mainTl.to(burstMat, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 'collision+=0.1');

      // C. Spawn 3D Glass spheres smoothly from origin (Luxurious easing)
      const targetPos = {
        left: { x: -48, y: -26 },
        center: { x: 0, y: 52 },
        right: { x: 48, y: -26 }
      };

      // Center (top) - GREEN
      mainTl.set(centerSphere.position, { x: 0, y: 0, z: 0 }, 'collision');
      mainTl.to(centerSphere.material, { opacity: 0.95, duration: 0.3 }, 'collision');
      mainTl.to(centerSphere.scale, { x: sphereScale, y: sphereScale, z: sphereScale, duration: 1.8, ease: 'power3.out' }, 'collision');
      mainTl.to(centerSphere.position, { 
        x: targetPos.center.x, 
        y: targetPos.center.y, 
        duration: 1.8, 
        ease: 'power3.out' 
      }, 'collision');

      // Left (bottom-left) - BLUE
      mainTl.set(leftSphere.position, { x: 0, y: 0, z: 0 }, 'collision');
      mainTl.to(leftSphere.material, { opacity: 0.95, duration: 0.3 }, 'collision');
      mainTl.to(leftSphere.scale, { x: sphereScale, y: sphereScale, z: sphereScale, duration: 1.8, ease: 'power3.out' }, 'collision');
      mainTl.to(leftSphere.position, { 
        x: targetPos.left.x, 
        y: targetPos.left.y, 
        duration: 1.8, 
        ease: 'power3.out' 
      }, 'collision');

      // Right (bottom-right) - RED
      mainTl.set(rightSphere.position, { x: 0, y: 0, z: 0 }, 'collision');
      mainTl.to(rightSphere.material, { opacity: 0.95, duration: 0.3 }, 'collision');
      mainTl.to(rightSphere.scale, { x: sphereScale, y: sphereScale, z: sphereScale, duration: 1.8, ease: 'power3.out' }, 'collision');
      mainTl.to(rightSphere.position, { 
        x: targetPos.right.x, 
        y: targetPos.right.y, 
        duration: 1.8, 
        ease: 'power3.out' 
      }, 'collision');

      // Hold state
      mainTl.to({}, { duration: 0.8 });
    });
    gsapCtxRef.current = ctx;

    // --- 10. Skip/Burst Action Trigger ---
    triggerBurstRef.current = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (gsapCtxRef.current) gsapCtxRef.current.revert();
      
      let expTime = 0;
      const expClock = new THREE.Clock();
      
      // Accelerate burst velocity for exit
      for (let i = 0; i < burstCount; i++) {
        burstVel[i * 3] *= 4.5;
        burstVel[i * 3 + 1] *= 4.5;
        burstVel[i * 3 + 2] *= 4.5;
      }
      
      const burstTick = () => {
        expTime = expClock.getElapsedTime();
        if (expTime > 1.2) {
          if (onAnimComplete) onAnimComplete();
          return;
        }
        requestRef.current = requestAnimationFrame(burstTick);
        
        const positions = burstParticles.geometry.attributes.position.array;
        for (let i = 0; i < burstCount; i++) {
          positions[i * 3] += burstVel[i * 3];
          positions[i * 3 + 1] += burstVel[i * 3 + 1];
          positions[i * 3 + 2] += burstVel[i * 3 + 2];
        }
        burstParticles.geometry.attributes.position.needsUpdate = true;
        
        // Scale down spheres smoothly
        const scaleVal = Math.max(0.001, (1 - expTime * 1.5) * sphereScale);
        leftSphere.scale.set(scaleVal, scaleVal, scaleVal);
        centerSphere.scale.set(scaleVal, scaleVal, scaleVal);
        rightSphere.scale.set(scaleVal, scaleVal, scaleVal);
        
        // Slowly disperse curves
        curvesRef.current.forEach((curve) => {
          curve.subLines.forEach((subObj) => {
            subObj.line.material.opacity = Math.max(0, (1 - expTime * 1.8) * 0.14 * subObj.opacityMult);
          });
        });
        pulseParticlesRef.current.forEach((pulse) => {
          pulse.points.material.opacity = Math.max(0, (1 - expTime * 1.8) * 0.35);
        });
        
        burstMat.opacity = Math.max(0, 1 - expTime * 0.95);
        
        renderer.render(scene, camera);
      };
      
      const burstPositions = burstParticles.geometry.attributes.position.array;
      for (let i = 0; i < burstCount; i++) {
        const core = i % 3 === 0 
          ? leftSphere.position 
          : (i % 3 === 1 ? centerSphere.position : rightSphere.position);
          
        burstPositions[i * 3] = core.x;
        burstPositions[i * 3 + 1] = core.y;
        burstPositions[i * 3 + 2] = core.z;
      }
      burstParticles.geometry.attributes.position.needsUpdate = true;
      burstMat.opacity = 1;
      
      expClock.start();
      requestAnimationFrame(burstTick);
    };

    // --- 11. Window Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Run tick loop
    tick();

    // --- 12. Clean-up lifecycles ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (gsapCtxRef.current) gsapCtxRef.current.revert();
      
      // Dispose WebGL resources
      scene.remove(leftSphere);
      scene.remove(centerSphere);
      scene.remove(rightSphere);
      scene.remove(flash);
      scene.remove(ringMesh1);
      scene.remove(ringMesh2);
      scene.remove(burstParticles);
      
      sparkTex.dispose();
      flashTex.dispose();
      
      leftMat.dispose();
      centerMat.dispose();
      rightMat.dispose();
      flashMat.dispose();
      burstMat.dispose();
      
      sphereGeom.dispose();
      ringGeom.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      
      curvesRef.current.forEach((c) => {
        c.subLines.forEach((subObj) => {
          scene.remove(subObj.line);
          subObj.line.geometry.dispose();
          subObj.line.material.dispose();
        });
      });
      
      pulseParticlesRef.current.forEach((p) => {
        scene.remove(p.points);
        p.points.geometry.dispose();
        p.points.material.dispose();
      });
      
      burstGeom.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [onAnimComplete]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 6 }} 
    />
  );
}
