export type BriefingEmail = {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
};

export type PlatformBriefing = {
  id: string;
  title: string;
  description: string;
  image: string;
  emails: BriefingEmail[];
};

function topBriefingContent(title: string, description: string) {
  return `${title} — ${description}. A curated audio briefing pulled from your top stories, ready to play in one tap.`;
}

export const topBriefingsItems: PlatformBriefing[] = [
  {
    id: "morning-markets-wrap",
    title: "Morning Markets Wrap",
    description: "Business • 8 mins • Today",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "mm-1",
        subject: "Monday Notes",
        senderName: "Nicholas Finch",
        senderEmail: "nfinch@synmax.com",
      },
      {
        id: "mm-2",
        subject: "Re: Recap",
        senderName: "Nicholas Finch",
        senderEmail: "nfinch@synmax.com",
      },
      {
        id: "mm-3",
        subject: "Pre-market movers: Tech leads futures higher",
        senderName: "Bloomberg Markets",
        senderEmail: "markets@news.bloomberg.com",
      },
      {
        id: "mm-4",
        subject: "Today's earnings calendar",
        senderName: "CNBC Pro",
        senderEmail: "alerts@cnbc.com",
      },
      {
        id: "mm-5",
        subject: "Fed minutes: rate path unchanged",
        senderName: "WSJ Markets",
        senderEmail: "markets@wsj.com",
      },
      {
        id: "mm-6",
        subject: "Oil slips as demand outlook softens",
        senderName: "Energy Daily",
        senderEmail: "briefing@energydaily.com",
      },
      {
        id: "mm-7",
        subject: "Asia markets close mixed ahead of US open",
        senderName: "Financial Times",
        senderEmail: "morning@ft.com",
      },
      {
        id: "mm-8",
        subject: "Portfolio rebalance reminder — Q1 review",
        senderName: "Wealthfront",
        senderEmail: "advice@wealthfront.com",
      },
    ],
  },
  {
    id: "tech-ai-digest",
    title: "Tech & AI Digest",
    description: "Technology • 10 mins • Today",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "ta-1",
        subject: "Your summary is ready — Weekly IT support standup",
        senderName: "Pocket",
        senderEmail: "noreply@heypocket.com",
      },
      {
        id: "ta-2",
        subject: "For you in SynMax : THEIA-4352: Upgrade Deck.gl 9",
        senderName: "Notion Team",
        senderEmail: "notify@mail.notion.so",
      },
      {
        id: "ta-3",
        subject: "OpenAI announces new model capabilities",
        senderName: "The Verge",
        senderEmail: "newsletter@theverge.com",
      },
      {
        id: "ta-4",
        subject: "AI regulation update: EU compliance checklist",
        senderName: "Tech Policy Review",
        senderEmail: "digest@techpolicy.io",
      },
      {
        id: "ta-5",
        subject: "GitHub Copilot workspace updates",
        senderName: "GitHub",
        senderEmail: "notifications@github.com",
      },
      {
        id: "ta-6",
        subject: "NVIDIA data center revenue beats estimates",
        senderName: "MarketWatch Tech",
        senderEmail: "tech@marketwatch.com",
      },
      {
        id: "ta-7",
        subject: "Re: Design review — AI dashboard v2",
        senderName: "Sarah Chen",
        senderEmail: "sarah.chen@synmax.com",
      },
      {
        id: "ta-8",
        subject: "Weekly digest: Top Hacker News threads",
        senderName: "Hacker Newsletter",
        senderEmail: "digest@hackernewsletter.com",
      },
    ],
  },
  {
    id: "world-headlines",
    title: "World Headlines",
    description: "World News • 6 mins • Yesterday",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "wh-1",
        subject: "Morning briefing: Middle East developments",
        senderName: "Reuters World",
        senderEmail: "world@news.reuters.com",
      },
      {
        id: "wh-2",
        subject: "UN summit recap — key takeaways",
        senderName: "Foreign Affairs Daily",
        senderEmail: "daily@foreignaffairs.com",
      },
      {
        id: "wh-3",
        subject: "Global supply chain watch",
        senderName: "Nikkei Asia",
        senderEmail: "briefing@asia.nikkei.com",
      },
      {
        id: "wh-4",
        subject: "Europe opens lower on growth concerns",
        senderName: "BBC News",
        senderEmail: "newsletter@bbc.co.uk",
      },
      {
        id: "wh-5",
        subject: "G7 foreign ministers joint statement",
        senderName: "AP World",
        senderEmail: "world@ap.org",
      },
      {
        id: "wh-6",
        subject: "Refugee crisis: latest UN figures",
        senderName: "UN News",
        senderEmail: "news@un.org",
      },
    ],
  },
  {
    id: "climate-energy",
    title: "Climate & Energy",
    description: "Climate • 7 mins • Yesterday",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "ce-1",
        subject: "Renewable capacity hits record in Q1",
        senderName: "IEA Newsletter",
        senderEmail: "newsletter@iea.org",
      },
      {
        id: "ce-2",
        subject: "Carbon markets weekly roundup",
        senderName: "Climate Wire",
        senderEmail: "daily@climatewire.org",
      },
      {
        id: "ce-3",
        subject: "Grid storage investments surge",
        senderName: "Energy Monitor",
        senderEmail: "alerts@energymonitor.ai",
      },
      {
        id: "ce-4",
        subject: "Solar panel tariffs under review",
        senderName: "Greentech Media",
        senderEmail: "news@greentechmedia.com",
      },
      {
        id: "ce-5",
        subject: "EV adoption rates by region — Q1 data",
        senderName: "BloombergNEF",
        senderEmail: "briefing@bnef.com",
      },
      {
        id: "ce-6",
        subject: "Wildfire season outlook 2026",
        senderName: "NOAA Climate",
        senderEmail: "climate@noaa.gov",
      },
    ],
  },
  {
    id: "sports-roundup",
    title: "Sports Roundup",
    description: "Sports • 5 mins • 2 days ago",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "sr-1",
        subject: "Last night's scores and highlights",
        senderName: "ESPN Daily",
        senderEmail: "daily@espn.com",
      },
      {
        id: "sr-2",
        subject: "Transfer window: latest rumors",
        senderName: "The Athletic",
        senderEmail: "newsletter@theathletic.com",
      },
      {
        id: "sr-3",
        subject: "Fantasy picks for the weekend",
        senderName: "Yahoo Sports",
        senderEmail: "fantasy@yahoo.com",
      },
    ],
  },
  {
    id: "health-wellness",
    title: "Health & Wellness",
    description: "Health • 9 mins • 2 days ago",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "hw-1",
        subject: "Sleep science: what changed this week",
        senderName: "Huberman Lab",
        senderEmail: "newsletter@hubermanlab.com",
      },
      {
        id: "hw-2",
        subject: "New nutrition guidelines explained",
        senderName: "Harvard Health",
        senderEmail: "health@hms.harvard.edu",
      },
      {
        id: "hw-3",
        subject: "Mindfulness practice — 5-minute reset",
        senderName: "Headspace",
        senderEmail: "hello@headspace.com",
      },
    ],
  },
  {
    id: "culture-arts",
    title: "Culture & Arts",
    description: "Entertainment • 11 mins • 3 days ago",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "ca-1",
        subject: "Film festival picks you shouldn't miss",
        senderName: "IndieWire",
        senderEmail: "newsletter@indiewire.com",
      },
      {
        id: "ca-2",
        subject: "New album releases this Friday",
        senderName: "Pitchfork",
        senderEmail: "daily@pitchfork.com",
      },
      {
        id: "ca-3",
        subject: "Museum exhibitions opening near you",
        senderName: "Artforum",
        senderEmail: "digest@artforum.com",
      },
    ],
  },
  {
    id: "policy-politics",
    title: "Policy & Politics",
    description: "World News • 8 mins • 3 days ago",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400",
    emails: [
      {
        id: "pp-1",
        subject: "Congressional agenda: week ahead",
        senderName: "Politico Playbook",
        senderEmail: "playbook@politico.com",
      },
      {
        id: "pp-2",
        subject: "Supreme Court docket update",
        senderName: "SCOTUSblog",
        senderEmail: "alerts@scotusblog.com",
      },
      {
        id: "pp-3",
        subject: "Polling averages — national tracker",
        senderName: "FiveThirtyEight",
        senderEmail: "newsletter@538.com",
      },
      {
        id: "pp-4",
        subject: "State legislature roundup",
        senderName: "Ballotpedia",
        senderEmail: "news@ballotpedia.org",
      },
    ],
  },
];

export function getBriefingById(id: string): PlatformBriefing | undefined {
  return topBriefingsItems.find((item) => item.id === id);
}

export function getBriefingStory(briefingId: string, storyId: string) {
  const briefing = getBriefingById(briefingId);
  if (!briefing) {
    return undefined;
  }

  const story = briefing.emails.find((email) => email.id === storyId);
  if (!story) {
    return undefined;
  }

  return { briefing, story };
}

export function getBriefingContent(briefing: PlatformBriefing) {
  return topBriefingContent(briefing.title, briefing.description);
}

export function getAllBriefingStoryParams() {
  return topBriefingsItems.flatMap((briefing) =>
    briefing.emails.map((story) => ({
      id: briefing.id,
      storyId: story.id,
    })),
  );
}
