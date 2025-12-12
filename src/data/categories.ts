import type { Category } from "../types/content";

export const categories: Category[] = [
  {
    id: "tech-startups",
    name: "Tech & Startups",
    icon: "💻",
    shows: [
      { id: "ts1", title: "How I Built This", host: "Guy Raz", thumbnail: "/thumbnails/hibt.jpg", description: "Stories behind successful companies" },
      { id: "ts2", title: "The Tim Ferriss Show", host: "Tim Ferriss", thumbnail: "/thumbnails/ferriss.jpg", description: "World-class performers share tactics" },
      { id: "ts3", title: "Acquired", host: "Ben & David", thumbnail: "/thumbnails/acquired.jpg", description: "The playbook behind great companies" },
    ],
    clips: [
      { id: "tc1", title: "Why most startups fail in year two", showId: "ts1", showTitle: "How I Built This", host: "Guy Raz", thumbnail: "/thumbnails/hibt.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 87, claim: "The second year is when most founders give up", quote: "Year one you're running on adrenaline. Year two, reality sets in.", tags: ["startups", "tactical"] },
      { id: "tc2", title: "The 4-hour work week myth", showId: "ts2", showTitle: "The Tim Ferriss Show", host: "Tim Ferriss", thumbnail: "/thumbnails/ferriss.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 124, claim: "It's not about working less, it's about leverage", quote: "The goal isn't fewer hours. It's more output per hour of your actual attention.", tags: ["productivity", "contrarian"] },
      { id: "tc3", title: "How Nvidia pivoted to AI", showId: "ts3", showTitle: "Acquired", host: "Ben & David", thumbnail: "/thumbnails/acquired.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 156, claim: "Nvidia's gaming roots enabled their AI dominance", quote: "Every gaming GPU they sold was training wheels for the AI revolution.", tags: ["tech", "story"] },
    ],
  },
  {
    id: "business-finance",
    name: "Business & Finance",
    icon: "📈",
    shows: [
      { id: "bf1", title: "Planet Money", host: "NPR", thumbnail: "/thumbnails/planetmoney.jpg", description: "The economy, explained" },
      { id: "bf2", title: "The Indicator", host: "NPR", thumbnail: "/thumbnails/indicator.jpg", description: "Daily economic stories" },
      { id: "bf3", title: "Invest Like the Best", host: "Patrick O'Shaughnessy", thumbnail: "/thumbnails/iltb.jpg", description: "Conversations with investors" },
    ],
    clips: [
      { id: "bc1", title: "Why inflation feels worse than the numbers", showId: "bf1", showTitle: "Planet Money", host: "NPR", thumbnail: "/thumbnails/planetmoney.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 95, claim: "CPI doesn't capture what you actually buy", quote: "The basket of goods hasn't changed, but your shopping cart has.", tags: ["economics", "tactical"] },
      { id: "bc2", title: "The coffee index explained", showId: "bf2", showTitle: "The Indicator", host: "NPR", thumbnail: "/thumbnails/indicator.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 78, claim: "Coffee prices predict recessions better than experts", quote: "When coffee consumption drops, a recession is 6 months away.", tags: ["economics", "contrarian"] },
      { id: "bc3", title: "Compounding is counterintuitive", showId: "bf3", showTitle: "Invest Like the Best", host: "Patrick O'Shaughnessy", thumbnail: "/thumbnails/iltb.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 112, claim: "Most wealth is built after age 50", quote: "Warren Buffett made 99% of his wealth after his 50th birthday.", tags: ["investing", "philosophical"] },
    ],
  },
  {
    id: "science-nature",
    name: "Science & Nature",
    icon: "🔬",
    shows: [
      { id: "sn1", title: "Radiolab", host: "Lulu Miller", thumbnail: "/thumbnails/radiolab.jpg", description: "Investigating big questions" },
      { id: "sn2", title: "Ologies", host: "Alie Ward", thumbnail: "/thumbnails/ologies.jpg", description: "Interviews with scientists" },
      { id: "sn3", title: "StarTalk", host: "Neil deGrasse Tyson", thumbnail: "/thumbnails/startalk.jpg", description: "Science meets pop culture" },
    ],
    clips: [
      { id: "sc1", title: "Why we dream in stories", showId: "sn1", showTitle: "Radiolab", host: "Lulu Miller", thumbnail: "/thumbnails/radiolab.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 143, claim: "Dreams are your brain rehearsing survival scenarios", quote: "Every nightmare is a fire drill for your nervous system.", tags: ["neuroscience", "philosophical"] },
      { id: "sc2", title: "The fungal internet", showId: "sn2", showTitle: "Ologies", host: "Alie Ward", thumbnail: "/thumbnails/ologies.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 98, claim: "Trees communicate through underground fungal networks", quote: "A forest is one organism pretending to be many.", tags: ["biology", "story"] },
      { id: "sc3", title: "Black holes aren't holes", showId: "sn3", showTitle: "StarTalk", host: "Neil deGrasse Tyson", thumbnail: "/thumbnails/startalk.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 87, claim: "Black holes are objects, not voids", quote: "They're the densest objects in the universe. The opposite of nothing.", tags: ["astrophysics", "contrarian"] },
    ],
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    icon: "💪",
    shows: [
      { id: "hf1", title: "Huberman Lab", host: "Andrew Huberman", thumbnail: "/thumbnails/huberman.jpg", description: "Neuroscience-based health" },
      { id: "hf2", title: "Found My Fitness", host: "Rhonda Patrick", thumbnail: "/thumbnails/fmf.jpg", description: "Deep dives into health science" },
      { id: "hf3", title: "The Drive", host: "Peter Attia", thumbnail: "/thumbnails/drive.jpg", description: "Longevity and performance" },
    ],
    clips: [
      { id: "hc1", title: "Morning sunlight changes everything", showId: "hf1", showTitle: "Huberman Lab", host: "Andrew Huberman", thumbnail: "/thumbnails/huberman.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 156, claim: "10 minutes of morning sun sets your entire circadian rhythm", quote: "It's the cheapest, most effective intervention we have.", tags: ["health", "tactical"] },
      { id: "hc2", title: "Why cold showers work", showId: "hf2", showTitle: "Found My Fitness", host: "Rhonda Patrick", thumbnail: "/thumbnails/fmf.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 134, claim: "Cold exposure increases dopamine by 250%", quote: "Two minutes of cold water gives you a mood boost that lasts hours.", tags: ["health", "tactical"] },
      { id: "hc3", title: "Zone 2 cardio is underrated", showId: "hf3", showTitle: "The Drive", host: "Peter Attia", thumbnail: "/thumbnails/drive.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 167, claim: "Low intensity exercise builds the base for everything", quote: "You can't out-HIIT a bad aerobic base.", tags: ["fitness", "contrarian"] },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "📜",
    shows: [
      { id: "h1", title: "Hardcore History", host: "Dan Carlin", thumbnail: "/thumbnails/hardcore.jpg", description: "Epic historical narratives" },
      { id: "h2", title: "Revolutions", host: "Mike Duncan", thumbnail: "/thumbnails/revolutions.jpg", description: "The history of revolutions" },
      { id: "h3", title: "The Rest Is History", host: "Tom & Dominic", thumbnail: "/thumbnails/trih.jpg", description: "History made entertaining" },
    ],
    clips: [
      { id: "hic1", title: "Why Rome really fell", showId: "h1", showTitle: "Hardcore History", host: "Dan Carlin", thumbnail: "/thumbnails/hardcore.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 198, claim: "Rome didn't fall—it transformed", quote: "The barbarians didn't destroy Rome. They became it.", tags: ["history", "contrarian"] },
      { id: "hic2", title: "The French Revolution's real cause", showId: "h2", showTitle: "Revolutions", host: "Mike Duncan", thumbnail: "/thumbnails/revolutions.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 145, claim: "Bad harvests caused the French Revolution", quote: "Bread prices doubled. That's when heads rolled.", tags: ["history", "story"] },
      { id: "hic3", title: "Cleopatra spoke 9 languages", showId: "h3", showTitle: "The Rest Is History", host: "Tom & Dominic", thumbnail: "/thumbnails/trih.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 87, claim: "Cleopatra was a polyglot genius, not just a seductress", quote: "She was the first Ptolemy to bother learning Egyptian.", tags: ["history", "story"] },
    ],
  },
  {
    id: "true-crime",
    name: "True Crime",
    icon: "🔍",
    shows: [
      { id: "tc1", title: "Serial", host: "Sarah Koenig", thumbnail: "/thumbnails/serial.jpg", description: "Investigative journalism" },
      { id: "tc2", title: "Crime Junkie", host: "Ashley Flowers", thumbnail: "/thumbnails/crimejunkie.jpg", description: "Weekly true crime stories" },
      { id: "tc3", title: "Casefile", host: "Anonymous", thumbnail: "/thumbnails/casefile.jpg", description: "Fact-based true crime" },
    ],
    clips: [
      { id: "tcc1", title: "Why witnesses get it wrong", showId: "tc1", showTitle: "Serial", host: "Sarah Koenig", thumbnail: "/thumbnails/serial.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 134, claim: "Memory is reconstructed, not recorded", quote: "Every time you remember, you're rewriting the story.", tags: ["psychology", "philosophical"] },
      { id: "tcc2", title: "The neighbor is usually right", showId: "tc2", showTitle: "Crime Junkie", host: "Ashley Flowers", thumbnail: "/thumbnails/crimejunkie.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 98, claim: "Neighbors spot danger before police do", quote: "Trust your gut when something feels off next door.", tags: ["crime", "tactical"] },
      { id: "tcc3", title: "Digital forensics changed everything", showId: "tc3", showTitle: "Casefile", host: "Anonymous", thumbnail: "/thumbnails/casefile.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 112, claim: "Your phone knows where you were", quote: "Cell tower data doesn't lie. Alibis do.", tags: ["crime", "tactical"] },
    ],
  },
  {
    id: "comedy",
    name: "Comedy",
    icon: "😂",
    shows: [
      { id: "c1", title: "Conan O'Brien Needs a Friend", host: "Conan O'Brien", thumbnail: "/thumbnails/conan.jpg", description: "Conversations with comedians" },
      { id: "c2", title: "Smartless", host: "Bateman, Arnett, Hayes", thumbnail: "/thumbnails/smartless.jpg", description: "Celebrity interviews with laughs" },
      { id: "c3", title: "WTF with Marc Maron", host: "Marc Maron", thumbnail: "/thumbnails/wtf.jpg", description: "Raw, honest conversations" },
    ],
    clips: [
      { id: "cc1", title: "Comedy is tragedy plus time", showId: "c1", showTitle: "Conan O'Brien Needs a Friend", host: "Conan O'Brien", thumbnail: "/thumbnails/conan.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 76, claim: "The best jokes come from pain", quote: "If it didn't hurt, it won't be funny.", tags: ["comedy", "philosophical"] },
      { id: "cc2", title: "Why improv skills transfer everywhere", showId: "c2", showTitle: "Smartless", host: "Bateman, Arnett, Hayes", thumbnail: "/thumbnails/smartless.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 89, claim: "Yes-and is the secret to collaboration", quote: "Blocking kills scenes. And meetings. And relationships.", tags: ["comedy", "tactical"] },
      { id: "cc3", title: "The anxiety behind the mic", showId: "c3", showTitle: "WTF with Marc Maron", host: "Marc Maron", thumbnail: "/thumbnails/wtf.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 145, claim: "Every comedian is running from something", quote: "Stand-up is therapy where strangers pay to watch.", tags: ["comedy", "story"] },
    ],
  },
  {
    id: "self-improvement",
    name: "Self-Improvement",
    icon: "🎯",
    shows: [
      { id: "si1", title: "The Knowledge Project", host: "Shane Parrish", thumbnail: "/thumbnails/tkp.jpg", description: "Mental models for life" },
      { id: "si2", title: "Impact Theory", host: "Tom Bilyeu", thumbnail: "/thumbnails/impact.jpg", description: "Mindset and success" },
      { id: "si3", title: "The School of Greatness", host: "Lewis Howes", thumbnail: "/thumbnails/sog.jpg", description: "Stories of achievement" },
    ],
    clips: [
      { id: "sic1", title: "First principles thinking explained", showId: "si1", showTitle: "The Knowledge Project", host: "Shane Parrish", thumbnail: "/thumbnails/tkp.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 134, claim: "Break problems down to their fundamental truths", quote: "Most people optimize within existing constraints. Few question the constraints.", tags: ["thinking", "tactical"] },
      { id: "sic2", title: "Your identity is holding you back", showId: "si2", showTitle: "Impact Theory", host: "Tom Bilyeu", thumbnail: "/thumbnails/impact.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 156, claim: "Who you think you are limits what you can become", quote: "The story you tell yourself becomes the ceiling you hit.", tags: ["mindset", "philosophical"] },
      { id: "sic3", title: "Morning routines are overrated", showId: "si3", showTitle: "The School of Greatness", host: "Lewis Howes", thumbnail: "/thumbnails/sog.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 98, claim: "Energy management beats time management", quote: "It's not when you work. It's whether you're actually present.", tags: ["productivity", "contrarian"] },
    ],
  },
  {
    id: "news-politics",
    name: "News & Politics",
    icon: "🗳️",
    shows: [
      { id: "np1", title: "The Daily", host: "Michael Barbaro", thumbnail: "/thumbnails/daily.jpg", description: "Daily news from the NYT" },
      { id: "np2", title: "Pod Save America", host: "Crooked Media", thumbnail: "/thumbnails/psa.jpg", description: "Political commentary" },
      { id: "np3", title: "The Weeds", host: "Vox", thumbnail: "/thumbnails/weeds.jpg", description: "Policy deep dives" },
    ],
    clips: [
      { id: "npc1", title: "Why polls keep getting it wrong", showId: "np1", showTitle: "The Daily", host: "Michael Barbaro", thumbnail: "/thumbnails/daily.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 145, claim: "Response rates have collapsed", quote: "We used to get 30% of people to answer. Now it's 3%.", tags: ["politics", "story"] },
      { id: "npc2", title: "The filibuster explained", showId: "np2", showTitle: "Pod Save America", host: "Crooked Media", thumbnail: "/thumbnails/psa.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 112, claim: "An accident of history became a political weapon", quote: "The founders never intended for 60 votes to mean anything.", tags: ["politics", "tactical"] },
      { id: "npc3", title: "Healthcare is complicated because...", showId: "np3", showTitle: "The Weeds", host: "Vox", thumbnail: "/thumbnails/weeds.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 178, claim: "Every stakeholder has veto power", quote: "Hospitals, insurers, pharma, doctors—they all have lobbyists. Patients don't.", tags: ["policy", "philosophical"] },
    ],
  },
  {
    id: "arts-culture",
    name: "Arts & Culture",
    icon: "🎨",
    shows: [
      { id: "ac1", title: "99% Invisible", host: "Roman Mars", thumbnail: "/thumbnails/99pi.jpg", description: "Design and architecture" },
      { id: "ac2", title: "Song Exploder", host: "Hrishikesh Hirway", thumbnail: "/thumbnails/songexploder.jpg", description: "How songs are made" },
      { id: "ac3", title: "The Ezra Klein Show", host: "Ezra Klein", thumbnail: "/thumbnails/ezra.jpg", description: "Ideas that shape our world" },
    ],
    clips: [
      { id: "acc1", title: "Why cities feel different", showId: "ac1", showTitle: "99% Invisible", host: "Roman Mars", thumbnail: "/thumbnails/99pi.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 123, claim: "It's the small design details you don't notice", quote: "The width of the sidewalk determines whether you make eye contact.", tags: ["design", "story"] },
      { id: "acc2", title: "Billie Eilish records in her bedroom", showId: "ac2", showTitle: "Song Exploder", host: "Hrishikesh Hirway", thumbnail: "/thumbnails/songexploder.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 98, claim: "Limitations breed creativity", quote: "The bedroom sound became the signature. The limitation was the feature.", tags: ["music", "story"] },
      { id: "acc3", title: "Attention is the new scarcity", showId: "ac3", showTitle: "The Ezra Klein Show", host: "Ezra Klein", thumbnail: "/thumbnails/ezra.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 167, claim: "We've solved for information but created attention poverty", quote: "We have infinite content and finite consciousness.", tags: ["culture", "philosophical"] },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    shows: [
      { id: "sp1", title: "The Bill Simmons Podcast", host: "Bill Simmons", thumbnail: "/thumbnails/simmons.jpg", description: "Sports and pop culture" },
      { id: "sp2", title: "Pardon My Take", host: "Big Cat & PFT", thumbnail: "/thumbnails/pmt.jpg", description: "Comedic sports commentary" },
      { id: "sp3", title: "The Lowe Post", host: "Zach Lowe", thumbnail: "/thumbnails/lowe.jpg", description: "NBA analysis" },
    ],
    clips: [
      { id: "spc1", title: "Why dynasties end", showId: "sp1", showTitle: "The Bill Simmons Podcast", host: "Bill Simmons", thumbnail: "/thumbnails/simmons.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 134, claim: "Success creates the conditions for failure", quote: "Championships make players expensive. Expensive players leave.", tags: ["sports", "philosophical"] },
      { id: "spc2", title: "The myth of the clutch gene", showId: "sp2", showTitle: "Pardon My Take", host: "Big Cat & PFT", thumbnail: "/thumbnails/pmt.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 89, claim: "Clutch is just small sample sizes", quote: "Michael Jordan missed more game-winners than he made.", tags: ["sports", "contrarian"] },
      { id: "spc3", title: "The three-point revolution", showId: "sp3", showTitle: "The Lowe Post", host: "Zach Lowe", thumbnail: "/thumbnails/lowe.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 156, claim: "Math finally beat tradition", quote: "A bad three is worth more than a good two. The numbers don't lie.", tags: ["basketball", "tactical"] },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    shows: [
      { id: "ed1", title: "Lex Fridman Podcast", host: "Lex Fridman", thumbnail: "/thumbnails/lex.jpg", description: "Deep conversations" },
      { id: "ed2", title: "TED Radio Hour", host: "Manoush Zomorodi", thumbnail: "/thumbnails/ted.jpg", description: "Ideas worth spreading" },
      { id: "ed3", title: "Hidden Brain", host: "Shankar Vedantam", thumbnail: "/thumbnails/hiddenbrain.jpg", description: "The unconscious mind" },
    ],
    clips: [
      { id: "edc1", title: "AGI is closer than you think", showId: "ed1", showTitle: "Lex Fridman Podcast", host: "Lex Fridman", thumbnail: "/thumbnails/lex.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 187, claim: "The question isn't if, it's when—and what then", quote: "We're building minds without understanding our own.", tags: ["AI", "philosophical"] },
      { id: "edc2", title: "Creativity is not a gift", showId: "ed2", showTitle: "TED Radio Hour", host: "Manoush Zomorodi", thumbnail: "/thumbnails/ted.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 112, claim: "Creative people aren't special—they just show up more", quote: "Picasso made 50,000 works. Most were bad. The good ones made history.", tags: ["creativity", "tactical"] },
      { id: "edc3", title: "Why we procrastinate", showId: "ed3", showTitle: "Hidden Brain", host: "Shankar Vedantam", thumbnail: "/thumbnails/hiddenbrain.jpg", mediaUrl: "/audio/sample.mp3", mediaType: "audio", duration: 143, claim: "It's not laziness—it's emotion regulation", quote: "We don't avoid the task. We avoid how the task makes us feel.", tags: ["psychology", "philosophical"] },
    ],
  },
];
