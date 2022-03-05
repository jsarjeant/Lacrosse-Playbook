import test from 'ava';

import { FieldLocation, Playbook, Player, runPlay } from './Player';

test('run', (t) => {
  const TopRight: FieldLocation = {
    name: 'Top Right',
    x: 0,
    y: 10,
  };

  const TopLeft: FieldLocation = {
    name: 'Top Left',
    x: 10,
    y: 10,
  };

  const x: Player = {
    name: 'x',
    hasBall: true,
    fieldLocation: TopRight,
  };

  const y: Player = {
    name: 'y',
    hasBall: false,
    fieldLocation: TopLeft,
  };

  const playbook: Playbook = {
    name: 'Knights',
    plays: [
      {
        name: 'Bingo',
        roster: [x, y],
        actionGroups: [
          {
            actions: [
              {
                from: x,
                to: y,
              },
            ],
          },
          {
            actions: [
              {
                from: y,
                to: x,
              },
            ],
          },
          {
            actions: [
              {
                player: x,
                destination: { x: 5, y: 5 },
              },
              {
                player: x,
              },
            ],
          },
        ],
      },
    ],
  };

  runPlay(playbook, 'Bingo');
  t.is(1, 1);
});
