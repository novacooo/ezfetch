# ⚡ ezfetch

> 🚧 This library is currently in early development (v0.x.x). API is not yet stable.

**ezfetch** is a lightweight, chainable wrapper around the native `Fetch API`. Built with the builder pattern for clean, readable requests in Node.js and browser apps.

---

## ✨ Features

- 🔗 Fluent, builder-style syntax
- 💡 Minimal and tree-shakeable
- ✅ Works in both Node and browser environments
- 🧪 Great for testing and mocking
- 📦 Zero dependencies

---

## 🚀 Quick Start

> 🛠️ Coming soon...

## 🧐 Example usage

```typescript
import { ezfetch } from "@novacooo/ezfetch";

const api = ezfetch.create("https://example.com");

const products = await api.get("/products")
  .query({ limit: 10, offset: 0 })
  .json<{ id: number; name: string }[]>();

console.log(products); // [{ id: 1, name: 'product' }]
```