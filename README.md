# SkillMatch AI

SkillMatch AI is an AI-Powered Job Match Platform that helps find jobs based on the user's skills and preferences. The project is built as an Assignment for Internship at [Inreal](https://inreal.in) using a modern tech stack with TypeScript, Node.js, and Turborepo.

## 🛠️ Tech Stack

### Client/Frontend

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
- **Styling**:
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Origin UI](https://github.com/origin-space/originui)
  - [Motion primitive](https://github.com/ibelick/motion-primitives)
- **State Management**: [Tanstack Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) validation
- **Icons**:
  - [Tabler Icons](https://github.com/tabler/tabler-icons)
  - [Lucide](https://lucide.dev/)
- **Others**:
  - [Sonner](https://github.com/emilkowalski/sonner) - Toast notifications

### Server/Backend

- **Runtime**: [Node](https://nodejs.org/en) with [Bun Package Manager](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com) with TypeScript
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://github.com/better-auth/better-auth)
- **AI/ML**:
  - [Voyage AI](voyageai.com) - For semantic embeddings
  - Vector similarity search for job matching

### Development Tools

- **Package Manager**: Bun
- **Monorepo**: Turborepo
- **Type Checking**: TypeScript
- **Formatting & Liniting**: Biome & Prettier
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Bun >= 1.2.1
- Docker
- Git

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/shoaibshaikh07/skillmatch-ai.git
   cd skillmatch-ai
   ```

2. Start the server using Docker Compose:
   ```bash
   docker-compose up
   ```
   This will start the server app at http://localhost:3001
#####
3. In a separate terminal, start the client app:
   ```bash
   cd apps/client
   bun install  # or npm install
   bun run dev  # or npm run dev
   ```
   This will start the client app at http://localhost:3000
#####
4. To stop the server:
   ```bash
   docker-compose down
   ```

Note: The client app runs locally for better development experience with hot reloading, while the server runs in Docker for consistent environment management.

## 🔒 Environment Variables

<!-- Create a `.env` file in the root directory with the following variables: -->

##### Backend

Create a `.env` file in the `/apps/backend` directory with the following variables

```env
DATABASE_URL=your_database_url

VOYAGE_API_KEY=voyage_api_key

BETTER_AUTH_SECRET=secret

BETTER_AUTH_URL=client_base_url
```

##### Client

Create a `.env` file in the `/apps/client` directory with the following variables

```env
NEXT_PUBLIC_GEODB_API_KEY=geodb_api_key

NEXT_PUBLIC_API_BASE_URL=server_base_url
```

### Available Scripts

- `bun run dev` - Start development environment
- `bun run build` - Build all packages and applications
- `bun run lint` - Run linting across all packages
- `bun run format` - Format code using Prettier

## 🤖 AI Usage and Prompt Design

The AI system in SkillMatch AI uses vector embeddings and semantic similarity to match jobs with user profiles. Here's how it works:

### Vector Similarity Matching

The system uses Voyage AI's embedding model to create vector representations of both user profiles and job listings, enabling semantic matching:

1. **Profile Embedding Generation**

   ```typescript
   // Profile data is converted into a structured text input
   const profileEmbeddingInput = `
     Desired Job Type: ${userProfile.preferredJobType}
     Years of Experience: ${userProfile.yearsOfExperience} years
     Location: ${userProfile.location}
     Skills: ${userProfile.skills?.join(", ")}
   `;

   // Using Voyage AI's voyage-3-large model to generate embeddings
   const embeddings = await voyageai.embed({
     model: "voyage-3-large",
     input: profileEmbeddingInput,
   });
   ```

2. **Similarity Calculation**

   - Uses cosine similarity to measure the semantic match between profiles and jobs
   - Higher similarity scores (closer to 1) indicate better matches
   - Jobs with similarity > 0.7 are considered relevant
   - Results are ordered by similarity score (highest first)

3. **Job Recommendation Process**

   ```typescript
   // SQL query using cosine similarity
   const similarity = sql<number>`1 - (${cosineDistance(job.embedding, profileEmbedding)})`;

   // Filter and sort jobs based on similarity
   const similarJobs = await db
     .select({
       id: job.id,
       title: job.title,
       company: job.company,
       location: job.location,
       jobType: job.jobType,
       skills: job.skills,
       similarity,
     })
     .from(job)
     .where(
       and(
         gt(similarity, 0.7), // Only jobs with similarity > 0.7
         eq(job.applicationClosed, false), // Only active job postings
       ),
     )
     .orderBy(desc(similarity)) // Sort by similarity score
     .limit(3); // Return top 3 matches
   ```

### Key Features

1. **Semantic Understanding**

   - Goes beyond keyword matching
   - Understands context and meaning of skills and requirements
   - Considers job type preferences and experience levels

2. **Multi-factor Matching**

   - Job type compatibility
   - Experience level alignment
   - Location preferences
   - Skill set overlap

3. **Quality Filters**
   - Minimum similarity threshold (0.7)
   - Active job postings only
   - Limited to top 3 most relevant matches

### Technical Implementation

1. **Embedding Model**

   - Uses Voyage AI's `voyage-3-large` model
   - Generates 1024-dimensional vectors
   - Optimized for semantic understanding

2. **Database Integration**

   - Job embeddings stored in database
   - Efficient similarity search using cosine distance
   - Real-time recommendation generation

3. **Performance Considerations**
   - Pre-computed job embeddings
   - Efficient vector similarity calculations
   - Limited result set for quick response

### Example Usage

```typescript
// Client side job recommendation request
async function getJobRecommendations() {
  try {
    const response = await fetch("/api/jobs/suggest");
    const data = await response.json();

    if (!response.ok) {
      // Handle errors...
      return;
    }

    // data.jobs contains the top 3 most relevant jobs
    // Each job includes a similarity score
    return data.jobs.map((job) => ({
      ...job,
      similarity: Math.round(job.similarity * 100),
    }));
  } catch (error) {
    console.error("Failed to get job recommendations:", error);
  }
}
```

### Error Handling

The recommendation system handles various error cases:

1. **Profile Not Found**

   ```typescript
   // 401 Unauthorized
   {
     "error": "profile not found"
   }
   ```

2. **Embedding Generation Failure**

   ```typescript
   // 500 Internal Server Error
   {
     "error": "Failed to generate embeddings"
   }
   ```

3. **No Matching Jobs**
   - Returns empty array when no jobs meet similarity threshold
   - Client should handle empty results appropriately

## 📚 API Documentation

### Server API Endpoints

The server provides the following endpoints:

#### Authentication

- `POST /api/auth/{*any}`
  - Uses [better-auth](https://github.com/better-auth/better-auth) for secure authentication and authorization processes
  - Manages user authentication and access control

#### User Related Endpoints

- `GET /api/user/profile`

  - Returns the user's profile

  ```typescript
  // Response (Success)
  {
    "success": true,
    "profile": {
      "id": "string",
      "createdAt": "Date",
      "updatedAt": "Date",
      "userId": "string",
      "location": "string | null",
      "yearsOfExperience": "string | null",
      "skills": "string[] | null",
      "preferredJobType": "string | null"
    }
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 401 Unauthorized - User not found
  {
    "error": "User not found"
  }

  // 401 Unauthorized - Profile not found
  {
    "error": "Profile not found"
  }

  // 500 Internal Server Error
  {
    "error": "Failed to get profile"
  }
  ```

- `POST /api/user/profile`

  - Updates the user's profile

  ```typescript
  // Request
  {
    "location": "string",
    "yearsOfExperience": "string",
    "skills": Array<{
      "value": "string",
      "label": "string"
    }>,
    "preferredJobType": "string"
  }

  // Response (Success)
  {
    "success": true,
    "profile": {
      "id": "string",
      "createdAt": "Date",
      "updatedAt": "Date",
      "userId": "string",
      "location": "string | null",
      "yearsOfExperience": "string | null",
      "skills": "string[] | null",
      "preferredJobType": "string | null"
    }
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 400 Bad Request - Invalid input
  {
    "error": "Invalid input",
    "details": {
      "field": ["error message"]
    }
  }

  // 500 Internal Server Error
  {
    "error": "Failed to update profile"
  }
  ```

- `POST /api/user/onboarding`

  - Sets the user's profile details and onboarding status

  ```typescript
  // Request
  {
    "location": "string",
    "yearsOfExperience": "string",
    "skills": Array<{
      "value": "string",
      "label": "string"
    }>,
    "preferredJobType": "string"
  }

  // Response (Success)
  {
    "success": true,
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 400 Bad Request - Invalid input
  {
    "error": "Invalid input",
    "details": {
      "field": ["error message"]
    }
  }

  // 500 Internal Server Error
  {
    "error": "Failed to update profile"
  }
  ```

- `GET /api/user/onboarding`

  - Returns the onboarding status of the user

  ```typescript
  // Response (Success)
  {
    "success": true,
    "completed": boolean
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 401 Unauthorized - User not found
  {
    "error": "User not found"
  }

  // 500 Internal Server Error
  {
    "error": "Failed to get profile"
  }
  ```

#### Jobs

- `GET /api/jobs`

  - Returns a list of jobs

  ```typescript
  // Response (success)
  {
    "success": true,
    "jobs": {
        "id": number;
        "createdAt": Date | null;
        "updatedAt": Date | null;
        "location": string;
        "skills": string[] | null;
        "title": string;
        "company": string;
        "jobType": string;
        "applicationClosed": boolean | null;
        "embedding": number[] | null;
        "closedAt": Date | null;
    }[],
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 402 Not Found - No jobs found
  {
    "error": "Failed to get jobs"
  }
  ```

- `GET /api/jobs/suggest`

  - Returns a list of 3 suggested jobs based on the user's profile

  ```typescript
  // Response (Success)
  {
    "success": true,
    "jobs": {
        "id": number;
        "createdAt": Date | null;
        "updatedAt": Date | null;
        "location": string;
        "skills": string[] | null;
        "title": string;
        "company": string;
        "jobType": string;
        "applicationClosed": boolean | null;
        "embedding": number[] | null;
        "closedAt": Date | null;
    }[],
  }

  // Error Responses
  // 401 Unauthorized - No valid session
  {
    "error": "Unauthorized"
  }

  // 401 Unauthorized - User not found
  {
    "error": "User not found"
  }

  // 500 Internal Server Error
  {
    "error": "Failed to get suggested jobs"
  }
  ```

## 🏗️ Code Architecture

The project follows a monorepo structure using Turborepo:

```
skillmatch-ai/
├── apps/
│   ├── client/          # Frontend application
│   └── backend/          # Backend API server
└── package.json         # Root package.json
```

### Key Components

1. **Client Application**

   - Built with React/Next.js
   - Handles user interface and interactions
   - Communicates with the server API

2. **Server Application**

   - Node.js/Express backend
   - Handles AI processing and matching
   - Manages API endpoints

3. **Shared Package**
   - Common types and zod schemas

### Development Workflow

1. All shared code lives in the `packages` directory
2. Applications are developed in the `apps` directory
3. Use `npm run dev` or `bun run dev` for local development
4. Changes in shared packages are automatically reflected in applications

## Deployment

### Server
We will deploy our server to [Render](https://render.com) using [Docker](https://www.docker.com), follow the steps below:

1. Create a Render account (if you don't have one) and connect your GitHub account.
2. Create new `Web Service` and select `Docker` as the Language.
3. Enter `apps/backend` as the `Root Directory`.
4. Set all the environment variables in the `Environment Variables` section.
5. Click `Deploy Web Service`.
6. Once the deployment is complete, you can access your deployed server at `https://<your-app-name>.onrender.com`.

### Client
We will deploy our client to [Vercel](https://vercel.com), follow the steps below:

1. Create a Vercel account (if you don't have one) and connect your GitHub account.
2. Create a new project and select `Next.js` as the Framework.
3. Enter `apps/client` as the `Root Directory`.
4. Set all the environment variables in the `Environment Variables` section.
5. Click `Deploy`.
6. Once the deployment is complete, you can access your deployed client at `https://<your-app-name>.vercel.app`.

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
