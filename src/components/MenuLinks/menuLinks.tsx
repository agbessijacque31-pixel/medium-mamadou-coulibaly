import { FaHeart, FaCoins, FaBaby, FaMagic, FaGavel, FaStar, FaUsers, FaProcedures } from "react-icons/fa";
import { ReactElement } from "react";

export const menuLinks = [
  { href: "/rituels", label: "Rituels" },
  { href: "/rituels-de-richesses", label: "Richesses" },
  { href: "/rituels-de-retour-affectif", label: "Affection" },
  { href: "/rituels-pour-affaire-de-justice", label: "Justice" },
  { href: "/rituels-de-envoutements", label: "Envoutement" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/galeries", label: "Galeries" },
];

export type Service = {
  icon: ReactElement;
  title: string;
  description: string;
  link: string;
};

export const services: Service[] = [
  {
    icon: <FaHeart className="text-3xl" />,
    title: "Retour affectif",
    description: "Récupérez votre bien-aimé(e) grâce à des rituels puissants et authentiques.",
    link: "/rituels-de-retour-affectif",
  },
  {
    icon: <FaCoins className="text-3xl" />,
    title: "Richesses",
    description: "Portefeuille magique, multiplication d'argent, valise magique, calebase magique.",
    link: "/rituels-de-richesses",
  },
  {
    icon: <FaBaby className="text-3xl" />,
    title: "Fertilité",
    description: "Rituels pour favoriser la fertilité et l’épanouissement familial.",
    link: "/rituels-de-fertilite",
  },
  {
    icon: <FaMagic className="text-3xl" />,
    title: "Envoutements",
    description: "Influencez subtilement les situations ou les personnes selon vos besoins.",
    link: "/rituels-de-envoutements",
  },
  {
    icon: <FaGavel className="text-3xl" />,
    title: "Affaire de Justice",
    description: "Obtenez protection et soutien dans vos litiges et affaires judiciaires.",
    link: "/rituels-pour-affaire-de-justice",
  },
  {
    icon: <FaStar className="text-3xl" />,
    title: "Chance",
    description: "Attirez la chance dans tous les aspects de votre vie quotidienne.",
    link: "/rituels-de-chance",
  },
  {
    icon: <FaUsers className="text-3xl" />,
    title: "Attirance clientèle",
    description: "Augmentez l’attractivité et la fidélisation de votre clientèle.",
    link: "/rituels-pour-attirance-clientele",
  },
  {
    icon: <FaProcedures className="text-3xl" />,
    title: "Traitement maladies incurables",
    description: "Rituels et protections pour traiter ou soulager des maladies difficiles.",
    link: "/maladies-incurables",
  },
];
