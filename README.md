# IDEON

**AI Startup Builder — a stateful, evidence-backed multi-agent platform for evaluating and refining startup ideas.**

## Overview

IDEON helps founders turn a startup idea into a structured and research-backed startup strategy.

Instead of generating a single static AI response, IDEON maintains a **Startup State** containing the startup's assumptions, research, evidence, analysis, risks, and recommendations.

Specialized AI agents orchestrated with **LangGraph** analyze the startup and update relevant parts of this state.

The system is designed to continuously refine the startup as assumptions and new information change.

## Core Workflow

```text
Startup Idea
    ↓
Startup State
    ↓
Multi-Agent Analysis
    ↓
Research + Evidence
    ↓
Assumption Evaluation
    ↓
Risk / Contradiction Detection
    ↓
Strategic Verdict
    ↓
Validation Experiments
    ↓
Founder Action / New Information
    ↓
Update Startup State
    ↓
Impact Analysis
    ↓
Selective Re-execution
    ↓
Updated Startup Strategy


