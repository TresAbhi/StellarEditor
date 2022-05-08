import PartCluster from 'components/Canvas/components/PartCluster';
import HeadsUpDisplay from 'components/HeadsUpDisplay';
import { useEffect, useRef } from 'react';
import blueprintStore from 'stores/blueprint';
import { Group } from 'three';
import { LAYER } from '../constants/layer';

export const LayoutParts = () => {
  const initialState = blueprintStore.getState();
  const meshRef = useRef<Group>(null);

  useEffect(() => {
    const unsubscribe = blueprintStore.subscribe(
      (state) => state.offset,
      (offset) => {
        meshRef.current?.position.setX(offset.x);
        meshRef.current?.position.setY(offset.y);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <HeadsUpDisplay priority={LAYER.PART}>
      <directionalLight position={[0, 0, 100]} />
      <ambientLight intensity={0.5} />

      <PartCluster
        position={[initialState.offset.x, initialState.offset.y, 0]}
        ref={meshRef}
        parentID={null}
      />
    </HeadsUpDisplay>
  );
};