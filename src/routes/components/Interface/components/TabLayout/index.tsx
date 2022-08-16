import { LayoutCanvas } from 'components/Canvas';
import { TAB } from 'stores/useApp';
import { TabContainer } from '../Tabs';
import Toolbar from './components/Toolbar';

export const TabLayout = () => (
  <TabContainer tab={TAB.LAYOUT}>
    <Toolbar />
    <LayoutCanvas />
  </TabContainer>
);