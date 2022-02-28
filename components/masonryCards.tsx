import { Masonry } from '@mui/lab';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { UrlObject } from 'url';
import { NextLinkComposed } from './link';

interface CardInfo {
  name: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  viewBox?: string;
  description: string;
  href: string | UrlObject;
}

export const MasonryCards = (props: { cards: CardInfo[] }) => (
  <Masonry spacing={2}>
    {props.cards.map((card) => (
      <Card key={card.toString()} sx={{ mx: 'auto', width: 275 }}>
        <CardContent>
          <card.icon sx={{ width: 1, height: 80 }} viewBox={card.viewBox} />
          <Typography variant="h5">{card.name}</Typography>
          <Typography color="text.secondary">{card.description}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" component={NextLinkComposed} to={card.href}>
            去看看
          </Button>
        </CardActions>
      </Card>
    ))}
  </Masonry>
);
