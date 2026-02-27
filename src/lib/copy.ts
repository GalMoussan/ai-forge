// src/lib/copy.ts
// Single source of truth for all user-facing text in AI-Forge.
// No hardcoded strings in components — import COPY instead.

export const COPY = {
  hero: {
    headline: {
      static_prefix: "The AI tools you need to",
      rotating: [
        "automate your workflow",
        "generate at scale",
        "ship faster",
        "think ten steps ahead",
      ] as const,
      static_suffix: "— are waiting to be built.",
      full_fallback:
        "The AI tools you need to build what matters — are waiting to be built.",
    },
    subheadline:
      "Vote on the AI tools you wish existed. The most-demanded ideas get built — by the community, for the community.",
    cta_primary: "Back Your First Idea",
    cta_secondary: "See What's Being Built",
    stats: {
      builders_label: "builders",
      ideas_label: "ideas submitted",
      building_label: "tools in progress",
    },
  },

  ideaLab: {
    eyebrow: "IDEA LAB",
    heading: "Describe the tool you wish existed.",
    subheading:
      "The best ideas come from people who feel the gap every day. Put yours on the board.",
    form: {
      title_label: "Idea title",
      title_placeholder: "e.g. AI that rewrites my calendar based on my energy levels",
      description_label: "What problem does it solve?",
      description_placeholder:
        "Describe the problem in plain terms. Who feels it? What does it cost them today? What would a great solution look like?",
      category_label: "Category",
      tags_label: "Tags",
      tags_placeholder: "productivity, writing, research...",
      submit_cta: "Put This Idea on the Board",
      success_heading: "Your idea is live.",
      success_body:
        "Share it with builders who can make it happen. The more voices behind it, the faster it moves.",
    },
  },

  foundry: {
    eyebrow: "THE FOUNDRY",
    heading: "Ideas the community is backing.",
    subheading:
      "Every vote is a signal. Back the ideas that matter to you and move the needle.",
    vote_cta: "Back This Idea",
    voted_label: "Backed",
    vote_count: {
      singular: "1 builder wants this",
      plural: (n: number): string => `${n} builders want this`,
    },
    threshold_label: (current: number, threshold: number): string =>
      `${current} of ${threshold} builders`,
    empty_state: {
      heading: "No ideas yet — yours could be first.",
      body: "The Foundry fills up fast. Be the builder who starts the conversation.",
      cta: "Submit the First Idea",
    },
    filter_all: "All",
    comments: {
      heading: (count: number): string =>
        count === 0 ? "Discussion" : `Discussion (${count})`,
      placeholder:
        "Add context, use cases, or technical insight that makes this idea stronger.",
      submit_cta: "Add to the Discussion",
      empty: "No discussion yet. Start one — good ideas get sharper with scrutiny.",
      reply_cta: "Reply",
    },
  },

  auth: {
    sign_in_heading: "Join the builders.",
    sign_in_subheading:
      "Sign in to back ideas, submit your own, and shape what gets built next.",
    magic_link_label: "Email address",
    magic_link_placeholder: "you@example.com",
    magic_link_cta: "Send Me a Sign-In Link",
    google_cta: "Continue with Google",
    magic_link_sent:
      "Check your inbox — a sign-in link is on its way. No password needed.",
    prompt_vote:
      "Sign in to add your voice — it takes 10 seconds.",
    prompt_submit:
      "Sign in to put your idea on the board — it takes 10 seconds.",
    prompt_comment:
      "Sign in to join the discussion — it takes 10 seconds.",
    nav_sign_in: "Sign In",
  },

  errors: {
    network:
      "Couldn't reach the server — check your connection and try again.",
    duplicate_vote: "You've already backed this idea. Your vote is on record.",
    submission_failed:
      "Something went wrong saving your idea. Give it another try — your draft is still here.",
    comment_failed:
      "Your comment didn't go through. Try again — your text hasn't gone anywhere.",
    generic:
      "Something went sideways. Refresh the page and try again.",
  },

  nav: {
    logo: "AI-Forge",
    tagline: "Build what's missing.",
  },

  seo: {
    title: "AI-Forge — Back the AI Tools You Need Built",
    description:
      "AI-Forge is the community platform where builders vote on the AI tools they need most. The highest-demand ideas get built. Add your voice.",
    og_title: "AI-Forge — Your vote decides what gets built next",
    og_description:
      "Tell us what AI tools you wish existed. The community backs the best ideas — and the best ideas get built.",
  },
} as const

export type CopySchema = typeof COPY
