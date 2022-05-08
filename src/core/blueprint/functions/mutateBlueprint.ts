import { Blueprint } from 'game/Blueprint';
import produce, { produceWithPatches } from 'immer';
import { merge } from 'lodash';
import blueprintStore from 'stores/blueprint';
import versionControlStore, {
  VersionControlStore,
} from 'stores/versionControl';
import DeepPartial from 'types/DeepPartial';
import { UNDO_LIMIT } from '../constants/versionControl';
import { declareUnsavedChanges } from './declareUnsavedChanges';

export const mutateBlueprint = (
  producer: (state: Blueprint) => void,
  lastStateLie?: DeepPartial<Blueprint>,
) => {
  const [nextState, patches, inversePatches] = produceWithPatches(
    lastStateLie
      ? merge(blueprintStore.getState(), lastStateLie)
      : blueprintStore.getState(),
    producer,
  );

  versionControlStore.setState(
    produce((draft: VersionControlStore) => {
      draft.history.splice(
        draft.index + 1,
        draft.history.length - draft.index - 1,
      );

      draft.history.push({
        undo: inversePatches,
        redo: patches,
      });

      if (UNDO_LIMIT === 0) {
        draft.index++;
      } else {
        if (draft.history.length > UNDO_LIMIT) {
          draft.history.shift();
        } else {
          draft.index++;
        }
      }
    }),
  );

  declareUnsavedChanges();
  blueprintStore.setState(nextState);
};