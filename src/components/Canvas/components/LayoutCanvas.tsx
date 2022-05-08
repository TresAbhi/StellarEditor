import { AdaptiveDpr } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import blueprintStore from 'stores/blueprint';
import settingsStore from 'stores/settings';
import styles from '../index.module.scss';
import { Grid } from './Grid';
import { LayoutParts } from './LayoutParts';
import { PanControls } from './PanControls';
import { SelectionBoxes } from './SelectionBoxes';
import { SelectionControls } from './SelectionControls';

export const LayoutCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const regressAmount = settingsStore(
    (state) => state.performance.regress_amount,
  );
  const initialState = blueprintStore.getState();

  return (
    <Canvas
      ref={canvasRef}
      orthographic
      camera={{
        zoom: 16,
        position: [initialState.center, 0, 100],
        rotation: [0, 0, 0],
      }}
      className={styles['editing-canvas']}
      performance={{ min: regressAmount }}
    >
      {regressAmount > 0 ? <AdaptiveDpr pixelated /> : undefined}

      <PanControls />
      <SelectionControls />

      <Grid />
      <LayoutParts />
      <SelectionBoxes />
    </Canvas>
  );
};