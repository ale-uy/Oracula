'use client';
import MysticOrb from './MysticOrb';

export default function Welcome() {
  return (
    <div className="text-center mb-12 animate-fadeIn">
      <h1 className="text-6xl font-mystical mb-4 text-purple-300 animate-scaleIn">
        La Orácula
      </h1>
      <p className="text-2xl text-purple-200 animate-fadeInDelay">
        La Orácula te lee la suerte
      </p>
      <div className="mt-8 animate-fadeInDelay2">
        <MysticOrb />
      </div>
    </div>
  );
}
