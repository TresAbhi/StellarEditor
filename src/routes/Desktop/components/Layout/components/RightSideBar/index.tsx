import { ReactComponent as LinkOff } from 'assets/icons/link-off.svg';
import { ReactComponent as LinkOn } from 'assets/icons/link-on.svg';
import * as Partition from 'components/Partitions';
import * as PropertiesExplorer from 'components/PropertiesExplorer';
import * as SideBar from 'components/SideBar';
import useUnitInputController from 'hooks/useUnitInputController';
import produce from 'immer';
import appStore, { AppStore } from 'stores/app';
import selectionStore from 'stores/selection';
import './index.scss';

const RightSideBar = () => {
  const hasSelections = selectionStore((state) => state.selections.length) > 0;
  const xController = useUnitInputController(0, { suffix: 'm' });
  const yController = useUnitInputController(0, { suffix: 'm' });
  const rController = useUnitInputController(0, {
    suffix: '°',
    max: 360,
    modOnClamp: true,
  });
  // TODO: find out where the game supports negative sizes
  const wController = useUnitInputController(0, { suffix: 'x', min: 0 });
  const hController = useUnitInputController(0, { suffix: 'x', min: 0 });

  return (
    <SideBar.Container className="right-side-bar" width="minor">
      <Partition.Container>
        <Partition.Option
          selected={
            appStore((state) => state.layout.rightSideBar.partition) ===
            'properties'
          }
          onClick={() =>
            appStore.setState(
              produce((draft: AppStore) => {
                draft.layout.rightSideBar.partition = 'properties';
              }),
            )
          }
        >
          Properties
        </Partition.Option>
        <Partition.Separator />
        <Partition.Option
          selected={
            appStore((state) => state.layout.rightSideBar.partition) ===
            'inspect'
          }
          onClick={() =>
            appStore.setState(
              produce((draft: AppStore) => {
                draft.layout.rightSideBar.partition = 'inspect';
              }),
            )
          }
        >
          Inspect
        </Partition.Option>
      </Partition.Container>
      <SideBar.Scrollable
        style={{
          display:
            appStore((state) => state.layout.rightSideBar.partition) ===
            'properties'
              ? 'unset'
              : 'none',
        }}
      >
        <PropertiesExplorer.Container
          style={{ display: hasSelections ? undefined : 'none' }}
        >
          <PropertiesExplorer.Group>
            <PropertiesExplorer.Title>Transformations</PropertiesExplorer.Title>
            <PropertiesExplorer.Row>
              <PropertiesExplorer.NamedInput label="X" ref={xController.ref} />
              <PropertiesExplorer.NamedInput label="Y" ref={yController.ref} />
              <PropertiesExplorer.NamedInput label="R" ref={rController.ref} />
            </PropertiesExplorer.Row>
            <PropertiesExplorer.Row>
              <PropertiesExplorer.NamedInput label="W" ref={wController.ref} />
              <PropertiesExplorer.NamedInput label="H" ref={hController.ref} />
              <PropertiesExplorer.ToggleButton
                onClick={() => {
                  appStore.setState(
                    produce((draft: AppStore) => {
                      draft.layout.rightSideBar.scaleConstrained =
                        !draft.layout.rightSideBar.scaleConstrained;
                    }),
                  );
                }}
              >
                {appStore(
                  (state) => state.layout.rightSideBar.scaleConstrained,
                ) ? (
                  <LinkOn className="right-side-bar-constrain-icon" />
                ) : (
                  <LinkOff className="right-side-bar-constrain-icon" />
                )}
              </PropertiesExplorer.ToggleButton>
            </PropertiesExplorer.Row>
          </PropertiesExplorer.Group>
        </PropertiesExplorer.Container>
      </SideBar.Scrollable>
      <SideBar.Scrollable
        style={{
          display:
            appStore((state) => state.layout.rightSideBar.partition) ===
            'inspect'
              ? 'unset'
              : 'none',
        }}
      >
        <span
          style={{
            color: 'white',
            display: 'block',
            padding: 'auto',
            paddingTop: '16px',
            textAlign: 'center',
          }}
        >
          Inspect coming soon!
        </span>
      </SideBar.Scrollable>
    </SideBar.Container>
  );
};
export default RightSideBar;
