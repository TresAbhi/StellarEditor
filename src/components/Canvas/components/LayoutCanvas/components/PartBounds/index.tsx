import { Line } from '@react-three/drei';
import { Layer } from 'components/Canvas/constants/layer';
import HeadsUpDisplay from 'components/HeadsUpDisplay';
import { useEffect, useRef } from 'react';
import useBlueprint from 'stores/useBlueprint';
import useBounds from 'stores/useBounds';
import { Box3, Group } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { PartBound, UNIT_POINTS } from './components/PartBound';
import { ResizeNode } from './components/ResizeNode';

// export const PartBounds = () => {
//   const wrapper = useRef<Group>(null);
//   const outline = useRef<Line>(null);
//   const selections = useBlueprint((state) => state.selections);
//   const deferUpdates = useBounds((state) => state.deferUpdates);
//   const [box3, setBox3] = useState(new Box3());
//   const partBounds = selections.map((id) => (
//     <PartBound key={`part-bound-${id}`} id={id} />
//   ));
//   const partBoundsWrapper = useRef<Group>(null);

//   useEffect(() => {
//     if (partBoundsWrapper.current && outline.current && wrapper.current) {
//       if (deferUpdates || selections.length === 0) {
//         wrapper.current.visible = false;
//       } else {
//         const newBox3 = new Box3().setFromObject(partBoundsWrapper.current);

//         newBox3 && setBox3(newBox3);

//         wrapper.current.visible = true;
//       }
//     }
//   }, []);

//   return (
//     <HeadsUpDisplay priority={Layer.Tool}>
//       <group ref={partBoundsWrapper}>{partBounds}</group>

//       <group visible={selections.length !== 0} ref={wrapper}>
//         <line_
//           ref={outline}
//           position={[
//             (box3.max.x + box3.min.x) / 2, // - outline.current.scale.x / 2,
//             (box3.max.y + box3.min.y) / 2, // - outline.current.scale.y / 2,
//             0,
//           ]}
//           scale={[box3.max.x - box3.min.x, box3.max.y - box3.min.y, 1]}
//           material={outlineMaterial}
//           geometry={unitBufferGeometry2}
//         />

//         <ResizeNode // top left
//           movable={[box3.min.x, box3.max.y]}
//           constant={[box3.max.x, box3.min.y]}
//         />
//       </group>
//     </HeadsUpDisplay>
//   );
// };

export const PartBounds = () => {
  const selections = useBlueprint((state) => state.selections);
  const deferUpdates = useBounds((state) => state.deferUpdates);
  const partBoundsWrapper = useRef<Group>(null);
  const outline = useRef<Line2>(null);
  const box3 = new Box3();

  const partBounds = selections.map((selection) => (
    <PartBound id={selection} key={`part-bound-${selection}`} />
  ));

  useEffect(() => {
    if (partBoundsWrapper.current) {
      box3.setFromObject(partBoundsWrapper.current);

      const width = box3.max.x - box3.min.x;
      const height = box3.max.y - box3.min.y;
      const x = (box3.max.x + box3.min.x) / 2;
      const y = (box3.max.y + box3.min.y) / 2;

      outline.current?.scale.set(width, height, 1);
      outline.current?.position.set(x, y, 0);
    }
  });

  return (
    <HeadsUpDisplay priority={Layer.Tool}>
      <group visible={!deferUpdates}>
        <group ref={partBoundsWrapper}>{partBounds}</group>

        <Line
          ref={outline}
          visible={selections.length > 1}
          lineWidth={1.5}
          color={'#9d5bd2'}
          points={UNIT_POINTS}
        />

        <ResizeNode // top left
          constant={() => [box3.max.x, box3.min.y]}
          movable={() => [box3.min.x, box3.max.y]}
        />
        <ResizeNode // top
          constant={() => [(box3.min.x + box3.max.x) / 2, box3.min.y]}
          movable={() => [(box3.min.x + box3.max.x) / 2, box3.max.y]}
          x={false}
        />
        <ResizeNode // top right
          constant={() => [box3.min.x, box3.min.y]}
          movable={() => [box3.max.x, box3.max.y]}
        />
        <ResizeNode // right
          constant={() => [box3.min.x, (box3.min.y + box3.max.y) / 2]}
          movable={() => [box3.max.x, (box3.min.y + box3.max.y) / 2]}
          y={false}
        />
        <ResizeNode // bottom right
          constant={() => [box3.min.x, box3.max.y]}
          movable={() => [box3.max.x, box3.min.y]}
        />
        <ResizeNode // bottom
          constant={() => [(box3.min.x + box3.max.x) / 2, box3.max.y]}
          movable={() => [(box3.min.x + box3.max.x) / 2, box3.min.y]}
          x={false}
        />
        <ResizeNode // bottom left
          constant={() => [box3.max.x, box3.max.y]}
          movable={() => [box3.min.x, box3.min.y]}
        />
        <ResizeNode // left
          constant={() => [box3.max.x, (box3.min.y + box3.max.y) / 2]}
          movable={() => [box3.min.x, (box3.min.y + box3.max.y) / 2]}
          y={false}
        />
      </group>
    </HeadsUpDisplay>
  );
};

export * from './components/PartBound';
