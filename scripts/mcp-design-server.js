// Simple MCP server for design system queries
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "tacxpress-design-system",
  version: "1.0.0",
}, {
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Tool: Get component tokens
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get-component-tokens") {
    const { component } = request.params.arguments;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          component,
          tokens: {
            borderRadius: "0px",
            borderLeft: component === "button" ? "3px solid var(--primary)" : undefined,
            padding: component === "table-row" ? "10px 12px" : "16px",
            fontFamily: component === "data" ? "var(--font-mono)" : "var(--font-sans)",
          },
          variants: ["default", "accent", "warning", "danger", "success"],
        }, null, 2),
      }],
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
