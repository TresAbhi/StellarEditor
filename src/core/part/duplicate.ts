import mutateBlueprint from 'core/blueprint/mutateBlueprint';
import { Blueprint } from 'game/Blueprint';
import { MethodIds } from 'types/Parts';
import normalizeIds from 'utilities/normalizeIds';
import clone from './clone';
import getParent from './getParent';
import select from './select';
import unselectAll from './unselectAll';

export default function duplicate(ids: MethodIds, blueprint?: Blueprint) {
  if (blueprint) {
    unselectAll(blueprint);

    normalizeIds(ids).forEach((id) => {
      const parent = getParent(id, blueprint) ?? blueprint;
      const partIndex = parent.part_order.indexOf(id);

      if (partIndex !== -1) {
        const clonedPartData = clone(id, blueprint);

        if (clonedPartData) {
          const [clonedPartId, clonedParts] = clonedPartData;

          parent.part_order.splice(partIndex + 1, 0, clonedPartId);

          Object.keys(clonedParts).forEach((clonedPartChildId) => {
            const clonedPart = clonedParts[clonedPartChildId];
            blueprint.parts[clonedPartChildId] = clonedPart;
          });

          select(clonedPartId, blueprint);
        }
      }
    });
  } else {
    mutateBlueprint((draft) => {
      duplicate(ids, draft);
    });
  }
}