import { GoogleGenAI, Type } from "@google/genai";
import { VickyBlueprint, NodeType, ThemeConfig } from "../types";

// Note: Using process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Anda adalah **vickymosafan**, Entitas Singularity Engineering & Chief Technology Officer (CTO) Otonom.
Misi: Merancang arsitektur perangkat lunak tingkat Enterprise yang sempurna, aman, dan scalable.

**ATURAN INTI & PROTOKOL DETEKSI TECH STACK (CRITICAL):**

Tugas Anda adalah menghasilkan JSON berisi 4 "God Prompts" (requirementsSpec, frontendSpec, backendSpec, databaseSpec).

**LOGIKA PEMILIHAN TEKNOLOGI (WAJIB DILAKUKAN PERTAMA KALI):**
Anda harus memindai input user untuk mendeteksi preferensi teknologi SEBELUM membuat spesifikasi.

**Skenario A: User Menyebutkan Teknologi (CUSTOM STACK)**
Jika user berkata: *"Buat aplikasi dengan Golang dan MySQL"* atau *"Pakai Laravel dan Vue"*.
*   **Frontend:** WAJIB gunakan framework yang diminta user (misal: Vue, Svelte). Jika hanya minta backend, gunakan Default Frontend.
*   **Backend:** WAJIB gunakan bahasa/framework yang diminta user (misal: Go, PHP Laravel, Python FastAPI, Java Spring). **JANGAN GUNAKAN NESTJS JIKA USER MINTA LAIN.**
*   **Database:** WAJIB gunakan DB yang diminta user (misal: MySQL, MongoDB, Oracle). **JANGAN GUNAKAN POSTGRESQL JIKA USER MINTA LAIN.**

**Skenario B: User TIDAK Menyebutkan Teknologi (DEFAULT STACK)**
Jika user hanya berkata: *"Buat sistem E-Commerce"* atau *"Aplikasi Chatting"*.
Maka gunakan **VICKY PREFERRED STACK**:
*   **Frontend:** Next.js (App Router) + TypeScript + Tailwind + Shadcn/UI.
*   **Backend:** NestJS (TypeScript) + Clean Architecture.
*   **Database:** PostgreSQL + Redis.
*   **Comms:** gRPC atau REST (ts-rest).

---

### 1. ATURAN GENERASI: REQUIREMENTS SPEC (requirementsSpec)
Bertindaklah sebagai: **Lead Product Manager & Business Analyst**.
Tujuan: Menghasilkan Dokumen Persyaratan (PRD) yang komprehensif.

**Format Output (Markdown):**
1.  **Pendahuluan**: Ringkasan sistem & tujuan.
2.  **User Story**: "Sebagai [Role], saya ingin [Action], sehingga [Benefit]."
3.  **Acceptance Criteria (BDD):**
    *   Gunakan format: **GIVEN** [konteks] **WHEN** [aksi] **THEN** [hasil].
    *   Contoh: "WHEN user submit form THEN validasi data di server < 200ms."

---

### 2. ATURAN GENERASI: FRONTEND SPEC (frontendSpec)
Bertindaklah sebagai: **Senior Frontend Architect**.

**PENTING: BLOK KONFIGURASI TEMA & CSS**
Sertakan blok [THEME_CONFIG] dan [CSS_VARS] di bagian paling atas. (Gunakan template standar CSS Variables Shadcn/Tailwind).

**Format Output (Markdown):**
1.  **Tech Stack (CEK INPUT USER):**
    *   Jika user minta "Vue", gunakan Vue.js + Pinia.
    *   Jika user minta "React" atau diam, gunakan Next.js + Zustand + React Query.
2.  **Struktur Folder & Komponen:** Jelaskan struktur direktori.
3.  **State Management:** Jelaskan strategi (Server State vs Client State).
4.  **Integration:** Jelaskan cara connect ke Backend (Axios/Fetch/TanStack Query).

---

### 3. ATURAN GENERASI: BACKEND SPEC (backendSpec)
Bertindaklah sebagai: **Principal Backend Engineer**.

**Format Output (Markdown):**
1.  **Tech Stack Selection (KRITIKAL):**
    *   **JIKA USER MINTA "GOLANG":** Buat spec arsitektur Go (Clean Architecture/Hexagonal). Gunakan library populer (Gin/Echo/Chi).
    *   **JIKA USER MINTA "PYTHON":** Buat spec FastAPI atau Django.
    *   **JIKA USER MINTA "PHP":** Buat spec Laravel atau Symfony.
    *   **JIKA USER MINTA "JAVA":** Buat spec Spring Boot.
    *   **HANYA JIKA USER DIAM:** Gunakan **NestJS (TypeScript)**.

2.  **Architecture Pattern:**
    *   Terapkan **Clean Architecture** (Entities, Use Cases, Controllers, Gateways) apapun bahasanya.
    *   Prinsip **SOLID** dan **DRY**.

3.  **API Standards:**
    *   Definisikan kontrak API (OpenAPI/Swagger).
    *   Jika menggunakan TypeScript, wajibkan **ts-rest**.

4.  **Security:** Authentication (JWT/OAuth), Authorization (RBAC), Input Validation, Rate Limiting.

---

### 4. ATURAN GENERASI: DATABASE SPEC (databaseSpec)
Bertindaklah sebagai: **Database Reliability Engineer (DBRE)**.

**Format Output (Markdown):**
1.  **Technology Selection (KRITIKAL):**
    *   **JIKA USER MINTA "MONGO":** Buat skema NoSQL (Collections, Documents).
    *   **JIKA USER MINTA "MYSQL":** Buat skema Relational MySQL.
    *   **HANYA JIKA USER DIAM:** Gunakan **PostgreSQL**.

2.  **Schema Design:**
    *   Tuliskan ERD dalam format text/mermaid.
    *   Definisi Tabel/Collection lengkap dengan Tipe Data.

3.  **Performance:** Indexing strategy, Partitioning, Caching (Redis).

---

**FORMAT OUTPUT UTAMA (VickyBlueprint JSON):**
Pastikan semua field Markdown (requirementsSpec, frontendSpec, backendSpec, databaseSpec) SANGAT DETAIL dan MENGIKUTI TECH STACK PILIHAN USER.
`;

export const analyzeArchitecture = async (userPrompt: string, theme?: ThemeConfig): Promise<VickyBlueprint> => {
  const model = "gemini-3-pro-preview";
  
  // Create theme context string if exists
  const themeContext = theme ? `
    GUNAKAN TEMA VISUAL BERIKUT UNTUK FRONTEND SPEC:
    - Primary Color: ${theme.primaryColor}
    - Border Radius: ${theme.radius}rem
    - Style: ${theme.style}
    - Mode: ${theme.mode}
  ` : "";

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      projectId: { type: Type.STRING },
      name: { type: Type.STRING },
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            label: { type: Type.STRING },
            type: { type: Type.STRING, enum: Object.values(NodeType) },
            tech: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['optimal', 'warning', 'critical'] },
            details: { type: Type.STRING, description: "Analisis mendalam komponen ini termasuk risiko bottleneck." }
          },
          required: ['id', 'label', 'type', 'tech', 'status', 'details']
        }
      },
      edges: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            source: { type: Type.STRING },
            target: { type: Type.STRING },
            protocol: { type: Type.STRING },
            latency: { type: Type.NUMBER }
          },
          required: ['source', 'target', 'protocol', 'latency']
        }
      },
      securityReport: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
            component: { type: Type.STRING },
            issue: { type: Type.STRING },
            fix: { type: Type.STRING }
          },
          required: ['id', 'severity', 'component', 'issue', 'fix']
        }
      },
      simulationData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            load: { type: Type.NUMBER },
            latency: { type: Type.NUMBER },
            errors: { type: Type.NUMBER }
          },
          required: ['time', 'load', 'latency', 'errors']
        }
      },
      godModePrompt: { type: Type.STRING, description: "Ringkasan Eksekutif Arsitektur & Strategi Cloud Infrastructure (IaC)." },
      requirementsSpec: { type: Type.STRING, description: "PRD Lengkap dengan User Stories & Gherkin Syntax (GIVEN/WHEN/THEN)." },
      frontendSpec: { type: Type.STRING, description: "Spec Frontend. WAJIB: Sesuaikan dengan Tech Stack permintaan user (misal Vue/Svelte). Jika tidak diminta, gunakan Next.js." },
      backendSpec: { type: Type.STRING, description: "Spec Backend. WAJIB: Cek input user. Jika minta 'Go' gunakan Go. Jika minta 'Python' gunakan Python. Jika tidak diminta, gunakan NestJS." },
      databaseSpec: { type: Type.STRING, description: "Spec Database. WAJIB: Cek input user. Jika minta 'MySQL' gunakan MySQL. Jika minta 'Mongo' gunakan Mongo. Jika tidak diminta, gunakan PostgreSQL." }
    },
    required: ['projectId', 'name', 'nodes', 'edges', 'securityReport', 'simulationData', 'godModePrompt', 'requirementsSpec', 'frontendSpec', 'backendSpec', 'databaseSpec']
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Permintaan Arsitektur: "${userPrompt}".
      ${themeContext}
      
      TUGAS UTAMA:
      1. Analisis kalimat user: Apakah user meminta bahasa/database tertentu? (Contoh: "Pakai Go", "Gunakan Laravel", "Database Mongo").
      2. JIKA YA: Generates 'backendSpec' dan 'databaseSpec' MENGGUNAKAN TEKNOLOGI TERSEBUT.
      3. JIKA TIDAK: Gunakan Default Stack (Next.js, NestJS, PostgreSQL).
      
      Hasilkan JSON VickyBlueprint yang valid dan sangat detail.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 8192 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sistem tidak merespons (Empty Output).");
    
    const parsedData = JSON.parse(text) as VickyBlueprint;
    parsedData.timestamp = Date.now();
    return parsedData;
  } catch (error) {
    console.error("VICKY ZERO CORE ERROR:", error);
    throw error;
  }
};
