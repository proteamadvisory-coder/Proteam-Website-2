/* =========================================================
   PROTEAM ADVISORY — Site assistant (v1.0)
   Floating chat widget. Self-contained: CSS + DOM + behaviour.
   No dependencies, no API calls, no tracking. Reads brand
   colours from the page's CSS variables so it adapts to
   whichever brand direction the site uses.
   ========================================================= */
(function () {
  'use strict';
  if (window.__proteamChatLoaded) return;
  window.__proteamChatLoaded = true;

  /* ---------- CONFIG ---------- */
  const CFG = {
    name: 'Proteam Assistant',
    teaser: "Hi 👋 Need help finding something?",
    teaserDelay: 3500,
    teaserDuration: 12000,
    typingDelay: 550,
    storageKey: 'proteam-chat-v1'
  };

  /* ---------- DIALOG TREE ---------- */
  const TREE = {
    root: {
      bot: "Hi 👋 I'm Proteam's assistant. I can explain SAM basics, point you to the right service, or connect you with our team. What would you like to do?",
      chips: [
        { label: "I'm new to SAM — explain the basics", next: 'basics' },
        { label: "We're facing a vendor audit", next: 'audit' },
        { label: "Help me find the right service", next: 'services' },
        { label: "Show me real client outcomes", next: 'outcomes' },
        { label: "I want to talk to someone", next: 'contact' }
      ]
    },

    basics: {
      bot: "Software Asset Management (SAM) is the discipline of managing what you've bought, what you're actually using, and what you're paying for. Done well, it cuts 15–20% off enterprise software bills and prevents audit surprises. What would you like to know?",
      chips: [
        { label: "What does Proteam actually do?", next: 'basics-what' },
        { label: "How is SAM different from procurement?", next: 'basics-vs' },
        { label: "What about SaaS and Cloud?", next: 'basics-saas' },
        { label: "What about AI tools?", next: 'basics-ai' },
        { label: "← Back", next: 'root' }
      ]
    },
    'basics-what': {
      bot: "Seven specialist services across the software estate: Licence Optimisation, Audit Defence, SAM Baselining, AI Spend Management, AI Adoption, SaaS Management, and Cloud FinOps. We're independent — no commissions from any vendor.",
      chips: [
        { label: "See all services", href: 'services.html' },
        { label: "Read about the team", href: 'about.html' },
        { label: "← More basics", next: 'basics' },
        { label: "Talk to a consultant", next: 'contact' }
      ]
    },
    'basics-vs': {
      bot: "Procurement runs the contract negotiation. SAM runs the entire lifecycle: entitlement vs deployment, audit defence, optimisation roadmaps, renewal preparation. We work alongside procurement, not in place of it.",
      chips: [
        { label: "Licence Optimisation", href: 'service-license-optimization.html' },
        { label: "SAM Baselining", href: 'service-sam-baselining.html' },
        { label: "← More basics", next: 'basics' }
      ]
    },
    'basics-saas': {
      bot: "SaaS sprawl and cloud cost overruns are now the largest controllable line items in IT budgets. SaaS Management tackles per-user inefficiency. Cloud FinOps handles AWS / Azure / GCP unit economics. Both run separately from traditional licensing.",
      chips: [
        { label: "SaaS Management", href: 'service-saas-management.html' },
        { label: "Cloud FinOps", href: 'service-cloud-finops.html' },
        { label: "← More basics", next: 'basics' }
      ]
    },
    'basics-ai': {
      bot: "Two angles: AI Spend (managing what you're paying for OpenAI, Anthropic, Copilot, etc.) and AI Adoption (turning that spend into measurable value). Most enterprises buy first and govern later — we help reverse that order.",
      chips: [
        { label: "AI Spend Management", href: 'service-ai-spend.html' },
        { label: "AI Adoption & Value", href: 'service-ai-adoption.html' },
        { label: "Read: Shadow AI inventory", href: 'article-shadow-ai-inventory.html' },
        { label: "← More basics", next: 'basics' }
      ]
    },

    audit: {
      bot: "Vendor audits are time-sensitive. The earlier we engage, the better the outcome. Where are you in the process?",
      chips: [
        { label: "We just received an audit notice", next: 'audit-urgent' },
        { label: "We expect an audit soon", next: 'audit-prep' },
        { label: "How does audit defence work?", next: 'audit-how' },
        { label: "Which vendors audit most?", next: 'audit-vendors' },
        { label: "← Back", next: 'root' }
      ]
    },
    'audit-urgent': {
      bot: "First — don't respond to the auditor without a plan. We can have a senior consultant on a call with you within 24 hours. Best to start with the free consultation so we understand your situation.",
      chips: [
        { label: "Book free consultation", href: 'contact.html?source=chatbot-audit-urgent' },
        { label: "Call: +91 9676 889 797", href: 'tel:+919676889797' },
        { label: "WhatsApp", href: 'https://wa.me/919676889797?text=Audit%20notice%20—%20found%20you%20via%20Proteam%20site' },
        { label: "← Back to audits", next: 'audit' }
      ]
    },
    'audit-prep': {
      bot: "Smart move — pre-audit prep is where the real savings sit. We baseline your estate, identify the highest-risk vendors, and build a defensible position before the auditor's letter arrives.",
      chips: [
        { label: "Audit Defence service", href: 'service-audit-defence.html' },
        { label: "SAM Baselining", href: 'service-sam-baselining.html' },
        { label: "Book free consultation", href: 'contact.html?source=chatbot-audit-prep' },
        { label: "← Back to audits", next: 'audit' }
      ]
    },
    'audit-how': {
      bot: "Three phases: defensive baseline (what you actually owe), counter-position (what the auditor's claim misses), and negotiation (typically reducing the demand by 60–80%). All independent — we don't take vendor commissions.",
      chips: [
        { label: "Audit Defence", href: 'service-audit-defence.html' },
        { label: "Read recent insights", href: 'insights.html' },
        { label: "Book free consultation", href: 'contact.html?source=chatbot-audit-how' },
        { label: "← Back to audits", next: 'audit' }
      ]
    },
    'audit-vendors': {
      bot: "Most active in 2026: Oracle (Java SE renewals), IBM (perpetual conversion pushes), SAP (indirect access — clauses 6.4 and 9.1 of the new GTC), Microsoft (M365 true-ups). Each has its own playbook.",
      chips: [
        { label: "Oracle Java analysis", href: 'article-oracle-java.html' },
        { label: "SAP indirect access", href: 'article-sap-indirect-access.html' },
        { label: "Microsoft 365 case", href: 'article-microsoft365-pharma.html' },
        { label: "← Back to audits", next: 'audit' }
      ]
    },

    services: {
      bot: "Seven specialist practices. Which problem matches yours?",
      chips: [
        { label: "Cutting software costs", next: 'svc-cost' },
        { label: "Defending against audits", next: 'svc-audit' },
        { label: "Cloud / SaaS sprawl", next: 'svc-cloud' },
        { label: "AI tooling chaos", next: 'svc-ai' },
        { label: "Just show me everything", href: 'services.html' },
        { label: "← Back", next: 'root' }
      ]
    },
    'svc-cost': {
      bot: "Two services tackle this directly:",
      chips: [
        { label: "Licence Optimisation", href: 'service-license-optimization.html' },
        { label: "SAM Baselining", href: 'service-sam-baselining.html' },
        { label: "Try the savings estimator", href: 'index.html#estimator' },
        { label: "← Back to services", next: 'services' }
      ]
    },
    'svc-audit': {
      bot: "When the auditor's already at the door, or when you want to prepare ahead:",
      chips: [
        { label: "Audit Defence", href: 'service-audit-defence.html' },
        { label: "Book free consultation", href: 'contact.html?source=chatbot-svc-audit' },
        { label: "← Back to services", next: 'services' }
      ]
    },
    'svc-cloud': {
      bot: "Two angles depending on your problem:",
      chips: [
        { label: "SaaS Management (sprawl, seats)", href: 'service-saas-management.html' },
        { label: "Cloud FinOps (AWS / Azure / GCP)", href: 'service-cloud-finops.html' },
        { label: "← Back to services", next: 'services' }
      ]
    },
    'svc-ai': {
      bot: "Two services for the AI cost-and-value problem:",
      chips: [
        { label: "AI Spend Management", href: 'service-ai-spend.html' },
        { label: "AI Adoption & Value", href: 'service-ai-adoption.html' },
        { label: "← Back to services", next: 'services' }
      ]
    },

    outcomes: {
      bot: "Real client work, written up:",
      chips: [
        { label: "Pharma cuts M365 spend 34%", href: 'article-microsoft365-pharma.html' },
        { label: "Banking AWS — $2.7M saved", href: 'article-aws-savings-plans.html' },
        { label: "Oracle Java renewals reset", href: 'article-oracle-java.html' },
        { label: "Copilot adoption playbook", href: 'article-copilot-shelfware.html' },
        { label: "All case studies", href: 'case-studies.html' },
        { label: "All insights", href: 'insights.html' },
        { label: "← Back", next: 'root' }
      ]
    },

    contact: {
      bot: "How would you like to reach us? The free consultation is the most useful — 30 minutes with a senior consultant, no obligation.",
      chips: [
        { label: "Book free consultation", href: 'contact.html?source=chatbot' },
        { label: "Email vpatel@proteamadvisory.com", href: 'mailto:vpatel@proteamadvisory.com?subject=Enquiry%20from%20Proteam%20website' },
        { label: "Call +91 9676 889 797", href: 'tel:+919676889797' },
        { label: "WhatsApp", href: 'https://wa.me/919676889797?text=Hi%2C%20I%20found%20you%20via%20the%20Proteam%20website' },
        { label: "← Back", next: 'root' }
      ]
    },

    pricing: {
      bot: "We anchor commercial models to outcomes — measurable savings or reduced audit exposure — rather than time-and-materials. Specifics come after the free consultation, once we understand the scope.",
      chips: [
        { label: "Book free consultation", href: 'contact.html?source=chatbot-pricing' },
        { label: "← Back", next: 'root' }
      ]
    },

    'about-bot': {
      bot: "I'm a guided navigator built by the Proteam team — not AI, not a real consultant. I can point you around the site and connect you to the right person. Want to talk to someone real?",
      chips: [
        { label: "Yes — book free consultation", href: 'contact.html?source=chatbot-about' },
        { label: "Keep navigating", next: 'root' }
      ]
    },

    'fallback': {
      bot: "I didn't quite catch that — I'm fairly limited. Tap one of these, or type a topic like \"audit\", \"oracle\", \"saas\", \"pricing\".",
      chips: [
        { label: "I'm new to SAM", next: 'basics' },
        { label: "Vendor audit help", next: 'audit' },
        { label: "Find a service", next: 'services' },
        { label: "Talk to someone", next: 'contact' }
      ]
    },

    'thanks': {
      bot: "Anytime. Want to book a free consultation while you're here, or keep exploring?",
      chips: [
        { label: "Book free consultation", href: 'contact.html?source=chatbot-thanks' },
        { label: "Keep exploring", next: 'root' }
      ]
    }
  };

  /* ---------- KEYWORD MATCHING (free-text input) ---------- */
  // Order matters — first match wins.
  const KEYWORDS = [
    [/are you (a |an )?(ai|bot|robot|human|real)|chatgpt|claude/i, 'about-bot'],
    [/oracle|java/i, 'audit-vendors'],
    [/sap|indirect access/i, 'audit-vendors'],
    [/microsoft|m365|office 365|365|copilot|teams/i, 'basics-ai'],
    [/aws|amazon web|ec2/i, 'svc-cloud'],
    [/azure|google cloud|gcp/i, 'svc-cloud'],
    [/audit|notice|defens|defenc|true.up|trueup/i, 'audit'],
    [/finops|cloud cost/i, 'svc-cloud'],
    [/saas|software as a service/i, 'svc-cloud'],
    [/optim|saving|cost cut|reduce.*spend|cut.*spend/i, 'svc-cost'],
    [/\bai\b|openai|anthropic|gen.?ai|llm|gpt/i, 'svc-ai'],
    [/baselin|inventory/i, 'basics-what'],
    [/price|cost|fee|how much|charge|rate/i, 'pricing'],
    [/contact|reach|talk|call|email|book|consult|whatsapp/i, 'contact'],
    [/case|outcome|result|saved|saving|client/i, 'outcomes'],
    [/service|what do you do|what.*offer/i, 'services'],
    [/sam|software asset|licen[cs]e|licens(ing|es)/i, 'basics'],
    [/^(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i, 'root'],
    [/thank|cheers|appreciate|great\b/i, 'thanks']
  ];

  function matchKeyword(text) {
    for (const [re, node] of KEYWORDS) {
      if (re.test(text)) return node;
    }
    return 'fallback';
  }

  /* ---------- STYLES ---------- */
  // Reads brand colours from CSS vars so it auto-matches both
  // brand directions. Falls back to navy/cream if vars missing.
  const CSS = `
  .pt-chat-fab {
    position: fixed; right: 20px; bottom: 20px;
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--navy, #0B1F3A);
    color: var(--cream, #F4EFE6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none;
    box-shadow: 0 14px 32px -8px rgba(11,31,58,0.35), 0 4px 12px -4px rgba(11,31,58,0.25);
    z-index: 950; transition: transform 0.2s ease, box-shadow 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--sans, system-ui, sans-serif);
  }
  .pt-chat-fab:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -8px rgba(11,31,58,0.45); }
  .pt-chat-fab:active { transform: translateY(0); }
  .pt-chat-fab svg { width: 24px; height: 24px; }
  .pt-chat-fab .pt-fab-close { display: none; }
  .pt-chat-fab.is-open .pt-fab-icon { display: none; }
  .pt-chat-fab.is-open .pt-fab-close { display: block; }
  .pt-chat-fab .pt-dot {
    position: absolute; top: 8px; right: 8px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--amber, #C8932B);
    border: 2px solid var(--navy, #0B1F3A);
    opacity: 0; transform: scale(0); transition: all 0.2s ease;
  }
  .pt-chat-fab.has-notif .pt-dot { opacity: 1; transform: scale(1); }

  .pt-chat-teaser {
    position: fixed; right: 88px; bottom: 30px;
    background: var(--navy, #0B1F3A);
    color: var(--cream, #F4EFE6);
    padding: 12px 18px;
    border-radius: 18px;
    font-family: var(--sans, system-ui, sans-serif);
    font-size: 14px; font-weight: 500;
    box-shadow: 0 14px 32px -10px rgba(11,31,58,0.35);
    max-width: 240px; line-height: 1.4;
    z-index: 949; cursor: pointer;
    opacity: 0; transform: translateX(12px) scale(0.96);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  }
  .pt-chat-teaser.is-visible { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
  .pt-chat-teaser::after {
    content: ''; position: absolute;
    right: -6px; bottom: 18px;
    width: 12px; height: 12px;
    background: var(--navy, #0B1F3A);
    transform: rotate(45deg);
  }
  .pt-chat-teaser-close {
    position: absolute; top: -8px; right: -8px;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--cream, #F4EFE6);
    color: var(--navy, #0B1F3A);
    border: none; cursor: pointer; font-size: 14px; line-height: 1;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    display: flex; align-items: center; justify-content: center;
  }

  .pt-chat-panel {
    position: fixed; right: 20px; bottom: 88px;
    width: 380px; max-width: calc(100vw - 32px);
    height: 580px; max-height: calc(100vh - 120px);
    background: var(--paper, #FAF6EE);
    border: 1px solid var(--line, rgba(11,31,58,0.12));
    border-radius: 16px;
    box-shadow: 0 30px 60px -20px rgba(11,31,58,0.35), 0 12px 24px -12px rgba(11,31,58,0.2);
    z-index: 950;
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: var(--sans, system-ui, sans-serif);
    transform-origin: bottom right;
    animation: pt-chat-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .pt-chat-panel.is-open { display: flex; }
  @keyframes pt-chat-in {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .pt-chat-head {
    background: var(--navy, #0B1F3A);
    color: var(--cream, #F4EFE6);
    padding: 18px 20px;
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
  }
  .pt-chat-head-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--amber, #C8932B); color: var(--navy, #0B1F3A);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 14px; flex-shrink: 0;
  }
  .pt-chat-head-meta { flex: 1; min-width: 0; }
  .pt-chat-head-title {
    font-size: 14px; font-weight: 600; line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .pt-chat-head-status {
    font-size: 11px; opacity: 0.65; margin-top: 2px;
    display: flex; align-items: center; gap: 6px;
  }
  .pt-chat-head-status::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; animation: pt-chat-pulse 2s ease-in-out infinite;
  }
  @keyframes pt-chat-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .pt-chat-head-close {
    background: none; border: none; cursor: pointer;
    color: var(--cream, #F4EFE6); padding: 6px;
    border-radius: 50%; opacity: 0.7;
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease;
  }
  .pt-chat-head-close:hover { opacity: 1; background: rgba(255,255,255,0.08); }
  .pt-chat-head-close svg { width: 16px; height: 16px; }

  .pt-chat-body {
    flex: 1; overflow-y: auto;
    padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
    scroll-behavior: smooth;
  }
  .pt-chat-body::-webkit-scrollbar { width: 6px; }
  .pt-chat-body::-webkit-scrollbar-thumb {
    background: rgba(11,31,58,0.15); border-radius: 3px;
  }

  .pt-msg { max-width: 82%; animation: pt-msg-in 0.3s ease; }
  @keyframes pt-msg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pt-msg-bot {
    align-self: flex-start;
    background: var(--cream, #F4EFE6);
    color: var(--navy, #0B1F3A);
    padding: 12px 16px;
    border-radius: 14px 14px 14px 4px;
    font-size: 14px; line-height: 1.5;
    border: 1px solid var(--line, rgba(11,31,58,0.08));
  }
  .pt-msg-user {
    align-self: flex-end;
    background: var(--navy, #0B1F3A);
    color: var(--cream, #F4EFE6);
    padding: 10px 14px;
    border-radius: 14px 14px 4px 14px;
    font-size: 14px; line-height: 1.4;
  }

  .pt-typing { align-self: flex-start; padding: 14px 18px; }
  .pt-typing span {
    display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: var(--navy, #0B1F3A);
    opacity: 0.35; margin: 0 2px;
    animation: pt-typing 1.2s ease-in-out infinite;
  }
  .pt-typing span:nth-child(2) { animation-delay: 0.15s; }
  .pt-typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes pt-typing {
    0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }

  .pt-chips {
    display: flex; flex-wrap: wrap; gap: 8px;
    align-self: stretch;
    animation: pt-msg-in 0.4s ease 0.05s both;
  }
  .pt-chip {
    background: transparent;
    border: 1px solid var(--navy, #0B1F3A);
    color: var(--navy, #0B1F3A);
    padding: 9px 14px;
    border-radius: 20px;
    font-family: inherit; font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    text-decoration: none;
    line-height: 1.3;
    display: inline-flex; align-items: center; gap: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .pt-chip:hover {
    background: var(--navy, #0B1F3A);
    color: var(--cream, #F4EFE6);
  }
  .pt-chip[data-href]::after {
    content: '↗'; font-size: 11px; opacity: 0.7;
  }

  .pt-chat-foot {
    padding: 12px 14px;
    border-top: 1px solid var(--line, rgba(11,31,58,0.1));
    background: var(--paper, #FAF6EE);
    flex-shrink: 0;
  }
  .pt-chat-input-row {
    display: flex; gap: 8px; align-items: center;
  }
  .pt-chat-input {
    flex: 1; min-width: 0;
    border: 1px solid var(--line, rgba(11,31,58,0.15));
    background: #fff;
    padding: 10px 14px;
    border-radius: 22px;
    font-family: inherit; font-size: 14px;
    color: var(--navy, #0B1F3A);
    outline: none;
    transition: border-color 0.15s ease;
  }
  .pt-chat-input:focus { border-color: var(--navy, #0B1F3A); }
  .pt-chat-send {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--navy, #0B1F3A); color: var(--cream, #F4EFE6);
    border: none; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .pt-chat-send:disabled { opacity: 0.35; cursor: not-allowed; }
  .pt-chat-send svg { width: 16px; height: 16px; }
  .pt-chat-foot-meta {
    margin-top: 8px;
    font-size: 10px; color: var(--muted, #6B7280);
    text-align: center; letter-spacing: 0.04em;
  }

  /* Mobile */
  @media (max-width: 480px) {
    .pt-chat-panel {
      right: 10px; left: 10px; bottom: 80px;
      width: auto; max-width: none;
      height: calc(100vh - 100px); max-height: calc(100vh - 100px);
      border-radius: 14px;
    }
    .pt-chat-fab { right: 14px; bottom: 14px; }
    .pt-chat-teaser {
      right: 78px; bottom: 22px; font-size: 13px;
      padding: 10px 14px; max-width: 200px;
    }
    .pt-chat-body { padding: 16px; gap: 12px; }
    .pt-msg-bot, .pt-msg-user { font-size: 13.5px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pt-chat-panel, .pt-msg, .pt-chips, .pt-chat-teaser, .pt-typing span {
      animation: none !important; transition: none !important;
    }
  }
  `;

  /* ---------- DOM ---------- */
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'pt-chat-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildDOM() {
    const fab = document.createElement('button');
    fab.className = 'pt-chat-fab';
    fab.setAttribute('aria-label', 'Open Proteam assistant');
    fab.setAttribute('type', 'button');
    fab.innerHTML = `
      <span class="pt-dot" aria-hidden="true"></span>
      <svg class="pt-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <svg class="pt-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;

    const teaser = document.createElement('div');
    teaser.className = 'pt-chat-teaser';
    teaser.setAttribute('role', 'button');
    teaser.setAttribute('tabindex', '0');
    teaser.innerHTML = `
      ${escapeHTML(CFG.teaser)}
      <button class="pt-chat-teaser-close" aria-label="Dismiss" type="button">×</button>
    `;

    const panel = document.createElement('div');
    panel.className = 'pt-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', CFG.name);
    panel.innerHTML = `
      <div class="pt-chat-head">
        <div class="pt-chat-head-avatar">P</div>
        <div class="pt-chat-head-meta">
          <div class="pt-chat-head-title">${escapeHTML(CFG.name)}</div>
          <div class="pt-chat-head-status">Usually replies instantly</div>
        </div>
        <button class="pt-chat-head-close" aria-label="Close chat" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="pt-chat-body" aria-live="polite"></div>
      <div class="pt-chat-foot">
        <form class="pt-chat-input-row" autocomplete="off">
          <input class="pt-chat-input" type="text" placeholder="Type a question or topic…" aria-label="Type your message">
          <button class="pt-chat-send" type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
        <div class="pt-chat-foot-meta">A guided navigator · not AI · privacy-friendly</div>
      </div>
    `;

    document.body.appendChild(teaser);
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    return { fab, teaser, panel };
  }

  /* ---------- HELPERS ---------- */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function scrollBodyToEnd(body) {
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  }

  /* ---------- DIALOG ---------- */
  let nodes;
  let isOpen = false;
  let teaserTimer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pushBotMessage(text) {
    const msg = el('div', 'pt-msg pt-msg-bot');
    msg.textContent = text;
    nodes.body.appendChild(msg);
    scrollBodyToEnd(nodes.body);
  }

  function pushUserMessage(text) {
    const msg = el('div', 'pt-msg pt-msg-user');
    msg.textContent = text;
    nodes.body.appendChild(msg);
    scrollBodyToEnd(nodes.body);
  }

  function pushTyping() {
    const t = el('div', 'pt-typing pt-msg', '<span></span><span></span><span></span>');
    nodes.body.appendChild(t);
    scrollBodyToEnd(nodes.body);
    return t;
  }

  function pushChips(chips) {
    const wrap = el('div', 'pt-chips');
    chips.forEach(chip => {
      let c;
      if (chip.href) {
        c = el('a', 'pt-chip');
        c.href = chip.href;
        c.setAttribute('data-href', '1');
        if (chip.href.startsWith('http') || chip.href.startsWith('mailto:') || chip.href.startsWith('tel:') || chip.href.startsWith('https://wa.me')) {
          c.setAttribute('target', '_blank');
          c.setAttribute('rel', 'noopener');
        }
      } else {
        c = el('button', 'pt-chip');
        c.type = 'button';
        c.dataset.next = chip.next || '';
      }
      c.textContent = chip.label;
      wrap.appendChild(c);
    });
    nodes.body.appendChild(wrap);
    scrollBodyToEnd(nodes.body);
  }

  function showNode(nodeId, opts) {
    const node = TREE[nodeId] || TREE.fallback;
    opts = opts || {};

    const reveal = () => {
      pushBotMessage(node.bot);
      if (node.chips && node.chips.length) pushChips(node.chips);
    };

    if (opts.skipTyping || reducedMotion) {
      reveal();
    } else {
      const t = pushTyping();
      setTimeout(() => {
        t.remove();
        reveal();
      }, CFG.typingDelay);
    }
  }

  function handleChipClick(e) {
    const btn = e.target.closest('.pt-chip');
    if (!btn) return;
    if (btn.tagName === 'A') return; // let link work normally
    e.preventDefault();
    const next = btn.dataset.next;
    if (!next) return;
    pushUserMessage(btn.textContent);
    showNode(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = nodes.input.value.trim();
    if (!text) return;
    nodes.input.value = '';
    pushUserMessage(text);
    const node = matchKeyword(text);
    showNode(node);
  }

  /* ---------- OPEN / CLOSE ---------- */
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    nodes.panel.classList.add('is-open');
    nodes.fab.classList.add('is-open');
    nodes.fab.classList.remove('has-notif');
    nodes.fab.setAttribute('aria-label', 'Close Proteam assistant');
    hideTeaser();
    // Focus the input shortly after the open animation
    setTimeout(() => {
      if (window.matchMedia('(min-width: 600px)').matches) nodes.input.focus();
    }, 280);
    // First-open: show greeting if body is empty
    if (!nodes.body.children.length) {
      showNode('root', { skipTyping: false });
    }
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    nodes.panel.classList.remove('is-open');
    nodes.fab.classList.remove('is-open');
    nodes.fab.setAttribute('aria-label', 'Open Proteam assistant');
  }

  function toggle() { isOpen ? closePanel() : openPanel(); }

  /* ---------- TEASER ---------- */
  function showTeaser() {
    if (sessionStorage.getItem(CFG.storageKey + ':teaser')) return;
    nodes.teaser.classList.add('is-visible');
    nodes.fab.classList.add('has-notif');
    teaserTimer = setTimeout(hideTeaser, CFG.teaserDuration);
  }

  function hideTeaser() {
    if (!nodes) return;
    nodes.teaser.classList.remove('is-visible');
    nodes.fab.classList.remove('has-notif');
    sessionStorage.setItem(CFG.storageKey + ':teaser', '1');
    if (teaserTimer) { clearTimeout(teaserTimer); teaserTimer = null; }
  }

  /* ---------- INIT ---------- */
  function init() {
    injectStyles();
    const built = buildDOM();
    nodes = {
      fab: built.fab,
      teaser: built.teaser,
      panel: built.panel,
      body: built.panel.querySelector('.pt-chat-body'),
      input: built.panel.querySelector('.pt-chat-input'),
      form: built.panel.querySelector('form'),
      headClose: built.panel.querySelector('.pt-chat-head-close'),
      teaserClose: built.teaser.querySelector('.pt-chat-teaser-close')
    };

    nodes.fab.addEventListener('click', toggle);
    nodes.headClose.addEventListener('click', closePanel);
    nodes.teaser.addEventListener('click', e => {
      if (e.target.closest('.pt-chat-teaser-close')) return;
      hideTeaser(); openPanel();
    });
    nodes.teaserClose.addEventListener('click', e => { e.stopPropagation(); hideTeaser(); });
    nodes.body.addEventListener('click', handleChipClick);
    nodes.form.addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closePanel();
    });

    // Show "Hi" teaser once per session, after a short delay
    setTimeout(showTeaser, CFG.teaserDelay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
