import blueprintStore from 'stores/blueprint';
import { groupParts } from './groupParts';

export const groupPartsBySelection = () => {
  const blueprintState = blueprintStore.getState();

  groupParts(
    blueprintState.selections,
    blueprintState.selections[blueprintState.selections.length - 1],
  );
};