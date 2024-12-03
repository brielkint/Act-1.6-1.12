import * as THREE from 'three';  // Import Three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  // Import OrbitControls

// Scene setup
const scene = new THREE.Scene();  // Create the scene

// Initial window size and camera setup
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;  // Position camera on the z-axis

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);  // Set renderer size to match window size
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // Optimize pixel ratio for retina displays
document.body.appendChild(renderer.domElement);  // Attach renderer to the DOM

// Create a glowing Torus Knot geometry
const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);  // Radius, tube radius, tubular segments, radial segments
const material = new THREE.MeshStandardMaterial({
  color: 0x00FFFF,  // Cyan color for a futuristic vibe
  emissive: 0x00FFFF,  // Glowing effect for divine shine
  emissiveIntensity: 1.5,  // Intensify the glowing effect
  metalness: 0.9,  // Highly metallic surface for more reflective shine
  roughness: 0.3,  // Slightly smooth for better reflections
  reflectivity: 1.0  // Highly reflective material for a modern, sleek look
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);  // Add torus knot to the scene

// Lights setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);  // White color, low intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // White color, high intensity
directionalLight.position.set(5, 5, 5);  // Position light at (5, 5, 5)
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff6347, 1, 10);  // Soft red color, intensity 1, distance 10
pointLight.position.set(-3, 3, 0);  // Position it on the left side
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.5);  // Sky and ground colors
scene.add(hemisphereLight);

// Particle system setup (interactive particles)
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;  // X position
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  // Y position
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // Z position
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x00FFFF,
  size: 0.1,
  emissive: 0x00FFFF,  // Glowing particles
  transparent: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Create a reflective floor plane
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

// Window resizing functionality
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen functionality
window.addEventListener('dblclick', () => {
  const canvas = renderer.domElement;
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Animation loop to rotate the torus knot and particles
function animate() {
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  torusKnot.rotation.z += 0.01;

  // Update particle system for movement
  particles.rotation.y += 0.001;

  controls.update();  // Update controls for smooth camera movement
  renderer.render(scene, camera);
  requestAnimationFrame(animate);  // Recursively call animate
}

animate();  // Start the animation loop
