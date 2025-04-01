// import { useRef } from "react";

// export default function ThreeDEffectComponent() {
//   const cardRef = useRef(null);

//   const handleMouseMove = (e) => {
//     const card = cardRef.current;
//     const { left, top, width, height } = card.getBoundingClientRect();
//     const x = e.clientX - left - width / 2;
//     const y = e.clientY - top - height / 2;
//     card.style.transform = `rotateY(${x / 15}deg) rotateX(${-y / 15}deg)`;
//   };

//   const handleMouseLeave = () => {
//     cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//       <div
//         ref={cardRef}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         className="w-80 h-96 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl transition-transform duration-300 ease-out cursor-pointer"
//       >
//         <div className="p-6 text-center text-white">
//           <h1 className="text-2xl font-bold">3D Effect Card</h1>
//           <p className="mt-4">Hover to see the magic!</p>
//         </div>
//       </div>
//     </div>
//   );
// }
