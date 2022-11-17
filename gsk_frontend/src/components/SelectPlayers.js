import * as React from 'react';
import {Box, Checkbox, ListItem, Typography} from "@mui/material";
import List from "@mui/material/List";

export default function SelectPlayers() {
  return (
    <Box sx={{ width: 343 }}>
      <Typography id="topping" level="body2" fontWeight="lg" mb={2}>
        Pizza toppings
      </Typography>
      <Box role="group" aria-labelledby="topping">
        <List
          row
          wrap
          sx={{
            '--List-gap': '8px',
            '--List-item-radius': '20px',
          }}
        >
          {[
            'Perpperoni',
            'Cheese',
            'Olives',
            'Tomatoes',
            'Fried Bacon',
            'Spinach',
          ].map((item, index) => (
            <ListItem key={item}>
              <Checkbox
                disabled={index === 0}
                overlay
                disableIcon
                variant="soft"
                label={item}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}