interface Player {
  name: string;
  hasBall: boolean;
  fieldLocation: FieldLocation;
}

interface FieldLocation {
  name?: string;
  x: number;
  y: number;
}

const fieldLocationToString = (fieldLocation: FieldLocation): string => {
  return fieldLocation.name === undefined
    ? '[' + fieldLocation.x + ', ' + fieldLocation.y + ']'
    : fieldLocation.name;
};

type Action = Pass | Shoot;

interface Move {
  player: Player;
  destination: FieldLocation;
}

interface Pass {
  from: Player;
  to: Player;
}

interface Shoot {
  player: Player;
}

const isMove = (action: Action): action is Move => {
  return (action as Move).destination !== undefined;
};

const isPass = (action: Action): action is Pass => {
  const pass = action as Pass;
  return pass.from !== undefined && pass.to !== undefined;
};

const isShot = (action: Action): action is Shoot => {
  return (action as Shoot).player !== undefined;
};

interface Playbook {
  name: string;
  plays: Play[];
}

interface Play {
  name: string;
  roster: Player[];
  actionGroups: ActionGroup[];
}

interface ActionGroup {
  ballMovement?: Pass | Shoot;
  playerMovement?: Move[];
}

interface FieldState {
  players: Player[];
}

const runPlay = (playbook: Playbook, playName: string): FieldState[] => {
  const play = playbook.plays.find((play) => play.name === playName);
  const fieldState = {
    players: play.roster,
  };

  printFieldState(fieldState);

  return play.actionGroups.reduce(
    (acc, ag, i) => {
      const newFieldState = processActionGroup(acc[i], ag, i);
      printFieldState(newFieldState);
      return acc.concat(newFieldState);
    },
    [fieldState]
  );
};

const printFieldState = (fs: FieldState): void => {
  console.log('---- Current Field State ----');
  fs.players.forEach((p, i) => {
    console.log(
      i +
        ') ' +
        p.name +
        ' is ' +
        fieldLocationToString(p.fieldLocation) +
        (p.hasBall ? ' with ball' : '')
    );
  });
};

const processActionGroup = (
  previousFieldState: FieldState,
  ag: ActionGroup,
  i: number
): FieldState => {
  console.log('running action group ' + i);
  let fs: FieldState;
  if (ag.ballMovement !== undefined) {
    fs = processBallMovement(previousFieldState, ag.ballMovement);
  }
  if (ag.playerMovement !== undefined) {
    fs = processPlayerMovement(previousFieldState, ag.playerMovement);
  }
  return fs;
};

const processPlayerMovement = (
  fieldState: FieldState,
  moves: Move[]
): FieldState => {
  return moves.reduce((acc, move) => {
    console.log(
      '\t - ' +
        move.player.name +
        ' is moving to ' +
        fieldLocationToString(move.destination)
    );
    return {
      players: acc.players.map((player) => {
        if (player.name === move.player.name) {
          player.fieldLocation = move.destination;
        }
        return player;
      }),
    };
  }, fieldState);
};

const processBallMovement = (
  previousFieldState: FieldState,
  action: Action
): FieldState => {
  if (isPass(action)) {
    console.log(
      '\t - Passing ball from ' + action.from.name + ' to ' + action.to.name
    );
    return {
      players: previousFieldState.players.map((p) => {
        if (p.name === action.from.name) {
          p.hasBall = false;
        } else if (p.name === action.to.name) {
          p.hasBall = true;
        }
        return p;
      }),
    };
  } else if (isShot(action)) {
    console.log('\t - ' + action.player.name + ' shoots');
    return {
      players: previousFieldState.players.map((p) => {
        if (p.name === action.player.name) {
          p.hasBall = false;
        }
        return p;
      }),
    };
  }
};

export { Playbook, Player, FieldLocation, runPlay };
