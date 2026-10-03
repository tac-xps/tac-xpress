# Greptile Code Reviewer & MCP Setup Guide

This guide details how to configure the **Greptile AI Code Reviewer** for `tac-xps/tac-xpress` on GitHub and configure the Model Context Protocol (MCP) server for IDE auto-fix workflows.

---

## 1. Prerequisites

- **Node.js**: Version $\ge 22.0.0$ (Current environment: `v24.13.1`).
- **GitHub Permissions**: Administrator or maintainer access on `tac-xps/tac-xpress`.
- **Git Remote**: Verified as `https://github.com/tac-xps/tac-xpress`.
- **Environment Notice**: Ensure `GREPTILE_API_KEY` is NOT set in your local shell before onboarding, as an environment API key overrides browser OAuth.

---

## 2. GitHub Integration

You can complete the onboarding using either the interactive CLI or the Greptile Web Dashboard.

### Method A: Interactive CLI Onboarding (Recommended)

1. **Install the Greptile CLI**:
   ```bash
   pnpm add -g greptile@latest
   ```
2. **Verify CLI Version**:
   ```bash
   greptile --version
   # Requires v3.2.0 or higher
   ```
3. **Execute the Setup Wizard**:
   Run this command in an interactive terminal at the repository root:
   ```bash
   cd c:\tac-xpress
   greptile onboard
   ```
4. **Follow Wizard Prompts**:
   - Provide your name, organization name (`tac-xps`), and URL handle.
   - Select **GitHub** as your code provider.
   - Complete the authorization in the browser window that opens.
   - Grant repository access to `tac-xps/tac-xpress`.
   - Greptile will automatically detect and import `AGENTS.md` and repository rules.
5. **Verify Completion**:
   The terminal will display:
   ```
   Greptile is ready to review your first PR!
   1 repo added · AI-rules files imported
   ```

### Method B: Web Dashboard Setup

1. Open [https://app.greptile.com](https://app.greptile.com) and sign in.
2. Navigate to **Code Providers** $\rightarrow$ **Connect GitHub Cloud**.
3. Select the `tac-xps` organization and install the **Greptile Apps** GitHub App.
4. Select `tac-xps/tac-xpress` and click **Enable**.
5. Verify that repository settings reflect `greptile.json`.

---

## 3. IDE MCP Server Configuration

Greptile's MCP server (`https://api.greptile.com/mcp`) enables AI agents in your editor to inspect PR review comments and apply fixes directly.

### Registered Configuration Files

The repository pre-configures Greptile MCP across editor environments:
- **VS Code / Antigravity IDE**: [`.vscode/mcp.json`](file:///c:/tac-xpress/.vscode/mcp.json)
- **Cursor IDE**: [`.cursor/mcp.json`](file:///c:/tac-xpress/.cursor/mcp.json)
- **Claude Code / Codex**: [`.mcp.json`](file:///c:/tac-xpress/.mcp.json)

### Authenticating the MCP Server
1. Trigger your first protected MCP tool call by prompting your IDE agent:
   > "List my Greptile custom context rules."
2. Follow the browser prompt to complete the one-time OAuth sign-in.
3. Once authenticated, the IDE agent can query review findings and apply fixes.

---

## 4. The Auto-Fix Loop

When a pull request receives review comments from Greptile:

1. Use the `greptile-reviewer` skill in your coding agent.
2. The agent fetches unaddressed comments via `list_merge_request_comments`.
3. The agent reviews the suggested code diffs, applies the changes, and runs local tests:
   ```bash
   pnpm run typecheck && pnpm run test:unit
   ```
4. The agent commits and pushes the fixes. Pushing commits touching the flagged files automatically marks Greptile comments as addressed.
5. The loop repeats until Greptile awards a **5/5 Confidence Score**.

---

## 5. Troubleshooting Common Issues

### Issue 1: `API key invalid or revoked` during onboarding
- **Cause**: A lingering `GREPTILE_API_KEY` exists in your shell environment.
- **Fix**: Run `unset GREPTILE_API_KEY` (or remove it from your environment variables) and restart the terminal.

### Issue 2: `greptile.json` settings not taking effect
- **Cause**: `greptile.json` was committed to a branch other than the PR source branch or repository root.
- **Fix**: Ensure `greptile.json` is located in the root directory on the branch under review.

### Issue 3: GitHub Organization not listed
- **Cause**: Greptile Apps lacks permissions on the organization.
- **Fix**: Open GitHub Organization Settings $\rightarrow$ GitHub Apps $\rightarrow$ Greptile Apps $\rightarrow$ Grant repository permissions.
