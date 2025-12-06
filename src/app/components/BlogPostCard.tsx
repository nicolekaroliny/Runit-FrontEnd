import Link from 'next/link';
import { BlogPost } from '@/types/blog.types';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/375x250?text=Sem+Imagem';
    }
    return imageUrl.startsWith('http') ? imageUrl : `${imageUrl}`;
  };

  const imageUrl = post.imageUrl || post.thumbnailUrl;

  return (
    <Link href={`/blog/${post.slug || post.id}`} className="group h-full">
      <article className="h-full bg-card  rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <img
            src={getImageUrl(imageUrl)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col h-60">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white text-xs font-semibold rounded-full">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </p>

          {/* Date */}
          {post.createdAt && (
            <p className="text-xs text-muted-foreground mt-auto">
              {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
