export interface ServiceData {
  slug: string;
  name: string;
  image: string;
  keyBenefits: string[];
  heading: string;
  desc1: string;
  desc2: string;
}

export const servicesData: ServiceData[] = [
  {
    slug: "ant-control",
    name: "Ant Control",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80",
    keyBenefits: [
      "Eliminates existing ant colonies effectively",
      "Targets the source to prevent re-infestation.",
      "Safe and eco-friendly treatment methods",
      "Suitable for homes, offices and commercial spaces.",
    ],
    heading: "Ant Control",
    desc1:
      "Ants can invade your home or workplace quickly, searching for food and nesting in small cracks and hidden areas. Our professional ant control solutions identify the source of the infestation and eliminate colonies using safe, eco-friendly, and long-lasting treatment methods.",
    desc2:
      "We ensure a clean, hygienic, and ant-free environment for your family or business. Whether it's a small indoor issue or a large-scale infestation, our team provides effective solutions tailored to your property's needs.",
  },
  {
    slug: "bed-bug-control",
    name: "Bed Bug Control",
    image: "/bedbug.webp",
    keyBenefits: [
      "Complete elimination of bed bugs and their eggs",
      "Deep heat and chemical eco-treatments",
      "Safe for bedding, mattresses, and furniture",
      "Prevents recurring sleepless nights and bites",
    ],
    heading: "Bed Bug Control",
    desc1:
      "Bed bugs hide in mattress seams, bed frames, and baseboards, causing sleepless nights and uncomfortable bites. Our specialized bed bug treatments penetrate deep into crevices to eliminate bugs at all life stages.",
    desc2:
      "We use hospital-grade, eco-conscious treatment protocols that are non-hazardous to your health while guaranteeing long-term relief.",
  },
  {
    slug: "cockroach-control",
    name: "Cockroach Control",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    keyBenefits: [
      "Advanced gel baiting and spray solutions",
      "Disrupts cockroach reproduction cycles",
      "Targets drains, kitchens, and pantries",
      "Odourless and food-grade safe chemicals",
    ],
    heading: "Cockroach Control",
    desc1:
      "Cockroaches contaminate food and spread harmful bacteria. Our targeted gel baiting and barrier spray systems effectively flush out hiding colonies behind appliances and drainage lines.",
    desc2:
      "With routine inspections and residual sprays, we protect kitchens and pantries from re-infestation without interrupting your daily schedule.",
  },
  {
    slug: "mosquito-control",
    name: "Mosquito Control",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    keyBenefits: [
      "Thermal fogging and larvicidal treatments",
      "Drastic reduction of dengue and malaria risk",
      "Outdoor perimeter and stagnant water treatment",
      "Long-lasting barrier against adult mosquitoes",
    ],
    heading: "Mosquito Control",
    desc1:
      "Mosquitoes breed rapidly in stagnant water around homes and offices, posing health risks. Our misting and thermal fogging eliminate adult mosquitoes instantly while treating breeding spots.",
    desc2:
      "We provide seasonal protection packages designed to keep open gardens, society lawns, and indoor spaces safe for families and staff.",
  },
  {
    slug: "rodent-control",
    name: "Rodent Control",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    keyBenefits: [
      "Tamper-proof bait stations and trap placement",
      "Entry point sealing and exclusion advice",
      "Protects wires and structural cabling",
      "Hygienic carcass removal and deodorization",
    ],
    heading: "Rodent Control",
    desc1:
      "Rats and mice chew through electrical wiring, damage structures, and transmit diseases. Our multi-tier rodent control incorporates inspection, baiting stations, and entry exclusion.",
    desc2:
      "Our technicians locate burrow holes and roof access channels, sealing them to prevent rodents from returning.",
  },
  {
    slug: "termite-control",
    name: "Termite Control",
    image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?auto=format&fit=crop&w=1200&q=80",
    keyBenefits: [
      "Pre-construction and post-construction drilling",
      "Protects wooden furniture and structural foundations",
      "Certified termiticide with warranty coverage",
      "Subterranean perimeter chemical barrier",
    ],
    heading: "Termite Control",
    desc1:
      "Termites silently destroy wooden fixtures, flooring, and wall structures from the inside. Our drills and pressure injectors infuse specialized termiticide directly into subterranean tunnels.",
    desc2:
      "We provide multi-year warranty certifications on complete home and commercial termite barrier installations.",
  },
];