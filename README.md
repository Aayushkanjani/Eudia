# Kalakaari - AI-Powered Art Authentication & Marketplace

> Empowering artisans with AI-verified digital identity through conversational AI and blockchain provenance.

---

## � Overview

Kalakaari is a comprehensive platform that combines **Google Gemini AI**, **blockchain technology**, and **multi-modal vector search** to protect artisan intellectual property and create a trusted marketplace for authentic art.

### Key Features

- 🤖 **Conversational AI Onboarding** - Natural language art registration using Google Gemini
- 🔍 **AI Duplicate Detection** - Multi-modal similarity search (image + text)
- ⛓️ **Blockchain Provenance** - Immutable proof-of-creation on Polygon
- 🛍️ **Smart Marketplace** - Dual-index vector search with Pinecone
- ✅ **Digital Certificates** - QR-code enabled verification for physical artworks

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Google Cloud Run (Hosting)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Shop Frontend (Angular) ←→ Shop Backend (FastAPI)     │
│                                                         │
│  Agentic Web-UI ←→ Agentic Service (Gemini + ADK)     │
│                                                         │
│  Master-IP Backend (FastAPI)                           │
│    ├─ /create    - Generate CraftID                    │
│    ├─ /verify    - Blockchain verification             │
│    ├─ /search    - Multi-modal search                  │
│    └─ Chain Batcher (Background Worker)                │
│                                                         │
│  Databases:                                             │
│    ├─ MongoDB Atlas (CraftIDs, Products)               │
│    ├─ Pinecone (Vector Search)                         │
│    ├─ Neon PostgreSQL (Agent Sessions)                 │
│    └─ Polygon Blockchain (Immutable Anchoring)         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Google AI & Cloud
- **Google Gemini 2.0 Flash** - Conversational AI
- **Google Agent Development Kit (ADK)** - Agent framework
- **Firebase Authentication** - User management
- **Google Cloud Run** - Serverless hosting
- **Angular** - Frontend framework

### AI/ML
- **OpenAI CLIP (ViT-B/32)** - Image embeddings
- **Sentence-Transformers** - Text embeddings
- **Pinecone** - Vector database

### Backend
- **Python & FastAPI** - Microservices
- **MongoDB Atlas** - NoSQL database
- **Neon PostgreSQL** - Relational database
- **Web3.py** - Blockchain integration

### Blockchain
- **Solidity** - Smart contracts
- **Polygon (Amoy Testnet)** - Blockchain network

---

## � Prerequisites

Before setting up the project, ensure you have:

- **Python 3.11+** installed
- **Node.js 18+** and npm installed
- **Git** for version control
- **MongoDB Atlas** account (free tier)
- **Pinecone** account (free tier)
- **Neon** PostgreSQL account (free tier)
- **Google API Key** (from Google AI Studio)
- **MetaMask wallet** with Polygon Amoy testnet configured
- **Polygon Amoy testnet MATIC** (get from faucet)
