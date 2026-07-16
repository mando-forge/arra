"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

function findScroller(el: HTMLElement): HTMLElement | undefined {
  let node = el.parentElement;
  while (node) {
    if (node.hasAttribute("data-lenis-prevent")) return node;
    const oy = getComputedStyle(node).overflowY;
    if (
      (oy === "auto" || oy === "scroll") &&
      node.scrollHeight > node.clientHeight
    )
      return node;
    node = node.parentElement;
  }
  return undefined;
}

const BASE_VERTEX = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const STENCIL_VERTEX = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform vec2 texelSize;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    vUv = uv;
    vL = uv - vec2(texelSize.x, 0.0);
    vR = uv + vec2(texelSize.x, 0.0);
    vT = uv + vec2(0.0, texelSize.y);
    vB = uv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SPLAT_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  varying vec2 vUv;
  void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
`;

const CURL_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uVelocity;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = clamp(velocity, -1000.0, 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const DIVERGENCE_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uVelocity;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const CLEAR_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float value;
  varying vec2 vUv;
  void main() {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const PRESSURE_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const DISPLAY_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  uniform sampler2D uImageB;
  uniform sampler2D uDye;
  varying vec2 vUv;
  void main() {
    vec3 dye = texture2D(uDye, vUv).rgb;
    float mask = clamp(length(dye.rg) * 1.5, 0.0, 1.0);
    vec4 a = texture2D(uImage, vUv);
    vec4 b = texture2D(uImageB, vUv);
    float colorMix = 0.78 + 0.22 * smoothstep(0.0, 0.6, mask);
    vec3 col = mix(a.rgb, b.rgb, colorMix);
    col += abs(vec3(dye.r, dye.g * 0.6, -dye.r)) * 0.18 * mask;
    float cubeAlpha = max(a.a, b.a);
    float flowAlpha = mask * 0.16;
    gl_FragColor = vec4(col, max(cubeAlpha, flowAlpha));
  }
`;

const CUBE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CUBE_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uGlowColor;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = vUv * 3.0;
    float t = uTime * 0.15;
    vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3)));
    vec2 r = vec2(
      fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t),
      fbm(uv + 4.0 * q + vec2(8.3, 2.8) - t)
    );
    float f = fbm(uv + 4.0 * r);
    float field = smoothstep(0.16, 0.88, f + r.x * 0.18);
    vec3 col = mix(uBaseColor, uAccentColor, field);
    col = mix(col, uGlowColor, smoothstep(0.62, 1.0, r.y) * 0.34);
    gl_FragColor = vec4(col, 0.76);
  }
`;

const DEFAULTS = {
  densityDissipation: 0.94,
  velocityDissipation: 0.98,
  pressureDissipation: 0.8,
  curl: 12,
  radius: 0.002,
  splatForce: 6,
};

export const FluidCubeCanvas = ({
  progress,
  className,
  reducedMotion = false,
}: {
  progress: MotionValue<number>;
  className?: string;
  reducedMotion?: boolean | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const config = { ...DEFAULTS };

    // Determine quality based on concurrency (CPU cores) and mobile device detection
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isMobile;
    const pressureIterations = lowPower ? 8 : 18;
    const simResolution = lowPower ? 96 : 160;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "low-power",
        alpha: true,
      });
    } catch (e) {
      console.warn("WebGL not supported or initialization failed:", e);
      return () => {};
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, lowPower ? 1.35 : 2),
    );
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.style.background = "transparent";
    canvas.style.touchAction = "pan-y";

    const onContextLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", onContextLost);

    const simCamera = new THREE.Camera();
    const simScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    simScene.add(quad);

    const cubeScene = new THREE.Scene();
    const cubeCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cubeCamera.position.set(3, 3, 3);
    cubeCamera.lookAt(0, 0, 0);

    const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const plainMat = new THREE.MeshBasicMaterial({
      color: 0x173c3a,
      opacity: 0.18,
      transparent: true,
    });
    const colorMat = new THREE.ShaderMaterial({
      vertexShader: CUBE_VERT,
      fragmentShader: CUBE_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(0x173c3a) },
        uAccentColor: { value: new THREE.Color(0x708ca3) },
        uGlowColor: { value: new THREE.Color(0xb27a22) },
      },
    });
    const cubeMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(
      boxGeo,
      plainMat,
    );
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x173c3a,
      opacity: 0.9,
      transparent: true,
    });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeo),
      edgeMaterial,
    );
    cubeMesh.add(edges);
    cubeScene.add(cubeMesh);

    const applyThemePalette = () => {
      const isDark = document.documentElement.classList.contains("dark");
      plainMat.color.setHex(isDark ? 0x708ca3 : 0x173c3a);
      edgeMaterial.color.setHex(isDark ? 0xf6f3eb : 0x173c3a);
      (colorMat.uniforms.uBaseColor.value as THREE.Color).setHex(
        isDark ? 0x708ca3 : 0x173c3a,
      );
      (colorMat.uniforms.uAccentColor.value as THREE.Color).setHex(
        isDark ? 0x2fd8d8 : 0x708ca3,
      );
      (colorMat.uniforms.uGlowColor.value as THREE.Color).setHex(0xb27a22);
    };
    applyThemePalette();
    const themeObserver = new MutationObserver(applyThemePalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const aspect = Math.max(
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.0001,
    );
    let simW: number;
    let simH: number;
    if (aspect >= 1) {
      simW = Math.round(simResolution * aspect);
      simH = simResolution;
    } else {
      simW = simResolution;
      simH = Math.round(simResolution / aspect);
    }
    const texelSize = new THREE.Vector2(1 / simW, 1 / simH);

    const rtOptions: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    };
    const makeRT = () => new THREE.WebGLRenderTarget(simW, simH, rtOptions);
    const makeDouble = () => {
      let read = makeRT();
      let write = makeRT();
      return {
        get read() {
          return read;
        },
        get write() {
          return write;
        },
        swap() {
          const tmp = read;
          read = write;
          write = tmp;
        },
        dispose() {
          read.dispose();
          write.dispose();
        },
      };
    };
    const velocity = makeDouble();
    const dye = makeDouble();
    const pressure = makeDouble();
    const divergence = makeRT();
    const curl = makeRT();

    const makeSceneRT = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        depthBuffer: true,
        stencilBuffer: false,
      });
    let scenePlain = makeSceneRT(1, 1);
    let sceneColor = makeSceneRT(1, 1);

    const mat = (
      vertexShader: string,
      fragmentShader: string,
      uniforms: Record<string, THREE.IUniform>,
    ) =>
      new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });

    const splatMat = mat(BASE_VERTEX, SPLAT_FRAG, {
      uTarget: { value: null },
      aspectRatio: { value: simW / simH },
      color: { value: new THREE.Vector3() },
      point: { value: new THREE.Vector2() },
      radius: { value: config.radius },
    });
    const advectionMat = mat(BASE_VERTEX, ADVECTION_FRAG, {
      uVelocity: { value: null },
      uSource: { value: null },
      texelSize: { value: texelSize },
      dt: { value: 0 },
      dissipation: { value: 1 },
    });
    const curlMat = mat(STENCIL_VERTEX, CURL_FRAG, {
      texelSize: { value: texelSize },
      uVelocity: { value: null },
    });
    const vorticityMat = mat(STENCIL_VERTEX, VORTICITY_FRAG, {
      texelSize: { value: texelSize },
      uVelocity: { value: null },
      uCurl: { value: null },
      curl: { value: config.curl },
      dt: { value: 0 },
    });
    const divergenceMat = mat(STENCIL_VERTEX, DIVERGENCE_FRAG, {
      texelSize: { value: texelSize },
      uVelocity: { value: null },
    });
    const clearMat = mat(BASE_VERTEX, CLEAR_FRAG, {
      uTexture: { value: null },
      value: { value: 1 },
    });
    const pressureMat = mat(STENCIL_VERTEX, PRESSURE_FRAG, {
      texelSize: { value: texelSize },
      uPressure: { value: null },
      uDivergence: { value: null },
    });
    const gradientMat = mat(STENCIL_VERTEX, GRADIENT_FRAG, {
      texelSize: { value: texelSize },
      uPressure: { value: null },
      uVelocity: { value: null },
    });
    const displayMat = mat(BASE_VERTEX, DISPLAY_FRAG, {
      uImage: { value: null },
      uImageB: { value: null },
      uDye: { value: null },
    });

    const blit = (
      material: THREE.Material,
      target: THREE.WebGLRenderTarget | null,
    ) => {
      quad.material = material;
      renderer.setRenderTarget(target);
      renderer.render(simScene, simCamera);
    };

    type Splat = { x: number; y: number; dx: number; dy: number };
    const queue: Splat[] = [];
    let pointer: { x: number; y: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (pointer) queue.push({ x, y, dx: x - pointer.x, dy: y - pointer.y });
      pointer = { x, y };
    };
    const onPointerLeave = () => {
      pointer = null;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const applySplat = (s: Splat) => {
      splatMat.uniforms.uTarget.value = velocity.read.texture;
      splatMat.uniforms.radius.value = config.radius;
      (splatMat.uniforms.point.value as THREE.Vector2).set(s.x, s.y);
      (splatMat.uniforms.color.value as THREE.Vector3).set(
        s.dx * config.splatForce,
        s.dy * config.splatForce,
        0,
      );
      blit(splatMat, velocity.write);
      velocity.swap();

      splatMat.uniforms.uTarget.value = dye.read.texture;
      (splatMat.uniforms.color.value as THREE.Vector3).set(
        s.dx * config.splatForce,
        s.dy * config.splatForce,
        0,
      );
      blit(splatMat, dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      curlMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(curlMat, curl);

      vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMat.uniforms.uCurl.value = curl.texture;
      vorticityMat.uniforms.curl.value = config.curl;
      vorticityMat.uniforms.dt.value = dt;
      blit(vorticityMat, velocity.write);
      velocity.swap();

      divergenceMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(divergenceMat, divergence);

      clearMat.uniforms.uTexture.value = pressure.read.texture;
      clearMat.uniforms.value.value = Math.pow(
        config.pressureDissipation,
        dt * 60,
      );
      blit(clearMat, pressure.write);
      pressure.swap();

      for (let i = 0; i < pressureIterations; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        pressureMat.uniforms.uDivergence.value = divergence.texture;
        blit(pressureMat, pressure.write);
        pressure.swap();
      }

      gradientMat.uniforms.uPressure.value = pressure.read.texture;
      gradientMat.uniforms.uVelocity.value = velocity.read.texture;
      blit(gradientMat, velocity.write);
      velocity.swap();

      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.dt.value = dt;
      advectionMat.uniforms.dissipation.value = Math.pow(
        config.velocityDissipation,
        dt * 60,
      );
      blit(advectionMat, velocity.write);
      velocity.swap();

      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = dye.read.texture;
      advectionMat.uniforms.dissipation.value = Math.pow(
        config.densityDissipation,
        dt * 60,
      );
      blit(advectionMat, dye.write);
      dye.swap();
    };

    let shaderTime = 0;
    let last = performance.now();

    const renderFrame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      if (!reducedMotion) shaderTime += dt;

      const p = progress.get();
      if (!reducedMotion) {
        const targetY = p * Math.PI * 4;
        const targetX = p * Math.PI * 2;
        cubeMesh.rotation.y += (targetY - cubeMesh.rotation.y) * 0.1;
        cubeMesh.rotation.x += (targetX - cubeMesh.rotation.x) * 0.1;
      }
      colorMat.uniforms.uTime.value = shaderTime;

      renderer.setClearColor(0x000000, 0);
      cubeMesh.material = plainMat;
      renderer.setRenderTarget(scenePlain);
      renderer.clear();
      renderer.render(cubeScene, cubeCamera);

      cubeMesh.material = colorMat;
      renderer.setRenderTarget(sceneColor);
      renderer.clear();
      renderer.render(cubeScene, cubeCamera);

      const hasQueuedSplats = queue.length > 0;
      while (queue.length) applySplat(queue.shift() as Splat);
      if (!reducedMotion || hasQueuedSplats) step(0.016);

      displayMat.uniforms.uImage.value = scenePlain.texture;
      displayMat.uniforms.uImageB.value = sceneColor.texture;
      displayMat.uniforms.uDye.value = dye.read.texture;
      renderer.setRenderTarget(null);
      renderer.clear(true, true, true);
      blit(displayMat, null);
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      const pr = renderer.getPixelRatio();
      const rw = Math.round(w * pr);
      const rh = Math.round(h * pr);
      scenePlain.dispose();
      sceneColor.dispose();
      scenePlain = makeSceneRT(rw, rh);
      sceneColor = makeSceneRT(rw, rh);
      cubeCamera.aspect = w / h;
      cubeCamera.updateProjectionMatrix();
      renderFrame();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let visible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        last = performance.now();
      },
      { rootMargin: "150px", threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      renderFrame();
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      if (canvas.parentNode === container) container.removeChild(canvas);
      velocity.dispose();
      dye.dispose();
      pressure.dispose();
      divergence.dispose();
      curl.dispose();
      scenePlain.dispose();
      sceneColor.dispose();
      boxGeo.dispose();
      edges.geometry.dispose();
      edgeMaterial.dispose();
      plainMat.dispose();
      colorMat.dispose();
      quad.geometry.dispose();
      [
        splatMat,
        advectionMat,
        curlMat,
        vorticityMat,
        divergenceMat,
        clearMat,
        pressureMat,
        gradientMat,
        displayMat,
      ].forEach((m) => m.dispose());
      renderer.setRenderTarget(null);
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, [progress, reducedMotion]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: "hidden" }} />
  );
};

const Scene = ({ scroller }: { scroller: HTMLElement | null }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement | null>(scroller);

  useEffect(() => {
    scrollerRef.current = scroller;
  }, [scroller]);

  const { scrollYProgress } = useScroll({
    container: scroller ? (scrollerRef as React.RefObject<HTMLElement | null>) : undefined,
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ["100%", "0%", "0%", "100%"],
  );

  return (
    <div ref={targetRef} className="relative w-full bg-background text-foreground border-t border-border">
      <div className="pointer-events-none sticky top-0 z-10 h-screen w-full">
        <motion.div
          style={{ x }}
          className="absolute left-0 top-0 h-full w-1/2"
        >
          <FluidCubeCanvas
            progress={scrollYProgress}
            reducedMotion={useReducedMotion()}
            className="pointer-events-auto h-full w-full"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none relative z-20 mt-[-100vh]">
        <section className="pointer-events-none flex min-h-screen w-full items-center justify-start px-8 md:px-16">
          <div className="pointer-events-auto flex max-w-md flex-col gap-4 text-left">
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl font-serif">
              Research signals
            </h2>
            <p className="text-base text-foreground/70 font-mono">
              Explore a live study of how observations, sources, and questions move through ARRA-CORE&apos;s practice.
            </p>
          </div>
        </section>

        <section className="pointer-events-none flex min-h-screen w-full items-center justify-end px-8 md:px-16">
          <div className="pointer-events-auto flex max-w-md flex-col gap-4 text-right">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl font-serif">
              Patterns in motion
            </h2>
            <p className="text-base text-foreground/70 font-mono">
              The model shifts as you scroll, reflecting how evidence changes the shape and direction of an inquiry.
            </p>
          </div>
        </section>

        <section className="pointer-events-none flex min-h-screen w-full items-center justify-end px-8 md:px-16">
          <div className="pointer-events-auto flex max-w-md flex-col gap-4 text-right">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl font-serif">
              Connected context
            </h2>
            <p className="text-base text-foreground/70 font-mono">
              Regional conditions, human needs, and technical constraints are considered together rather than in isolation.
            </p>
          </div>
        </section>

        <section className="pointer-events-none flex min-h-screen w-full items-center justify-start px-8 md:px-16">
          <div className="pointer-events-auto flex max-w-md flex-col gap-4 text-left">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl font-serif">
              Active inquiry
            </h2>
            <p className="text-base text-foreground/70 font-mono">
              Interact with the study and see how ARRA-CORE builds for the community in Imphal, Manipur.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const mobileChapters = [
  {
    index: "01",
    title: "Research signals",
    body: "Observations, sources, and questions move through one connected research practice.",
    align: "left",
  },
  {
    index: "02",
    title: "Patterns in motion",
    body: "New evidence can change the shape and direction of an inquiry.",
    align: "right",
  },
  {
    index: "03",
    title: "Connected context",
    body: "Regional conditions, human needs, and technical constraints are considered together.",
    align: "right",
  },
  {
    index: "04",
    title: "Active inquiry",
    body: "The work stays grounded in Imphal, Manipur as it develops.",
    align: "left",
  },
] as const;

const MobileScene = ({ scroller }: { scroller: HTMLElement | null }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement | null>(scroller);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    scrollerRef.current = scroller;
  }, [scroller]);

  const { scrollYProgress } = useScroll({
    container: scroller
      ? (scrollerRef as React.RefObject<HTMLElement | null>)
      : undefined,
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const cubeScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.88, 1, 1.06, 1, 0.9],
  );
  const cubeY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    ["3svh", "0svh", "-2svh", "2svh"],
  );

  return (
    <div
      ref={targetRef}
      className="relative w-full border-t border-border bg-background text-foreground"
      data-mobile-cube-scene
    >
      <div className="pointer-events-none sticky top-0 z-10 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-x-6 top-6 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
          <span>Research in motion</span>
          <span>Scroll study · 04</span>
        </div>

        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { scale: cubeScale, y: cubeY }
          }
          className="absolute inset-x-0 top-[8svh] h-[50svh] origin-center"
        >
          <FluidCubeCanvas
            progress={scrollYProgress}
            reducedMotion={shouldReduceMotion}
            className="pointer-events-auto size-full"
          />
        </motion.div>

        <div className="absolute right-5 top-[24svh] h-28 w-px bg-foreground/15">
          <motion.div
            className="h-full w-px origin-top bg-[var(--arra-ochre)]"
            style={{ scaleY: shouldReduceMotion ? 1 : scrollYProgress }}
          />
        </div>
      </div>

      <div className="pointer-events-none relative z-20 mt-[-100svh]">
        {mobileChapters.map((chapter) => {
          const isRight = chapter.align === "right";
          return (
            <section
              key={chapter.index}
              className={`flex min-h-[82svh] w-full items-end px-6 pb-12 pt-[58svh] ${
                isRight ? "justify-end" : "justify-start"
              }`}
            >
              <article
                className={`pointer-events-auto w-full max-w-[19rem] border-t border-foreground/25 bg-background/82 pt-4 backdrop-blur-[2px] ${
                  isRight ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--arra-ochre)] ${
                    isRight ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{chapter.index}</span>
                  <span className="h-px w-10 bg-[var(--arra-ochre)]/55" />
                </div>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-none tracking-tight">
                  {chapter.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-foreground/70">
                  {chapter.body}
                </p>
              </article>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export const FluidCubeScroll = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (rootRef.current) setScroller(findScroller(rootRef.current) ?? null);
  }, []);

  return (
    <div
      ref={rootRef}
      id="research-signals"
      className="relative w-full scroll-mt-20"
      aria-label="Research signals interactive study"
    >
      {isMobile ? <MobileScene scroller={scroller} /> : <Scene scroller={scroller} />}
    </div>
  );
};
