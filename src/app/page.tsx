import Link from 'next/link';
import styles from './page.module.css';

const layers = [
  {
    name: 'Domain',
    path: 'src/domain/',
    color: '#6366f1',
    description:
      'Entities, Value Objects, Domain Services, Repository Interfaces. Zero external dependencies.',
    items: ['Post entity', 'PostId / PostTitle / PostContent value objects', 'IPostRepository interface', 'PostSlugService domain service'],
  },
  {
    name: 'Application',
    path: 'src/application/',
    color: '#10b981',
    description:
      'Use Cases, DTOs, Mappers, Application Services. Orchestrates domain; no I/O.',
    items: ['CreatePostUseCase', 'GetPostUseCase', 'ListPostsUseCase', 'PublishPostUseCase', 'DeletePostUseCase'],
  },
  {
    name: 'Infrastructure',
    path: 'src/infrastructure/',
    color: '#f59e0b',
    description:
      'Concrete implementations of domain interfaces. DB clients, HTTP clients, ID generators.',
    items: ['InMemoryPostRepository', 'UuidGenerator', 'DI container (container.ts)'],
  },
  {
    name: 'Interfaces',
    path: 'src/interfaces/',
    color: '#ec4899',
    description:
      'HTTP controllers, Next.js API routes, React pages. Thin adapters — no business logic.',
    items: ['PostController', 'API routes (/api/posts)', 'This React page'],
  },
];

const endpoints = [
  { method: 'GET',    path: '/api/posts',              description: 'List all posts' },
  { method: 'POST',   path: '/api/posts',              description: 'Create a new post' },
  { method: 'GET',    path: '/api/posts/:id',          description: 'Get a single post' },
  { method: 'PATCH',  path: '/api/posts/:id/publish',  description: 'Publish a draft post' },
  { method: 'DELETE', path: '/api/posts/:id',          description: 'Delete a post' },
];

const methodColors: Record<string, string> = {
  GET: '#10b981',
  POST: '#6366f1',
  PATCH: '#f59e0b',
  DELETE: '#ef4444',
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>Clean Architecture · Next.js · TypeScript</div>
        <h1 className={styles.title}>TestNodeModulesV5</h1>
        <p className={styles.subtitle}>
          A production-ready boilerplate demonstrating Clean Architecture with Next.js App Router
          and TypeScript. Strict layer boundaries. Zero business logic leaking into controllers.
        </p>
        <div className={styles.heroActions}>
          <Link href="/posts" className={styles.btnPrimary}>
            View Demo Posts →
          </Link>
          <a
            href="https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
          >
            Clean Architecture Docs
          </a>
        </div>
      </section>

      {/* Architecture layers */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Architecture Layers</h2>
        <p className={styles.sectionSubtitle}>
          Dependencies flow inward only:{' '}
          <code>interfaces → application → domain</code> and{' '}
          <code>infrastructure → application → domain</code>
        </p>
        <div className={styles.layerGrid}>
          {layers.map((layer) => (
            <div key={layer.name} className={styles.layerCard} style={{ borderTopColor: layer.color }}>
              <div className={styles.layerHeader}>
                <span className={styles.layerName} style={{ color: layer.color }}>
                  {layer.name}
                </span>
                <code className={styles.layerPath}>{layer.path}</code>
              </div>
              <p className={styles.layerDescription}>{layer.description}</p>
              <ul className={styles.layerItems}>
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* API endpoints */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>REST API Endpoints</h2>
        <div className={styles.endpointTable}>
          {endpoints.map((ep) => (
            <div key={ep.path + ep.method} className={styles.endpointRow}>
              <span
                className={styles.endpointMethod}
                style={{ color: methodColors[ep.method] ?? '#94a3b8' }}
              >
                {ep.method}
              </span>
              <code className={styles.endpointPath}>{ep.path}</code>
              <span className={styles.endpointDescription}>{ep.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Start</h2>
        <pre>{`npm install
npm run dev

# Create a post
curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Hello World","content":"My first post content here.","authorId":"user-1"}'`}</pre>
      </section>

      <footer className={styles.footer}>
        <p>
          Built with{' '}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js 14
          </a>{' '}
          ·{' '}
          <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">
            TypeScript 5
          </a>{' '}
          · Clean Architecture
        </p>
      </footer>
    </main>
  );
}
