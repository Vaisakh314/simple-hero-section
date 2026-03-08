import { CaseStudy, BlogPost } from "./types";

export const siteContent = {
  heroTitle: "Building products that make life a little easier and a lot better.",
  heroSubtitle: "Product Manager",
  heroDescription:
    "Find the real problem. Then build the right thing",
  aboutIntro:
    "I am a Product Manager who got into this work because I genuinely like solving problems with people, and 8 years in, that hasn't changed.",
  aboutPhilosophy:
    "I used to think being a good PM meant having all the answers upfront, but it really doesn't. Honestly, the best thing I’ve learned is to just start small on purpose. If you get the simplest, most useful version of an idea out there and pay attention to how people use it, you can use that to decide what’s next. That feedback loop is way more valuable than any long-term roadmap. Most of the time, users show you something you wouldn't have thought of, you just have to get something real in front of them quickly enough to hear it.",
  aboutBackground:
    "I've spent 8+ years building products, just not always with the right job title. The first 4 were as a Co-Founder, bootstrapping an R&D startup in electronics and IoT, delivering projects, and learning product development the hard way. The second 4 years as a PM at Elsys Intelligent Devices Ltd, working across AI automation platforms, EdTech, and a few internal platforms. Different context, More structure. But approach is the same. Find the real problem, build something useful, and keep improving it.",
  aboutDomains: "B2B SaaS · AI Automation · EdTech  · Web & Mobile Apps",
  contactNote:
    "I reply to most messages. If you're working on something interesting or just want to connect, feel free to reach out.",
  email: "mail.jssreehari@gmail.com",
  linkedin: "https://www.linkedin.com/in/connectsreehari/",
  github: "https://github.com/code-with-sreeharijs",
  resumeUrl: "https://drive.google.com/file/d/1r1Wd8DJnW2EpX2e7nS4hUfmZIqY3i1C0/view?usp=sharing",
};

export const identityHighlights = [
  { label: "Execution-first", description: "Ship early, learn fast, iterate." },
  { label: "Data-informed", description: "Decisions backed by evidence, not gut alone." },
  { label: "Customer-obsessed", description: "Every roadmap item traces back to a real user need." },
  { label: "Cross-functional", description: "Bridge between engineering, design, and business." },
];

export const caseStudies: CaseStudy[] = [
{
"id": "1",
"slug": "receptionist-ai-voice-automation",
"title": "Receptionist AI (Voice): Automating the Front Desk Experience",
"summary": "Led the development of a voice-first automation system for SMBs, handling 85% of calls autonomously and reducing human call handling time by 63%.",
"role": "Product Manager",
"company": "Botswork",
"timeframe": "Q2 2025, Q3 2025",
"tags": ["AI", "Voice Automation", "B2B", "SaaS", "Productivity"],
"metrics": [
{ "label": "Automated call handling", "value": "85%" },
{ "label": "Reduction in manual workload", "value": "70,75%" },
{ "label": "Human call handling time reduction", "value": "63%" },
{ "label": "Intent recognition accuracy", "value": "93%" }
],
"context": "For small businesses like clinics and consulting firms, the front desk is the heartbeat of operations. However, with 120 inbound calls daily and limited staff, receptionists were stretched thin, leading to long wait times, dropped calls, and missed revenue after hours. Scaling was hindered by the high cost of hiring additional staff to increase call capacity.",
"problem_and_insights": "Analysis of over 500 customer interactions revealed that most calls were repetitive and time sensitive, such as booking appointments or checking status updates. Specifically, the top 5 to 6 intents accounted for nearly 85% of all call volume. During peak hours, this overload caused direct revenue loss due to missed leads, and there was no sustainable way to scale without automation.",
"solution": "Developed Receptionist AI (Voice), a voice first system designed to handle high volume, low complexity calls. The solution utilized a knowledge base for business queries, calendar synchronization for automated appointment booking, and custom forwarding rules for VIPs or emergencies. A critical design choice was implementing smart routing to ensure complex or emotional calls reached human agents, maintaining empathy where needed.",
"execution": "I led a cross functional team including engineering for telephony and NLP tuning, design for voice flow prototyping in Figma, and operations for business rule definition. We used the RICE framework to prioritize voice intent recognition and smart scheduling. The development process involved iterative mapping of customer interactions and rule based design to ensure the MVP delivered measurable impact from day one.",
"impact": "Within the first month, the AI handled 85% of calls autonomously and improved after hours coverage by 10 to 15 calls per day. Human call handling time dropped from 360 to 132 minutes daily, a 63% reduction. Staff workload decreased by 70 to 75%, allowing them to focus on high value tasks. The system achieved 93% intent recognition and 95% escalation precision, evolving into an always on customer experience engine.",
"reflection": "The success of this project stemmed from balancing automation efficiency with human centered design. By identifying that a vast majority of friction came from repetitive tasks, we could automate the bulk of the work while preserving human intervention for complex cases. This established a scalable model for SMBs to maintain professional front desk operations without linear head count growth."  
},
  {
"id": "2",
"slug": "ai-powered-email-management",
"title": "AI-Powered Email Management for a B2B Sales Team",
"summary": "Led the development of an AI email automation system that reduced daily handling time by 65% and improved response reliability by 80% for sales leadership.",
"role": "Product Manager",
"company": "Botswork",
"timeframe": "Q3 2024 – Q1 2025",
"tags": ["AI", "B2B", "Automation", "Productivity"],
"metrics": [
{ "label": "Email handling time reduction", "value": "65%" },
{ "label": "Response reliability improvement", "value": "80%" },
{ "label": "Spam management efficiency", "value": "100%" }
],
"context": "The internal sales and leadership teams were struggling with extreme email overload, with each representative and the CEO receiving approximately 60 emails daily. This fragmentation and clutter led to inbox exhaustion, buried customer messages, and inconsistent response times that threatened the sales pipeline.",
"problem_and_insights": "Through user research and time audits, I identified that 40% of incoming mail was low-priority noise, and manual drafting consumed 1.6 hours per person daily. Key insights showed that delayed responses (8–10% miss rate) were directly impacting customer relationships. We realized the team didn't just need a cleaner inbox; they needed automated prioritization and drafting to recover high-value selling time.",
"solution": "We developed an AI-driven management system featuring a Unified Inbox and automated categorisation (Important vs. Low-Value). Key product decisions included: (1) implementing AI Reply Drafting to generate editable responses for critical inquiries, (2) integrating automated meeting scheduling to remove manual coordination, and (3) allowing users to refine AI rules to maintain trust and reliability.",
"execution": "As Product Manager, I used the RICE framework to prioritise high-impact automations. I led a cross-functional team through rapid design iterations in Figma and process mapping in Miro. We followed a phased rollout, starting with workflow analysis and moving into AI-driven categorization and drafting modules to validate efficiency gains with internal users.",
"impact": "Daily email handling time dropped from 100 minutes to 35 minutes per user. Spam handling was effectively eliminated, and missed critical emails fell from 10% to under 2%. The automation of meeting scheduling saved an additional 10 minutes daily per user, significantly increasing the team's capacity for high-value sales tasks.",
"reflection": "Competitive research against horizontal tools like Superhuman led us to a strategic pivot. We learned that while horizontal email management is valuable, the highest user stickiness comes from vertical AI agents. This discovery shifted our roadmap toward deeper integrations with CRMs and automated call follow-ups where the automation impact is most profound."
},
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "the-power-of-saying-no",
    title: "The Power of Saying No: A PM's Guide to Prioritization",
    summary:
      "Why the hardest and most valuable skill in product management is knowing what not to build — and how to communicate that effectively.",
    content: `Every product manager faces the same challenge: too many good ideas and not enough capacity to build them all. The difference between great PMs and good ones often comes down to the discipline of saying no.
Early in my career, I treated every stakeholder request as equally important. The result was a bloated roadmap, exhausted engineering teams, and products that tried to do everything but excelled at nothing. I learned the hard way that prioritization isn't about ranking features — it's about making explicit bets on outcomes.
Here's the framework I use today:
First, start with outcomes, not outputs. Instead of asking "what should we build?", ask "what behavior change are we trying to drive?" This shifts the conversation from feature debates to impact discussions. When a stakeholder requests a feature, I ask them to articulate the outcome they expect. Often, there are simpler ways to achieve the same result.
Second, use a simple scoring system that the team understands. I've tried RICE, ICE, and weighted scoring. They all work. The key is consistency and transparency. When everyone can see why something was prioritized, disagreements become productive conversations rather than political battles.
Third, communicate the trade-off explicitly. Don't just say no — say "if we build X, we won't be able to build Y this quarter." Making the cost visible turns an emotional conversation into a strategic one.
The most important thing I've learned: saying no to a good idea doesn't mean it's a bad idea. It means there's a better use of our limited time and energy right now. The best PMs I know are comfortable with that tension.`,
    publish_date: "2024-12-15",
    tags: ["Prioritization", "Product Strategy", "Leadership"],
    read_time: "5 min read",
  },
  {
    id: "2",
    slug: "discovery-is-not-optional",
    title: "Discovery Is Not Optional: Why Research Matters More Than You Think",
    summary:
      "How investing in continuous discovery transformed my approach to building products — and why skipping it is the most expensive mistake a PM can make.",
    content: `I used to think product discovery was a luxury — something you did when you had time between shipping features. I was wrong. Discovery is the foundation that determines whether everything you build will matter or be wasted effort.
The turning point came when I spent three months building a feature that our sales team was convinced customers needed. We shipped it, celebrated, and then watched as adoption flatlined at 4%. When I finally talked to users, I discovered they'd been asking for something entirely different — the sales team had translated "I need better reporting" into a specific feature that solved the wrong problem.
That experience taught me three principles I now follow religiously:
Talk to users every week. Not quarterly. Not when you're starting a new project. Every single week. Even 30 minutes of user conversation gives you more signal than hours of debating in a conference room. I block 2 hours weekly for user calls and protect that time fiercely.
Separate the problem from the solution. Users are experts on their problems but not on solutions. When a user says "I want a dashboard," what they really mean is "I can't find the information I need quickly." Understanding the underlying need opens up solution spaces you'd never consider otherwise.
Validate before you invest. The cheapest way to test an idea is a conversation. The next cheapest is a prototype. The most expensive is building the real thing. Yet most teams default to building first and validating later. I now require every feature on our roadmap to have evidence from at least 5 user conversations or clear data signals before it gets engineering time.
Discovery isn't a phase — it's a continuous practice. The best product teams I've worked with treat it like a habit, not a project. And the results speak for themselves: fewer pivots, higher adoption rates, and engineers who trust that what they're building actually matters.`,
    publish_date: "2024-11-02",
    tags: ["Discovery", "User Research", "Product Process"],
    read_time: "6 min read",
  },
  {
    id: "3",
    slug: "metrics-that-matter",
    title: "Metrics That Matter: Moving Beyond Vanity Numbers",
    summary:
      "A practical guide to choosing metrics that actually drive product decisions — and why most teams are measuring the wrong things.",
    content: `Last year I inherited a product dashboard with 47 metrics. The team tracked everything from page views to button clicks to time-on-page. They had more data than they knew what to do with — and yet, they couldn't answer the most basic question: is the product getting better?
This is the vanity metrics trap. We measure what's easy to measure, not what's meaningful. Page views go up? Great. But are users actually getting value? Are they coming back? Are they achieving their goals?
Here's how I approach metrics now:
Start with your North Star. Every product should have one metric that captures the core value you deliver to users. For a project management tool, it might be "tasks completed per active user per week." For a marketplace, it might be "successful transactions." This metric should be leading (not lagging), actionable (the team can influence it), and connected to business outcomes.
Build an input-output model. Your North Star is the output. What inputs drive it? Map the user journey and identify the key moments that predict long-term engagement. These become your input metrics — the levers your team can pull. For example, if your North Star is weekly active users, your inputs might be "completed onboarding," "invited a teammate," and "created their first project."
Set thresholds, not targets. Instead of saying "increase activation by 10%," define what good looks like. "We believe that users who complete 3 key actions in their first week will retain at 2× the rate of those who don't." This gives the team a clear, testable hypothesis rather than an arbitrary number.
Review metrics weekly, but decide monthly. Weekly reviews keep the team aware of trends. Monthly reviews are for making strategic decisions. This rhythm prevents over-reacting to noise while staying responsive to real signals.
The best metric frameworks I've seen share one trait: they're simple enough that everyone on the team — engineers, designers, marketers — can explain them. If your metrics require a data science degree to understand, they're not driving decisions. They're just decoration.`,
    publish_date: "2024-09-20",
    tags: ["Metrics", "Analytics", "Product Strategy"],
    read_time: "5 min read",
  },
];

export const resumeSections = {
  experience: [
{
title: "Product Manager",
company: "Elsys Intelligent Devices Ltd.",
period: "August 2021 – Present",
highlights: [
"Owned the product roadmap and release planning for an AI automation platform for 200+ SMB clients, launching 4 core modules that reduced manual task load by ~50%.",
"Redesigned onboarding flow through user research and A/B testing, cutting time-to-value from 10 days to 4 days and increasing NPS from 30 to 55.",
"Grew EdTech language learning platform from 0 to 50K registered users and optimised CMS workflows to decrease lesson-publishing time from 45 min to under 10 min.",
],
},
{
title: "Co-founder & CEO",
company: "Enbrid Biotech Pvt. Ltd.",
period: "September 2017 – July 2021",
highlights: [
"Founded and scaled a bootstrapped R&D startup in electronics and IoT, sustaining ~58% average annual revenue growth over four years.",
"Drove end-to-end development for 12+ solutions, including smart wheelchairs and warehouse robots, managing 100+ stakeholder relationships.",
"Delivered 40+ projects while managing full product lifecycles, establishing the foundation for a transition into structured Product Management.",
],
},
],
education: [
{
degree: "Bachelor of Technology (B.Tech)",
school: "Kerala University, Thiruvananthapuram",
year: "2017",
},
],
skills: [
"Product Discovery & Roadmap Prioritisation",
"Backlog Ownership & User Story Writing",
"Sprint & Releases Planning",
"Stakeholder Management & OKRs",
"A/B Testing & Product Analytics",
"User Research & Usability Testing",
"Go-To-Market Strategy & MVP Scoping",
"Agile/Scrum Ceremonies",
],
tools: [
"Jira",
"ClickUp",
"Power BI",
"SQL",
"Lovable.dev",
],
};
