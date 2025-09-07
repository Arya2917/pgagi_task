import { motion } from 'framer-motion';
import { Calendar, User, Star, ExternalLink } from 'lucide-react';
import { ContentItem } from '../features/contentFeed/contentFeedSlice';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentCardProps {
  item: ContentItem;
  index: number;
}

export function ContentCard({ item, index }: ContentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'movie':
        return 'bg-accent/10 text-accent-dark border-accent/20';
      case 'social':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group cursor-grab active:cursor-grabbing ${
        isDragging ? 'z-50 rotate-2' : ''
      }`}
    >
      <Card className="content-card h-full overflow-hidden">
        {item.imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Badge
              className={`absolute top-3 left-3 ${getTypeColor(item.type)}`}
            >
              {item.type}
            </Badge>
            {item.score && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                <Star className="h-3 w-3 fill-current" />
                {item.score}
              </div>
            )}
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-muted-foreground text-sm line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {item.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.author}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.publishedAt)}
              </div>
            </div>
            
            {item.url && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle navigation to item.url
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>

          {item.category && (
            <div className="pt-2 border-t border-card-border">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}