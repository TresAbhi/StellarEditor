import * as PropertiesPrimitive from 'components/Properties';
import { getPart, getPartRegistry } from 'core/part';
import { PartWithTransformationsPropertyComponent } from 'game/parts/PartWithTransformations';
import { isUndefined } from 'lodash';
import { FC } from 'react';
import useBlueprint from 'stores/useBlueprint';
import { AnyPart, PartPropertyComponentProps } from 'types/Parts';

interface GroupedProperties {
  test: (part: AnyPart) => boolean;
  Component: FC<PartPropertyComponentProps>;
}

const groupedPropertiess: GroupedProperties[] = [
  {
    test: (part) => !isUndefined(part.p) && !isUndefined(part.o),
    Component: PartWithTransformationsPropertyComponent,
  },
];

export const Properties = () => {
  const selections = useBlueprint((state) => state.selections);
  const typeSortedParts = new Map<number, string[]>();
  const nameSortedParts = new Map<string, string[]>();
  const children: JSX.Element[] = [];

  groupedPropertiess.forEach(({ test }, index) => {
    selections.forEach((selection) => {
      const part = getPart(selection);

      if (part && test(part)) {
        if (typeSortedParts.has(index)) {
          typeSortedParts.get(index)?.push(selection);
        } else {
          typeSortedParts.set(index, [selection]);
        }
      }
    });
  });

  selections.forEach((selection) => {
    const part = getPart(selection);

    if (part) {
      if (nameSortedParts.has(part.n)) {
        nameSortedParts.get(part.n)?.push(selection);
      } else {
        nameSortedParts.set(part.n, [selection]);
      }
    }
  });

  typeSortedParts.forEach((ids, index) => {
    const { Component } = groupedPropertiess[index];

    children.push(
      <Component ids={ids} key={`type-sorted-properties-explorer-${index}`} />,
    );
  });

  nameSortedParts.forEach((ids, name) => {
    const partRegistry = getPartRegistry(name);

    if (partRegistry && partRegistry.PropertyEditor) {
      children.push(
        <partRegistry.PropertyEditor
          ids={ids}
          key={`properties-explorer-${name}`}
        />,
      );
    }
  });

  return (
    <PropertiesPrimitive.Container>{children}</PropertiesPrimitive.Container>
  );
};