import { WATERMARK_KEY } from 'core/blueprint/constants/watermark';
import { generateId, partImportify } from 'core/part';
import {
  Blueprint,
  BlueprintData,
  SavedBlueprint,
  VanillaBlueprint,
} from 'game/Blueprint';
import { cloneDeep, isArray, isMap } from 'lodash';
import { AnyPartMap } from 'types/Parts';

export const blueprintImportify = (
  blueprint: VanillaBlueprint | SavedBlueprint | Blueprint,
) => {
  const clonedBlueprint = cloneDeep(blueprint);
  const targetBlueprint = cloneDeep(BlueprintData);

  // STEP 1: Remove watermark
  delete (clonedBlueprint as any)[WATERMARK_KEY];

  // STEP 2: Copy all generic properties
  targetBlueprint.center = clonedBlueprint.center;
  targetBlueprint.offset.x = clonedBlueprint.offset.x;
  targetBlueprint.offset.y = clonedBlueprint.offset.y;

  // STEP 3: Convert all parts to the new format
  const newPartsMap: AnyPartMap = new Map();

  if (isMap(clonedBlueprint.parts)) {
    // normal blueprint, probably never gonna use this
    (clonedBlueprint as Blueprint).parts.forEach((part, id) => {
      const importifiedPart = partImportify(cloneDeep(part), id);
      if (importifiedPart) newPartsMap.set(id, importifiedPart);
    });

    targetBlueprint.partOrder = (clonedBlueprint as Blueprint).partOrder;
    targetBlueprint.parts = newPartsMap;
  } else if (clonedBlueprint.parts.length === 0) {
    // not parts to convert
  } else if (isArray(clonedBlueprint.parts[0])) {
    // saved version of the blueprint
    (clonedBlueprint as SavedBlueprint).parts.forEach(([id, part]) => {
      const importifiedPart = partImportify(cloneDeep(part), id);
      if (importifiedPart) newPartsMap.set(id, importifiedPart);
    });

    targetBlueprint.partOrder = (clonedBlueprint as SavedBlueprint).partOrder;
    targetBlueprint.parts = newPartsMap;
  } else {
    // vanilla blueprint, straight from the game
    let newPartOrder: string[] = [];

    (clonedBlueprint as Blueprint).partOrder = [];
    (clonedBlueprint as VanillaBlueprint).parts.forEach((part) => {
      const id = generateId();
      const importifiedPart = partImportify(cloneDeep(part), id);
      if (importifiedPart) {
        newPartsMap.set(id, importifiedPart);
        newPartOrder.push(id);
      }
    });

    targetBlueprint.partOrder = newPartOrder;
    targetBlueprint.parts = newPartsMap;
  }

  // STEP 4: Copy all stages
  targetBlueprint.stages = clonedBlueprint.stages;

  // STEP 5: Copy all selections
  if ((clonedBlueprint as Blueprint).selections) {
    targetBlueprint.selections = (clonedBlueprint as Blueprint).selections;
  }

  return targetBlueprint;
};
