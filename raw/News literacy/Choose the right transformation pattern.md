---
title: "Choose the right transformation pattern"
source: "https://learn.microsoft.com/en-us/agents/adoption-patterns/choose-pattern"
author:
  - "[[manuelap-msft]]"
published:
created: 2026-08-04
description: "Explore the six agentic transformation patterns for agentic AI and understand how each pattern demands different organizational maturity."
tags:
  - "clippings"
---
Many organizations begin their AI journey with a broad mandate to "do AI", but that framing rarely leads to meaningful progress. Transformation patterns give that ambition shape. Each pattern represents a distinct strategic intent: a specific answer to *what kind of value you're creating, for whom, and how agents make that possible*. By aligning on a pattern early, teams move from vague AI initiatives to targeted conversations about vision, investment, and outcomes.

This article introduces the six patterns and explains how the maturity requirements differ across them. Use this overview to understand the full landscape before deep-diving into the specific pattern that matches your current priorities.

## The six patterns at a glance

Each pattern identifies a *scale-breaker*, the capability driver most likely to limit your ability to scale a pattern. It's the constraint you need to address first if you want sustainable scale.

| Pattern | Purpose | Who or what the agent serves | Assist or execute | Scale-breaker |
| --- | --- | --- | --- | --- |
| [Employee AI enablement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-employee-ai-enablement) | Make every employee more capable | The individual employee | Assist | Organization and culture |
| [Business expert empowerment](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-business-expert-empowerment) | Scale an expert's knowledge | Anyone who needs the expert's guidance | Assist | Technology and data (knowledge quality) |
| [Workplace and IT services](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services) | Run internal services end-to-end | Employees using IT, HR, and finance services | Execute | Business strategy (service design) |
| [Core business process transformation](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-core-business-process) | Transform business-critical workflows | The business and its customers | Execute | Business strategy (process redesign) |
| [External engagement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-external-engagement) | Serve customers and partners directly | People outside the organization | Execute | Governance and security |
| [AI-first capabilities](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-ai-first-capabilities) | Create net-new capabilities | A new capability or market | Execute | Technology and data (orchestration) |

## How patterns differ in maturity requirements

The five capability drivers remain consistent across all patterns. What changes is the depth of maturity required in each driver. Use the following table to understand where each pattern concentrates its demands.

| Pattern | AI Strategy and experience | Business strategy | Governance and security | Technology and data | Organization and culture |
| --- | --- | --- | --- | --- | --- |
| Employee AI enablement | 200 | 200–300 | 200 | 200–300 | **300** |
| Business expert empowerment | 200 | 200 | **300** | **300** | **300** |
| Workplace and IT services | 300–400 | **400** | **400** | 300 | 200–300 |
| Core business process transformation | **500** | **500** | 400 | 400 | 400 |
| External engagement | 300–400 | 400 | **500** | 400 | 200 |
| AI-first capabilities | **500** | **500** | **500** | **500** | **500** |

## Start from intent, not technology

The fastest way to find your pattern is to name what's driving your AI agenda. Three motivations map cleanly to the patterns:

- **Enrich employee experiences.** Start with [Employee AI enablement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-employee-ai-enablement), then [Business expert empowerment](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-business-expert-empowerment) to scale your specialists.
- **Reshape business processes.** Start with [Workplace and IT services](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services), then [Core business process transformation](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-core-business-process) for mission-critical flows.
- **Reinvent customer engagement.** Choose [External engagement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-external-engagement).

If your goal is to do something you couldn't do before, use [AI-first capabilities](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-ai-first-capabilities) to drive innovation.

## How to choose

Choosing a pattern is an alignment exercise. You're balancing two things: the *business outcomes and vision* you want to reach, which is your ambition, and your *readiness* to deliver them, which is your maturity. The right pattern is the one that matches a meaningful outcome and a level of readiness you can realistically reach. Work through the following four steps.

### Step 1: Define the outcome and vision you want

Start with the business result, stated as a measurable change rather than a technology. Examples include lower cost to serve, faster cycle time, higher output quality, more expert capacity, a better customer experience, and new revenue.

Then connect that result to your longer-term vision. How far do you intend to take this part of the business with agents over the next one to three years? Your first outcome sets the entry point. Your vision sets the destination.

Map the outcome to a pattern using [the six patterns](#the-six-patterns-at-a-glance) and [start from intent, not technology](#start-from-intent-not-technology). The same broad goal can land on different patterns depending on ambition. "Improve customer service," for instance, could map to [Employee AI enablement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-employee-ai-enablement) to make your service agents faster, [Workplace and IT services](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services) to run internal service requests, or [External engagement](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-external-engagement) to put an agent in front of customers. Be explicit about which one you mean.

### Step 2: Assess your readiness

Rate where you are today across the five capability drivers using the [adoption maturity model](https://learn.microsoft.com/en-us/agents/adoption-maturity-model/):

- **AI strategy and experience:** Where AI fits in your priorities.
- **Business strategy:** How AI connects to business outcomes.
- **Governance and security:** What agents are allowed to do.
- **Technology and data:** Whether your foundation supports scale.
- **Organization and culture:** Whether people are ready to change.

Your readiness profile is an honest snapshot of what you own, govern, and run today—not what you aspire to. Note your weakest driver because it limits how much you can do, no matter how strong the others are.

### Step 3: Align ambition with readiness

Each pattern has a target maturity profile. Lay your readiness profile over the target for the pattern your outcome points to, and identify the gap:

| Your readiness versus the pattern's target | What it means | What to do |
| --- | --- | --- |
| Meets or exceeds the target | Strong fit now | Proceed. Deliver, then scale. |
| One or two drivers fall short | You have a clear scale-breaker | Close that gap first, or run a bounded pilot while you close it. |
| Several drivers fall well short | Ambition is outrunning readiness | Choose a more accessible pattern as a stepping stone, one that builds the very capabilities the ambitious pattern needs. |

The biggest readiness jump is the assist-to-execute line. Patterns where agents only *assist* (Employee AI enablement, Business expert empowerment) keep governance light. Patterns where agents *execute* (the other four) demand much higher governance, security, and business-strategy maturity, because the agent acts in systems, runs a process, or faces customers. If your vision is an execute pattern but your readiness is assistive, start on the assist side to build the necessary capabilities.

### Step 4: Sequence and revisit

Most organizations run two or three patterns at once. Start with the patterns that have high outcome value *and* the smallest readiness gap. Early wins build the culture, platform, and governance maturity that harder patterns need. They also fund bigger bets.

Reassess quarterly. As your maturity rises, patterns that were out of reach move from "far" to "close," and your destination vision becomes a realistic next step.

### Guardrails

Keep these constraints in mind when finalizing your pattern selection:

- **Cap at two or three patterns.** Your weakest capability is your ceiling. Don't pick patterns that exceed your current or near-term maturity.
- **Leadership decides, informed bottom-up.** Pattern selection must be a leadership commitment, not a bottom-up wish list.
- **Every pattern needs a named outcome and owner.** No owner means it's a wish, not a choice.

## Next steps

Explore the patterns that match your ambition in more detail:

- [Employee AI enablement pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-employee-ai-enablement)
- [Business expert empowerment pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-business-expert-empowerment)
- [Workplace and IT services pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services)
- [Core business process transformation pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-core-business-process)
- [External engagement pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-external-engagement)
- [AI-first capabilities pattern](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-ai-first-capabilities)