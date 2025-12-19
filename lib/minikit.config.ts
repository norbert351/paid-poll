const ROOT_URL =
  process.env.NEXT_PUBLIC_ROOT_URL ??
  "https://paid-poll.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    header: "",      // filled after Base signing
    payload: "",     // filled after Base signing
    signature: ""    // filled after Base signing
  },

  miniapp: {
    version: "1",

    name: "Paid Polls",
    subtitle: "Vote with ETH or USDC",
    description: "Create and vote on on-chain polls on Base",

    homeUrl: ROOT_URL,

    iconUrl: `${ROOT_URL}/icon.png`,
    heroImageUrl: `${ROOT_URL}/hero.png`,
    splashImageUrl: `${ROOT_URL}/hero.png`,
    splashBackgroundColor: "#000000",

    screenshotUrls: [
      `${ROOT_URL}/screen.png`
    ],

    primaryCategory: "social",
    tags: ["polls", "base", "usdc", "eth"],

    // Optional but safe
    tagline: "Onchain paid voting",
    ogTitle: "Paid Polls on Base",
    ogDescription: "Create and vote on paid polls using ETH or USDC",
    ogImageUrl: `${ROOT_URL}/hero.png`
  }
} as const;
