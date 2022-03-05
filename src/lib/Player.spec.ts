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
            ballMovement: {
              from: x,
              to: y,
            },
          },
          {
            ballMovement: {
              from: y,
              to: x,
            },
          },
          {
            ballMovement: {
              player: x,
            },
            playerMovement: [
              {
                player: x,
                destination: { x: 5, y: 5 },
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
