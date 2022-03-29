import PartWithTransformations from 'classes/Parts/PartWithTransformations';
import { subscribeToPart } from 'interfaces/blueprint';
import { RefObject, useEffect } from 'react';
import { Group, Mesh } from 'three';
import DeepPartial from 'types/DeepPartial';
import { UUID } from 'types/Parts';

const usePartTransformations = <Type extends PartWithTransformations>(
  ID: UUID,
  mesh: RefObject<Mesh | Group>,
  overrides?: (state: Type) => DeepPartial<Type>,
) => {
  /*
  useEffect(() => {
    subscribeToPart(
      ID,
      (x) => {
        mesh.current!.position.x = x;
      },
      (state: Type) =>
        overrides ? overrides(state).p?.x ?? state.p.x : state.p.x,
      { fireInitially: true },
    );
    subscribeToPart(
      ID,
      (y) => {
        mesh.current!.position.y = y;
      },
      (state: Type) =>
        overrides ? overrides(state).p?.y ?? state.p.y : state.p.y,
      { fireInitially: true },
    );

    subscribeToPart(
      ID,
      (z) => {
        mesh.current!.rotation.z = z;
      },
      (state: Type) =>
        degToRad(overrides ? overrides(state).o?.z ?? state.o.z : state.o.z),
      { fireInitially: true },
    );

    subscribeToPart(
      ID,
      (x) => {
        mesh.current!.scale.x = x;
      },
      (state: Type) =>
        overrides ? overrides(state).o?.x ?? state.o.x : state.o.x,
      { fireInitially: true },
    );
    subscribeToPart(
      ID,
      (y) => {
        mesh.current!.scale.y = y;
      },
      (state: Type) =>
        overrides ? overrides(state).o?.y ?? state.o.y : state.o.y,
      { fireInitially: true },
    );
  }, [ID, mesh, overrides]);
  */

  useEffect(() => {
    const unsubPosX = subscribeToPart<PartWithTransformations, number>(
      ID,
      (state) => {
        // document.title = `${state}`;
      },
      (state) => state.p.x,
    );

    return () => {
      unsubPosX();
    };
  }, [ID]);
};
export default usePartTransformations;
