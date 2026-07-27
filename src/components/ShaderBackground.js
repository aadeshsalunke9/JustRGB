'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ShaderBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, and Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance'
    });

    // Cap at a sane resolution for performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.0);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Custom Shader Material setup
    const uniforms = {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio) }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // ── Simplex 2D noise ──────────────────────────────────────
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0 * vec3(x0.x, x12.x, x12.z) + h * vec3(x0.y, x12.y, x12.w);
        vec3 recip = 1.79284291400159 - 0.85373472095314 * (g*g + h*h);
        m *= recip * recip;
        return 130.0 * dot(m, g);
      }

      // ── fBm with 2 octaves (fewer = softer, larger shapes) ──
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.55;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 2; ++i) {
          v += a * snoise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      // ── Inigo Quilez cosine palette ───────────────────────────
      // color = a + b * cos(2π(c*t + d))
      // Constants tuned to cycle: shadow-violet → blue-gray → teal →
      // terracotta/tan → dusty mauve → cream highlight
      vec3 palette(float t) {
        // a = midpoint of color range (average of darkest and brightest)
        vec3 a = vec3(0.35, 0.32, 0.38);
        // b = amplitude of cosine oscillation
        vec3 b = vec3(0.38, 0.28, 0.32);
        // c = frequency — higher = more colors visible at once
        vec3 c = vec3(1.2, 1.0, 0.8);
        // d = phase offset per channel — shifts where warm/cool tones land
        vec3 d = vec3(0.0, 0.15, 0.55);
        return a + b * cos(6.28318 * (c * t + d));
      }

      // ── Per-pixel hash for grain ──────────────────────────────
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      // ── Overlay blend mode (for film grain) ───────────────────
      float overlayBlend(float base, float blend) {
        return base < 0.5
          ? (2.0 * base * blend)
          : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        // Aspect-corrected centered coords
        vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

        // ── FIX 1: LOW noise frequency → only 3-5 large blobs ──
        p *= 0.45;

        float slowTime = uTime * 0.03;

        // ── Domain warping: first noise layer offsets second ────
        vec2 q = vec2(
          fbm(p + vec2(0.0, 0.0) + slowTime),
          fbm(p + vec2(5.2, 1.3) + slowTime)
        );

        // Strong warp offset so shapes flow into each other
        vec2 r = vec2(
          fbm(p + 4.0 * q + vec2(1.7, 9.2) + slowTime * 0.6),
          fbm(p + 4.0 * q + vec2(8.3, 2.8) + slowTime * 0.6)
        );

        // Final noise scalar — this drives the palette lookup
        float f = fbm(p + 4.0 * r);

        // Normalize f from [-1,1]-ish range to [0,1]
        float t = f * 0.5 + 0.5;

        // Use secondary noise layers to add spatial variation
        float tShift = (q.x + r.y) * 0.2;

        // ── FIX 2 & 3: FLAT palette lookup, no lighting ────────
        // Pure noise → cosine palette. No specular, no bump, no lighting.
        vec3 col = palette(t + tShift);

        // Darken into shadow base in the lowest noise regions
        vec3 cShadow = vec3(0.086, 0.075, 0.137);  // #161323
        col = mix(cShadow, col, smoothstep(0.15, 0.55, t));

        // Pull warm terracotta into mid-regions using secondary warp
        vec3 cTerra = vec3(0.541, 0.408, 0.353);    // #8a685a
        float warmZone = smoothstep(0.3, 0.6, r.x) * smoothstep(0.7, 0.35, r.y);
        col = mix(col, cTerra, warmZone * 0.4);

        // Dusty mauve accent in specific warp regions
        vec3 cMauve = vec3(0.518, 0.392, 0.498);    // #84647f
        float mauveZone = smoothstep(0.4, 0.65, q.y) * smoothstep(0.7, 0.45, q.x);
        col = mix(col, cMauve, mauveZone * 0.3);

        // Cream highlights only at the very brightest peaks
        vec3 cCream = vec3(0.835, 0.812, 0.776);    // #d5cfc6
        col = mix(col, cCream, smoothstep(0.72, 0.92, t) * 0.5);

        // Desaturate slightly to match the dusty/filmic look
        float luma = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(luma), col, 0.72);

        // ── Radial vignette: darken/cool the corners ────────────
        vec3 cVignette = vec3(0.039, 0.035, 0.043); // #0a090b
        float vd = length(uv - vec2(0.5));
        col = mix(col, cVignette, smoothstep(0.3, 0.85, vd));

        // ── FIX 4: FINE film grain, overlay blend, ~5% ─────────
        // Per-pixel hash noise at screen resolution — 1px grain, not glitter
        float grainSeed = floor(uTime * 24.0); // re-randomize ~24fps
        float grainR = hash(gl_FragCoord.xy + grainSeed * 1.13);
        float grainG = hash(gl_FragCoord.xy + vec2(1.0, 0.0) + grainSeed * 1.71);
        float grainB = hash(gl_FragCoord.xy + vec2(0.0, -1.0) + grainSeed * 2.37);

        // Overlay blend at low opacity for authentic film grain
        float grainStrength = 0.055;
        col.r = mix(col.r, overlayBlend(col.r, grainR), grainStrength);
        col.g = mix(col.g, overlayBlend(col.g, grainG), grainStrength);
        col.b = mix(col.b, overlayBlend(col.b, grainB), grainStrength);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 3. Animation and Loop controls
    let animationFrameId;
    let clock = new THREE.Clock();
    let isTabVisible = true;

    const animate = () => {
      if (!isTabVisible) return;
      animationFrameId = requestAnimationFrame(animate);
      
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    // 4. Page Visibility Observer to pause on hidden tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isTabVisible = true;
        clock.getDelta(); // reset clock delta to prevent jump
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animate();

    // 5. Resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
