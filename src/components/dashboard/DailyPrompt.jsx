import Card from './Card.jsx';
import Icon from './Icon.jsx';
import Button from '../Button.jsx';

/** A gentle writing idea. "Write about this" copies it into the quick journal. */
export default function DailyPrompt({ prompt, onUse }) {
  return (
    <Card className="bg-gradient-to-br from-blush-100/90 to-lilac-100/90">
      <p className="flex items-center gap-2 text-sm font-bold text-lilac-500">
        <Icon name="sparkle" className="h-4 w-4" /> Today's writing prompt
      </p>
      <p className="mt-3 font-display text-xl leading-snug text-ink-800">{prompt}</p>
      <Button type="button" variant="secondary" onClick={onUse} className="mt-5 w-full py-2.5">
        Write about this
      </Button>
    </Card>
  );
}
