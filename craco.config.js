// craco.config.js
const path = require("path");
require("dotenv").config();

// Determine environment
const isDevServer = process.env.NODE_ENV !== "production";

// Config flags
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  enableVisualEdits: isDevServer,
};

// Health check modules (conditionally)
let WebpackHealthPlugin, setupHealthEndpoints, healthPluginInstance;
if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

// Visual edits modules (conditionally)
let setupDevServer, babelMetadataPlugin;
if (config.enableVisualEdits) {
  try {
    babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
    setupDevServer = require("./plugins/visual-edits/setup-dev-server");
  } catch (err) {
    console.warn("Visual edits plugin not found, skipping...");
  }
}

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      // Force PostCSS to use our postcss.config.js so Tailwind runs with correct context
      const patchPostcssLoader = (use) => {
        if (!Array.isArray(use)) return;
        const postcssLoader = use.find(
          (u) =>
            (typeof u === "object" && u.loader && String(u.loader).includes("postcss-loader")) ||
            (typeof u === "string" && u.includes("postcss-loader"))
        );
        if (postcssLoader && typeof postcssLoader === "object" && postcssLoader.options) {
          postcssLoader.options.postcssOptions = {
            config: true,
            configPath: path.resolve(__dirname),
          };
        }
      };
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((r) => {
            if (r.use) patchPostcssLoader(r.use);
          });
        } else if (rule.use) {
          patchPostcssLoader(rule.use);
        }
      });

      // Add watch ignore patterns to speed up dev
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      // Add health plugin if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      // Add babel plugin for visual edits if enabled
      if (config.enableVisualEdits && babelMetadataPlugin) {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.loader && rule.loader.includes("babel-loader")) {
            rule.options = {
              ...rule.options,
              plugins: [...(rule.options.plugins || []), babelMetadataPlugin],
            };
          }
        });
      }

      return webpackConfig;
    },
  },

  devServer: (devServerConfig) => {
    // Visual edits setup
    if (config.enableVisualEdits && setupDevServer) {
      devServerConfig = setupDevServer(devServerConfig);
    }

    // Health check endpoints
    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      const originalSetupMiddlewares = devServerConfig.setupMiddlewares;
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        if (originalSetupMiddlewares) {
          middlewares = originalSetupMiddlewares(middlewares, devServer);
        }
        setupHealthEndpoints(devServer, healthPluginInstance);
        return middlewares;
      };
    }

    return devServerConfig;
  },
};
