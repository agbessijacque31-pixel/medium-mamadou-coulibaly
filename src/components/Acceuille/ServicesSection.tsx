import Link from "next/link";
import React from "react";
import { services } from "../MenuLinks/menuLinks";

const ServicesSection = () => {
    return (
        <section id="services" className="relative z-40 px-8 py-20">
            <div className="max-w-7xl mx-auto">
                {/* Titre */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Mes Services Spirituels
                    </h2>
                    <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                        Des rituels ancestraux puissants pour transformer votre vie et résoudre tous vos problèmes
                    </p>
                </div>

                {/* Grille */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={service.link}
                            className="no-underline"
                        >
                        <div
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border border-purple-500/30"
                        >
                            <div className="text-yellow-400 mb-4 flex justify-center">{service.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-center">{service.title}</h3>
                            <p className="text-purple-200 text-center">{service.description}</p>
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default ServicesSection;
