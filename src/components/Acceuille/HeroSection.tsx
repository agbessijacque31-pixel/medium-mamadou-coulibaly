import Image from "next/image";
import React from "react";

const HeroSection = () => {
    const tel = process.env.NEXT_PUBLIC_TEL;

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center pt-24"
    >
      {/* Vidéo de fond */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="video/rituels.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* Voile noir transparent */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Texte à gauche */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Medium Marabout
            </span>
            <br />
            <span className="text-white">Mamadou Coulibaly</span>
            <br />
            <span className="whitespace-nowrap">📞{tel}</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-purple-200 leading-relaxed">
            Retour affectif • Richesses • Affaire de Justice • Envoutements •
            Protection • Chance • Fertilité
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105">
              Me contacter
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300">
              Découvrir mes rituels
            </button>
          </div>
        </div>

        {/* Image à droite */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/image/coulibaly-mamadou.jpg"
            alt="Marabout Mamadou Coulibaly"
            width={300}
            height={300}
            className="w-3/4 sm:w-2/3 md:w-full max-w-md aspect-square rounded-full border-4 border-yellow-400 object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
