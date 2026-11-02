import { IconTile } from '@/components/icon-tile';
import { categoryIcon, type NewsCategory } from '@/data/news';

/** Placeholder until article images come from the API: the category icon, same size as other list icons. */
export function NewsThumb({ category }: { category: NewsCategory }) {
  return <IconTile icon={categoryIcon[category]} />;
}
