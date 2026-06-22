function setDependency(pkg, field, name, version) {
  if (!pkg[field]?.[name]) return
  pkg[field][name] = version
}

function readPackage(pkg) {
  switch (pkg.name) {
    case "next":
      if (pkg.version === "16.2.9") {
        setDependency(pkg, "dependencies", "postcss", "8.5.15")
      }
      break
    case "typeid-js":
      if (pkg.version === "1.2.0") {
        setDependency(pkg, "dependencies", "uuid", "11.1.1")
      }
      break
    case "terser-webpack-plugin":
      if (pkg.version === "5.6.1") {
        setDependency(pkg, "optionalDependencies", "esbuild", "0.28.1")
      }
      break
    case "@opentelemetry/otlp-transformer":
      if (pkg.version === "0.208.0") {
        setDependency(pkg, "dependencies", "protobufjs", "7.6.3")
      }
      break
    case "@storybook/mcp":
    case "@storybook/addon-mcp":
      setDependency(pkg, "dependencies", "valibot", "1.4.1")
      break
    case "@tmcp/adapter-valibot":
    case "@valibot/to-json-schema":
      setDependency(pkg, "peerDependencies", "valibot", "^1.4.0")
      setDependency(pkg, "dependencies", "valibot", "1.4.1")
      break
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
