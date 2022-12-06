import { invalidate } from '@react-three/fiber';
import { DeferUpdatesEventDetail } from 'core/bounds';
import { useEffect, useRef } from 'react';
import useBlueprint from 'stores/blueprint';
import { Group } from 'three';
import { PartBounds } from './components/PartBounds';

export const PartsBounds = () => {
  const partBounds: JSX.Element[] = [];
  const parts = useBlueprint((state) => state.parts);
  const wrapper = useRef<Group>(null);

  for (const id in parts) {
    partBounds.push(<PartBounds id={id} key={`part-bound-${id}`} />);
  }

  useEffect(() => {
    const handleDeferUpdates = (
      event: CustomEvent<DeferUpdatesEventDetail>,
    ) => {
      if (wrapper.current) wrapper.current.visible = !event.detail;
      invalidate();
    };

    window.addEventListener(
      'deferupdates',
      handleDeferUpdates as EventListener,
    );

    return () => {
      window.removeEventListener(
        'deferupdates',
        handleDeferUpdates as EventListener,
      );
    };
  }, []);

  return <group ref={wrapper}>{partBounds}</group>;
};