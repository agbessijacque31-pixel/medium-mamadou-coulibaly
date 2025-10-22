import Image from "next/image";

// app/components/AboutSection.tsx
export default function AboutSection() {
  return (
    <section id="about" className="relative z-40 px-8 py-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Texte à gauche */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Qui suis-je ?
            </span>
            <br />
            <span className="text-white">Mamadou Coulibaly</span>
          </h2>
          <p className="text-lg md:text-xl mb-8 text-purple-200 leading-relaxed text-justify">
            Je suis Mamadou Coulibaly, médium et marabout avec plus de 45 ans d’expérience dans l’art des rituels et de la spiritualité. Tout au long de mon parcours, j’ai consacré ma vie à accompagner les personnes en quête de solutions concrètes et efficaces pour améliorer leur vie, retrouver l’amour, la prospérité et l’harmonie.
            <br />
            Spécialiste des rituels de portefeuille magique, calebasse magique, valise magique, ainsi que du retour affectif, de l’envoûtement, du désenvoûtement, des affaires de justice, et de la fertilité chez la femme et chez l’homme, j’ai aidé des milliers de personnes en France, Belgique, Espagne, Côte d’Ivoire, et dans de nombreux autres pays à trouver satisfaction et sérénité.

            <br />
            Mes compétences sont reconnues par de nombreux certificats et diplômes, qui témoignent de ma maîtrise et de mon sérieux dans le domaine spirituel et magique. Mon approche est à la fois professionnelle, efficace et bienveillante, et je m’engage à offrir des solutions sur mesure pour chaque situation.

            <br />
            Si vous recherchez un médium marabout expérimenté, capable de transformer vos problèmes en opportunités, je suis là pour vous guider avec sagesse, puissance et discrétion.


          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105">
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
            src="/image/mamadou-coulibaly.jpeg"
            alt="Marabout Mamadou Coulibaly"
            width={300}
            height={300}
            className="w-3/4 md:w-full max-w-md border-4 border-yellow-400 object-cover shadow-lg rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
