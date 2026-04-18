# LastroForge Architecture

LastroForge is a decentralised ecosystem where the wallet is the power plant of the economy.

## 1. System Layers

### Infrastructure Layer (Blockchain-like)
- **Engine**: Ethereum L2 (zkSync / Starknet) for scalability and privacy.
- **Account Abstraction (ERC-4337)**: Enables social recovery and gasless transactions for a seamless UX.
- **Privacy Core**: Optional ZK-proofs for anonymous transfers using Railgun-inspired tech.

### Data Layer
- **Smart Contracts**: Solidity-based factory and provenance trackers.
- **Storage**: IPFS and Arweave for persistent artifact assets and metadata.
- **Indexing**: The Graph for real-time querying of provenance trees.

### Application Layer
- **Frontend**: React/TypeScript dashboard with Motion animations.
- **Backend (Hybrid)**: Node.js/Express for off-chain metadata caching and WebSocket event broadcasting.
- **AI Engine**: Gemini integration for procedurally generated artifacts during the "Forge" process.

## 2. Sequence Diagrams

### Artifact Creation & Minting
1. User enters **Forge** UI.
2. AI generates potential metadata based on user intent.
3. User confirms and signs a **Mint Transaction** (Abstraction layer handles gas).
4. Smart Contract emits `Minted` event.
5. Indexer updates the **Provenance Tree**.

### Provenance-Based Value Accrual
1. Artifact transferred to a "High Rep" owner.
2. Transfer recorded in `ProvenanceTracker.sol`.
3. System logic (Dynamic Metadata) updates the visual state of the artifact (e.g., adds a "Glow" or "History Seal").
4. Asset value increases as a function of the length and quality of the possession chain.
