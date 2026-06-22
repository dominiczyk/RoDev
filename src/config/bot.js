import { logger } from '../utils/logger.js';

export const botConfig = {
  // =========================
  // BOT PRESENCE
  // =========================
  presence: {
    status: "online",
    activities: [
      {
        name: "Helping people find devs",
        type: 0,
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
    prefix: process.env.PREFIX || "!",
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  embeds: {
    colors: {
      primary:   "#336699",
      success:   "#57F287",
      error:     "#ED4245",
      warning:   "#FEE75C",
      blurple:   "#5865F2",
      green:     "#57F287",
      red:       "#ED4245",
      gray:      "#99AAB5",
    },
    footer: {
      text: "DevBuild",
      icon: null,
    },
  },

  // =========================
  // HIRING SYSTEM
  // =========================
  hiring: {
    // Set automatically by /setup, or hard-code IDs here.

    // Channel where approved "For Hire" posts appear (devs seeking work).
    forHireChannelId: null,

    // Channel where approved "Hiring" posts appear (clients seeking devs).
    hiringChannelId: null,

    // Discord user ID that receives submission DMs for moderation.
    // Overridden by whoever runs /setup, or set HIRING_MOD_USER_ID in .env.
    modUserId: process.env.HIRING_MOD_USER_ID || null,

    // ── Field limits ────────────────────────────────────────────────────────
    limits: {
      titleMaxLength:         100,
      descriptionMaxLength:   1000,
      paymentMaxLength:       100,
      contactMaxLength:       100,
      declineReasonMaxLength: 500,
    },

    // ── Embed colors ────────────────────────────────────────────────────────
    colors: {
      forHire:  "#5865F2",  // blurple  — For Hire post embeds
      hiring:   "#57F287",  // green    — Hiring post embeds
      pending:  "#FEE75C",  // yellow   — mod review DM
      approved: "#57F287",  // green    — approval DM to submitter
      declined: "#ED4245",  // red      — decline DM to submitter
    },

    // ── Panel embed text ────────────────────────────────────────────────────
    // Text shown on the public embeds posted in each channel by /setup.
    panels: {
      forHire: {
        title: "🧑‍💻 Post Yourself as For Hire",
        description:
          "Are you a Roblox developer looking for work? Click below to submit your **For Hire** post.\n\nInclude your skills, availability, and expected payment.\n\n*All posts are reviewed before going live.*",
        fields: [
          "• Your Roblox username",
          "• Skills (scripting, building, UI, etc.)",
          "• Availability / timezone",
          "• Payment expectations",
        ],
        buttonLabel: "📝 Submit For Hire Post",
      },
      hiring: {
        title: "📢 Post a Hiring Listing",
        description:
          "Looking to hire a Roblox developer? Click below to submit your **Hiring** post.\n\nInclude what you need, your budget, and contact info.\n\n*All posts are reviewed before going live.*",
        fields: [
          "• Job title & description",
          "• Skills required",
          "• Budget / payment",
          "• How to contact you",
        ],
        buttonLabel: "📝 Submit Hiring Post",
      },
    },

    // ── Modal labels ────────────────────────────────────────────────────────
    // Labels inside the submission modal for each post type.
    modals: {
      forHire: {
        title:            "For Hire Application",
        titleLabel:       "Your role / title (e.g. Scripter)",
        descriptionLabel: "Describe your skills & experience",
        paymentLabel:     "Expected payment (e.g. $10/hr, % rev share)",
        contactLabel:     "Best way to contact you (Discord tag, Roblox user…)",
      },
      hiring: {
        title:            "Hiring Post Application",
        titleLabel:       "Job title (e.g. UI Designer Needed)",
        descriptionLabel: "Describe the job & requirements",
        paymentLabel:     "Budget / payment offered",
        contactLabel:     "Best way to contact you (Discord tag, Roblox user…)",
      },
    },

    // ── DM message templates ────────────────────────────────────────────────
    // {type}, {title}, {channelId}, {reason} are replaced at runtime.
    messages: {
      approvedDm:
        "Your **{type}** post titled **\"{title}\"** has been approved and is now live in <#{channelId}>. 🎉",
      declinedDm:
        "Your **{type}** post titled **\"{title}\"** was not approved.",
      declinedWithReasonDm:
        "Your **{type}** post titled **\"{title}\"** was not approved.\n\n**Reason:** {reason}",
      submittedConfirmation:
        "Your post has been sent for review. You'll receive a DM once it's been approved or declined.",
    },
  },
};

export function validateConfig(config) {
  const errors = [];

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN env variable)");
  }
  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID env variable)");
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Bot configuration errors:", configErrors.join("\n"));
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

export const BotConfig = botConfig;

export function getColor(path, fallback = "#99AAB5") {
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );
  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

export default botConfig;
