"use client";

import { useEffect, useRef, useState } from "react";
import type { Mesh, Object3D } from "three";

const MAX_PREVIEW_BYTES = 40 * 1024 * 1024;
const COPPER_COLOR = 0xb87333;

type ModelPreviewProps = {
  file: File;
};

export function ModelPreview({ file }: ModelPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const disposers: Array<() => void> = [];

    async function start() {
      if (file.size > MAX_PREVIEW_BYTES) {
        setStatus("error");
        setError("This file is too large to preview in the browser.");
        return;
      }

      setStatus("loading");
      setError("");

      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
        const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
        const { STLLoader } = await import("three/addons/loaders/STLLoader.js");
        const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");
        const { ThreeMFLoader } = await import("three/addons/loaders/3MFLoader.js");

        if (cancelled || !container) return;

        const buffer = await file.arrayBuffer();
        if (cancelled) return;

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, Math.round(width * (10 / 16)), 1);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "block h-full w-full";
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.replaceChildren(renderer.domElement);
        disposers.push(() => {
          renderer.dispose();
          renderer.domElement.remove();
        });

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0b0c);

        const environment = new RoomEnvironment();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromScene(environment, 0.04).texture;
        scene.environment = envMap;
        environment.dispose();

        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);
        camera.position.set(72, 48, 96);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 24;
        controls.maxDistance = 240;
        controls.target.set(0, 0, 0);

        const material = new THREE.MeshPhysicalMaterial({
          color: COPPER_COLOR,
          metalness: 1,
          roughness: 0.28,
          envMapIntensity: 1.2,
          clearcoat: 0.18,
          clearcoatRoughness: 0.4,
          side: THREE.DoubleSide,
        });

        let model: Object3D;
        if (ext === "stl") {
          const geometry = new STLLoader().parse(buffer);
          geometry.computeVertexNormals();
          model = new THREE.Mesh(geometry, material);
        } else if (ext === "obj") {
          model = new OBJLoader().parse(new TextDecoder().decode(buffer));
        } else if (ext === "3mf") {
          model = new ThreeMFLoader().parse(buffer);
        } else {
          throw new Error("Preview supports STL, OBJ, and 3MF.");
        }

        model.traverse((child: Object3D) => {
          const mesh = child as Mesh;
          if (!mesh.isMesh) return;
          const geometry = mesh.geometry;
          if (geometry && !geometry.getAttribute("normal")) {
            geometry.computeVertexNormals();
          }
          mesh.material = material;
        });

        const box = new THREE.Box3().setFromObject(model);
        if (box.isEmpty()) {
          throw new Error("This file doesn't contain a visible mesh.");
        }
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z, 1);
        model.scale.setScalar(48 / maxDim);
        scene.add(model);

        const keyLight = new THREE.DirectionalLight(0xfff1e0, 0.45);
        keyLight.position.set(40, 80, 50);
        scene.add(keyLight);
        scene.add(new THREE.HemisphereLight(0xffe6cc, 0x1a120c, 0.22));

        const resize = () => {
          const nextWidth = Math.max(container.clientWidth, 1);
          const nextHeight = Math.max(container.clientHeight, Math.round(nextWidth * (10 / 16)), 1);
          camera.aspect = nextWidth / nextHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(nextWidth, nextHeight);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(container);

        let raf = 0;
        const tick = () => {
          if (cancelled) return;
          controls.update();
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        tick();

        disposers.push(() => {
          cancelAnimationFrame(raf);
          observer.disconnect();
          controls.dispose();
          material.dispose();
          envMap.dispose();
          pmrem.dispose();
          model.traverse((child: Object3D) => {
            const mesh = child as Mesh;
            if (mesh.isMesh) mesh.geometry?.dispose();
          });
        });

        if (cancelled) {
          while (disposers.length) disposers.pop()?.();
          return;
        }

        setStatus("ready");
      } catch (err) {
        while (disposers.length) disposers.pop()?.();
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error && err.message ? err.message : "Unable to preview this file.");
      }
    }

    void start();

    return () => {
      cancelled = true;
      while (disposers.length) disposers.pop()?.();
    };
  }, [file]);

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-copper/20 bg-black">
      <div className="relative">
        <div ref={containerRef} className="aspect-[16/10] w-full" />
        {status !== "ready" ? (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-stone-400">
            {status === "loading" ? "Building copper preview…" : error}
          </div>
        ) : null}
      </div>
        {status === "ready" ? (
          <p className="border-t border-copper/10 px-3 py-2 text-xs text-stone-500">
            Approximate copper look — not the plated result. Drag to rotate, scroll to zoom.
          </p>
        ) : null}
    </div>
  );
}
