import { CaseStudy, BlogPost } from "./types";

export const siteContent = {
  heroTitle: "Designing mechanical products that solve real-world problems.",
  heroSubtitle: "Mechanical Product Designer",
  heroDescription:
    "From concept sketches to production-ready designs — engineering form, function, and manufacturability.",
  aboutIntro:
    "I'm a Mechanical Product Designer with 8+ years of experience turning ideas into manufactured products. I work at the intersection of engineering, industrial design, and manufacturing — making sure things don't just look good on paper but actually work in the real world.",
  aboutPhilosophy:
    "Good product design isn't about over-engineering — it's about finding the simplest solution that meets every constraint. I start with the end user and work backwards through materials, tolerances, and manufacturing processes. Prototyping early and often has saved me more time than any simulation ever could. I believe the best designs come from understanding the factory floor as well as the user's hands.",
  aboutBackground:
    "I started my career as a design engineer working on consumer electronics enclosures and industrial equipment. Over the years I've moved into full product ownership — leading projects from initial concept through DFM, tooling, and mass production. I've worked across industries including consumer goods, medical devices, automotive components, and industrial machinery.",
  aboutDomains: "Consumer Products · Medical Devices · Automotive · Industrial Equipment · IoT Hardware",
  contactNote:
    "Open to freelance projects, consulting, and full-time opportunities. If you have a product that needs designing or improving, let's talk.",
  email: "hello@example.com",
  linkedin: "https://linkedin.com/in/yourhandle",
  github: "https://github.com/yourhandle",
  resumeUrl: "",
};

export const identityHighlights = [
  { label: "Design for Manufacturing", description: "Every design ships production-ready from day one." },
  { label: "Prototype-driven", description: "Test early with physical models, not just simulations." },
  { label: "Material-conscious", description: "Right material, right process, right cost." },
  { label: "Cross-disciplinary", description: "Bridging mechanical, electrical, and industrial design." },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "ergonomic-power-tool-redesign",
    title: "Ergonomic Power Tool Redesign: Reducing Operator Fatigue by 40%",
    summary: "Led the mechanical redesign of a handheld industrial power tool, improving grip ergonomics, reducing vibration transfer, and cutting operator fatigue reports by 40%.",
    role: "Lead Product Designer",
    company: "ToolWorks Engineering",
    timeframe: "Q1 2024 – Q3 2024",
    tags: ["Mechanical Design", "Ergonomics", "DFM", "Industrial", "Injection Molding"],
    metrics: [
      { label: "Reduction in fatigue reports", value: "40%" },
      { label: "Vibration reduction", value: "35%" },
      { label: "Unit cost reduction", value: "12%" },
      { label: "Assembly time improvement", value: "25%" },
    ],
    context: "The existing power tool had been in production for 6 years with growing complaints about operator fatigue during extended use. Field reports showed grip discomfort, excessive vibration, and difficulty accessing controls with gloved hands — all contributing to lower productivity on manufacturing floors.",
    problem_and_insights: "Teardown analysis and user observation sessions revealed three root causes: a cylindrical grip that forced unnatural wrist angles, rigid mounting of the motor housing that transmitted vibration directly to the handle, and a trigger mechanism requiring excessive force. Anthropometric data from 50+ operators confirmed the grip diameter was 8mm too large for the 25th percentile hand.",
    solution: "Redesigned the tool housing with a contoured overmold grip shaped around anthropometric data, integrated a vibration-dampening elastomer layer between the motor housing and handle, and replaced the trigger with a lower-force mechanism. All changes were designed for the existing injection molding tooling with minimal modifications.",
    execution: "Created 12 SLA prototypes for ergonomic testing, ran FEA on the dampening mount to validate vibration isolation, and worked directly with the tooling vendor to modify existing molds. Used GD&T to ensure all new components met assembly tolerances within the current production line.",
    impact: "Operator fatigue complaints dropped 40% in the first quarter after launch. Vibration at the handle decreased 35% (measured via accelerometer testing). The redesign also simplified the BOM, reducing unit cost by 12% and cutting assembly time by 25% through snap-fit integration.",
    reflection: "The biggest lesson was that small ergonomic changes — a few millimeters of grip contour, a thin elastomer layer — can have outsized impact on user experience. Spending time on the factory floor watching operators use the tool was more valuable than any CAD simulation.",
  },
  {
    id: "2",
    slug: "medical-device-enclosure-design",
    title: "Compact Medical Device Enclosure: IP67 in a 30% Smaller Form Factor",
    summary: "Designed a sealed enclosure for a portable diagnostic device, achieving IP67 rating while reducing overall volume by 30% through integrated structural-thermal design.",
    role: "Mechanical Design Engineer",
    company: "MedTech Solutions",
    timeframe: "Q2 2023 – Q4 2023",
    tags: ["Medical Device", "Enclosure Design", "IP67", "Thermal Management", "Sheet Metal"],
    metrics: [
      { label: "Volume reduction", value: "30%" },
      { label: "Thermal performance improvement", value: "20%" },
      { label: "Sealing certification", value: "IP67" },
      { label: "Parts count reduction", value: "18 fewer parts" },
    ],
    context: "The client needed a portable diagnostic unit for field use in remote healthcare settings. The previous generation was too bulky for single-hand carry, had thermal throttling issues in hot climates, and failed IP65 water ingress testing during field trials.",
    problem_and_insights: "Thermal analysis showed the original design relied on passive convection through vents — incompatible with sealing requirements. The internal layout wasted 35% of enclosure volume with redundant brackets and cable routing. A sealed design required rethinking both thermal management and structural support simultaneously.",
    solution: "Designed a die-cast aluminum enclosure with integrated heat sink fins that doubled as structural ribs. Used gasket-sealed interfaces with compression-controlled fastener patterns. Consolidated 18 internal brackets into 4 multi-function structural elements. Thermal path was redesigned to conduct heat from PCB hot spots directly to the enclosure walls.",
    execution: "Ran thermal simulations in ANSYS to validate heat dissipation at 45°C ambient. Prototyped with CNC-machined aluminum for IP67 testing. Worked with the die-casting vendor to optimize draft angles and wall thickness for production. Coordinated with the electronics team on PCB layout changes to align thermal pads with conduction paths.",
    impact: "Achieved IP67 certification on first submission. Enclosure volume reduced 30% while improving thermal headroom by 20%. The consolidated BOM reduced assembly time and eliminated 18 parts, saving $8.50 per unit at production volumes of 10K/year.",
    reflection: "This project reinforced that mechanical and thermal design can't be done in isolation. By treating the enclosure as both a structural element and a heat sink from the start, we avoided the typical late-stage thermal band-aids that add cost and bulk.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "dfm-mistakes-engineers-make",
    title: "5 DFM Mistakes I See Engineers Make (And How to Avoid Them)",
    summary:
      "Common design-for-manufacturing pitfalls that add cost, delay production, and frustrate tooling vendors — from wall thickness to draft angles.",
    content: `After reviewing hundreds of designs headed for injection molding, sheet metal, and die casting, I've noticed the same mistakes coming up again and again. Here are the five that cost teams the most time and money.

1. Ignoring draft angles until tooling review. Adding draft is not optional for molded parts — it's a fundamental design constraint. I've seen teams redesign entire housings because they designed with zero draft and couldn't pull the part from the mold. Add 1-2° of draft from your very first sketch.

2. Uniform wall thickness is a myth — but consistency matters. You don't need every wall to be exactly the same, but dramatic thickness transitions cause sink marks, warping, and long cycle times. Use coring and ribs to maintain stiffness without thick sections.

3. Over-tolerancing everything. Not every dimension needs ±0.05mm. Tight tolerances cost money — in tooling, inspection, and scrap rates. Be deliberate: tolerance the interfaces that matter and leave the rest at standard.

4. Designing in isolation from the assembly process. A beautifully engineered part that takes 45 seconds to orient and insert is a production nightmare. Think about how hands (or fixtures) will hold, align, and fasten your part. Snap-fits, self-locating features, and poka-yoke geometry save more money than any material optimization.

5. Not talking to your tooling vendor early enough. The best DFM feedback comes from the people who will actually build your mold or cut your sheet. Bring them in during concept design, not after you've frozen the CAD. A 15-minute call can save weeks of redesign.`,
    publish_date: "2024-12-10",
    tags: ["DFM", "Manufacturing", "Injection Molding", "Engineering"],
    read_time: "5 min read",
  },
  {
    id: "2",
    slug: "prototyping-physical-products",
    title: "Why I Prototype Everything — Even When the Simulation Says It Works",
    summary:
      "Simulations are powerful but they can't replace putting a physical part in your hands. Here's my approach to rapid prototyping in mechanical design.",
    content: `FEA says the part won't fail. Thermal simulation shows adequate cooling. Tolerance stack-up analysis confirms everything fits. So why do I still prototype?

Because simulations model physics, not reality. They don't capture the feel of a latch that's technically strong enough but too stiff for a user to open. They don't show you that the cable routing you planned in CAD requires hands smaller than any adult has. They don't reveal that the surface finish spec you chose shows every fingerprint.

My prototyping philosophy is simple: make it real as early as possible, at the lowest cost that still answers your question.

For form and ergonomics, I use FDM prints. They're fast, cheap, and good enough to hold, grip, and test interfaces. I don't need accurate material properties — I need to know if the shape works in human hands.

For fit and assembly, I use SLA or MJF. Tighter tolerances let me test snap-fits, interference fits, and multi-part assemblies. I've caught clearance issues at this stage that would have been expensive to fix in tooling.

For function, I get CNC-machined parts in the actual production material. This is the only way to validate strength, thermal behavior, and surface finish. It costs more, but it's still cheaper than modifying a $40K injection mold.

The key is matching the prototype method to the question you're trying to answer. Don't CNC-machine a part just to check if it fits in someone's hand, and don't 3D print a part to validate fatigue life.

Every prototype I make comes with a specific hypothesis: "I believe this grip angle will reduce wrist strain" or "I expect this snap-fit to survive 500 cycles." If I can't state the hypothesis, I probably don't need the prototype yet.`,
    publish_date: "2024-11-05",
    tags: ["Prototyping", "3D Printing", "CNC", "Design Process"],
    read_time: "6 min read",
  },
  {
    id: "3",
    slug: "choosing-right-material",
    title: "Material Selection Is a Design Decision, Not an Afterthought",
    summary:
      "How picking the right material early in the design process saves cost, improves performance, and avoids late-stage redesigns.",
    content: `I've lost count of how many times I've seen a project hit a wall because material selection was left to the end. The design is done, the CAD is frozen, and then someone realizes the chosen plastic can't handle the operating temperature, or the aluminum alloy won't meet the fatigue requirements.

Material selection is a design decision. It should happen alongside geometry, not after it. Here's how I approach it:

Start with constraints, not preferences. What temperature range does the part see? What chemicals will it contact? What are the load conditions? What's the target cost per unit? These constraints immediately narrow your options from thousands of materials to a manageable shortlist.

Consider the manufacturing process alongside the material. ABS is great for injection molding but terrible for CNC machining. 6061 aluminum is easy to machine but harder to die-cast than A380. The material and process are inseparable — choosing one constrains the other.

Don't optimize for one property at the expense of everything else. I've seen designs fail because someone chose the strongest material without considering its machinability, cost, or availability. The best material is the one that satisfies all requirements adequately, not the one that excels at one metric.

Use material databases, but verify with testing. Tools like MatWeb, Granta, and CES EduPack are excellent starting points. But published data sheets show ideal conditions. Real-world performance depends on processing, geometry, and environment. When in doubt, test a sample.

Build relationships with material suppliers. They know things that don't show up in data sheets — processing quirks, batch variability, lead times, and cost trends. A good supplier relationship is as valuable as a good tooling vendor relationship.

The most expensive material change is the one you make after tooling. Getting it right early is one of the highest-leverage decisions in product design.`,
    publish_date: "2024-09-18",
    tags: ["Materials", "Engineering", "Design Process", "Manufacturing"],
    read_time: "5 min read",
  },
];

export const resumeSections = {
  experience: [
    {
      title: "Senior Mechanical Product Designer",
      company: "DesignWorks Engineering",
      period: "March 2021 – Present",
      highlights: [
        "Lead mechanical design for consumer and industrial products from concept through mass production, managing 5+ concurrent projects.",
        "Reduced average product development cycle by 30% through early-stage DFM reviews and integrated prototyping workflows.",
        "Designed IP67-rated enclosures and thermal management systems for IoT and medical device applications.",
      ],
    },
    {
      title: "Mechanical Design Engineer",
      company: "Precision Products Ltd.",
      period: "June 2017 – February 2021",
      highlights: [
        "Owned detailed mechanical design for injection-molded housings, sheet metal assemblies, and CNC-machined components.",
        "Conducted GD&T, tolerance stack-up analysis, and FEA for structural and thermal validation.",
        "Collaborated with tooling vendors to optimize mold designs, reducing unit costs by 15% across 8 product lines.",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology in Mechanical Engineering",
      school: "Kerala University, Thiruvananthapuram",
      year: "2017",
    },
  ],
  skills: [
    "3D CAD Modeling & Surfacing",
    "Design for Manufacturing (DFM/DFA)",
    "GD&T & Tolerance Analysis",
    "FEA (Structural & Thermal)",
    "Prototyping (FDM, SLA, CNC)",
    "Injection Molding & Sheet Metal Design",
    "Thermal Management & Enclosure Design",
    "Material Selection & Testing",
  ],
  tools: [
    "SolidWorks",
    "CATIA",
    "ANSYS",
    "KeyShot",
    "AutoCAD",
    "Fusion 360",
  ],
};
