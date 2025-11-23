import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        },
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: {
        // Node.js globals
        "process": "readonly",
        "require": "readonly",
        "module": "readonly",
        "__dirname": "readonly",
        "__filename": "readonly",
        "Buffer": "readonly",
        "global": "readonly",
        
        // Browser globals
        "window": "readonly",
        "document": "readonly",
        "console": "readonly",
        "setTimeout": "readonly",
        "clearTimeout": "readonly",
        "setInterval": "readonly",
        "clearInterval": "readonly",
        "requestAnimationFrame": "readonly",
        "cancelAnimationFrame": "readonly",
        "fetch": "readonly",
        "btoa": "readonly",
        "history": "readonly",
        "IntersectionObserver": "readonly",
        
        // Service Worker globals
        "self": "readonly",
        "caches": "readonly",
        
        // React globals
        "React": "readonly",
        
        // TypeScript globals
        "MouseEvent": "readonly",
        "HTMLDivElement": "readonly",
        "HTMLButtonElement": "readonly",
        "KeyboardEvent": "readonly",
        "HTMLElement": "readonly",
        "HTMLInputElement": "readonly",
        "HTMLTextAreaElement": "readonly",
        "HTMLFormElement": "readonly",
        "DOMHighResTimeStamp": "readonly",
        "Window": "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "react": react,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
      "jsx-a11y": jsxA11y,
      "import": importPlugin,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      
      // React rules
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js rules
      "@next/next/no-img-element": "warn",
      
      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      
      // Import rules
      "import/no-anonymous-default-export": "off",
      
      // Global variables
      "no-undef": "off",
      "no-useless-escape": "off"
    }
  }
];
