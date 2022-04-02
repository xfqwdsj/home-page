import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { UrlObject } from "url";
import { NextLinkComposed } from "./link";

export type CardInfo = {
  name: string;
  icon: OverridableComponent<SvgIconTypeMap> & {
    muiName: string;
  };
  viewBox?: string;
  description: string;
  href: string | UrlObject;
};

export const CardsGrid = (props: { cards: CardInfo[] }) => (
  <Grid container columns={60} spacing={2} sx={{ alignItems: "stretch" }}>
    {props.cards.map((card) => (
      <Grid item xs={30} sm={20} md={15} xl={12} key={JSON.stringify(card)}>
        <Card sx={{ width: 1, height: 1 }}>
          <Stack width={1} height={1}>
            <CardContent>
              <card.icon sx={{ width: 1, height: 80 }} viewBox={card.viewBox} />
              <Typography variant="h5">{card.name}</Typography>
              <Typography color="text.secondary">{card.description}</Typography>
            </CardContent>
            <CardActions sx={{ mt: "auto" }}>
              <Button size="small" component={NextLinkComposed} to={card.href}>
                去看看
              </Button>
            </CardActions>
          </Stack>
        </Card>
      </Grid>
    ))}
  </Grid>
);
