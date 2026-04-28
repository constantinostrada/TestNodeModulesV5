import Link from 'next/link';
import styles from './posts.module.css';

/**
 * /posts — server-side rendered demo page.
 *
 * Calls our own API to demonstrate the full request cycle.
 * In a real app you would call use cases directly in a Server Component
 * or via a React Server Action; using fetch here keeps the demo simple
 * and exercises the API routes end-to-end.
 */
async function fetchPosts() {
  try {
    const res = await fetch('http://localhost:3000/api/posts', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>
        <h1 className={styles.title}>Posts</h1>
        <p className={styles.subtitle}>
          Fetched from <code>/api/posts</code> — create some posts via the API to see them here.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>No posts yet.</p>
          <pre className={styles.curl}>{`curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My First Post",
    "content": "Hello clean architecture world!",
    "authorId": "user-001"
  }'`}</pre>
        </div>
      ) : (
        <ul className={styles.list}>
          {posts.map(
            (post: {
              id: string;
              title: string;
              excerpt: string;
              status: string;
              authorId: string;
              createdAt: string;
            }) => (
              <li key={post.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <span
                    className={styles.status}
                    data-status={post.status}
                  >
                    {post.status}
                  </span>
                </div>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <footer className={styles.cardFooter}>
                  <span>Author: {post.authorId}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </footer>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
