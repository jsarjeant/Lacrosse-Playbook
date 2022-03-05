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

type Action = Move | Pass | Shoot;

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
  actions: Action[];
}

const runPlay = (playbook: Playbook, playName: string): void => {
  playbook.plays
    .find((play) => play.name === playName)
    .actionGroups.forEach((ag, i) => {
      console.log('running action group ' + i);
      ag.actions.forEach((action) => {
        if (isPass(action)) {
          console.log(
            '\t - Passing ball from ' +
              action.from.name +
              ' to ' +
              action.to.name
          );
        } else if (isMove(action)) {
          console.log(
            '\t - ' +
              action.player.name +
              ' is moving to ' +
              fieldLocationToString(action.destination)
          );
        } else if (isShot(action)) {
          console.log('\t - ' + action.player.name + ' shoots');
        }
      });
    });
};

export { Playbook, Player, FieldLocation, runPlay };
