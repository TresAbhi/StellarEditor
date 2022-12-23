import {
  CardStackMinusIcon,
  CardStackPlusIcon,
  ChevronDownIcon,
  CircleIcon,
  ClipboardCopyIcon,
  ClipboardIcon,
  Component1Icon,
  CursorArrowIcon,
  DiscordLogoIcon,
  DoubleArrowDownIcon,
  DownloadIcon,
  EnterIcon,
  ExclamationTriangleIcon,
  ExitIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  FileIcon,
  FilePlusIcon,
  GearIcon,
  GitHubLogoIcon,
  GroupIcon,
  HandIcon,
  InfoCircledIcon,
  KeyboardIcon,
  LightningBoltIcon,
  LockClosedIcon,
  LockOpen2Icon,
  Pencil1Icon,
  PlusCircledIcon,
  PlusIcon,
  ResetIcon,
  RulerSquareIcon,
  ScissorsIcon,
  StackIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import { ReactComponent as StellarIcon } from 'assets/icons/stellar-icon.svg';
import * as ToolbarPrimitive from 'components/Toolbar';
import { DISCORD, WEBSITE } from 'constants/social';
import { GH_REPO_URL } from 'constants/sourceCode';
import mutateApp from 'core/app/mutateApp';
import mutateSettings from 'core/app/mutateSettings';
import exportFile from 'core/blueprint/exportFile';
import importFile from 'core/blueprint/importFile';
import loadBlueprint from 'core/blueprint/loadBlueprint';
import openFile from 'core/blueprint/openFile';
import redoVersion from 'core/blueprint/redoVersion';
import saveFile from 'core/blueprint/saveFile';
import saveFileAs from 'core/blueprint/saveFileAs';
import undoVersion from 'core/blueprint/undoVersion';
import prompt from 'core/interface/prompt';
import copyPartsBySelection from 'core/part/copyPartsBySelection';
import cutPartsBySelection from 'core/part/cutPartsBySelection';
import deletePartsBySelection from 'core/part/deletePartsBySelection';
import duplicatePartsBySelection from 'core/part/duplicatePartsBySelection';
import groupPartsBySelection from 'core/part/groupPartsBySelection';
import pasteParts from 'core/part/pasteParts';
import selectAllPartsAtRoot from 'core/part/selectAllPartsAtRoot';
import togglePartsLockBySelection from 'core/part/togglePartsLockBySelection';
import togglePartsVisibilityBySelection from 'core/part/togglePartsVisibilityBySelection';
import ungroupGroupsBySelection from 'core/part/ungroupGroupsBySelection';
import unselectAllParts from 'core/part/unselectAllParts';
import useTranslator from 'hooks/useTranslator';
import InsertPartPopup from 'routes/components/InsertPartPopup';
import RenamePartsPopup from 'routes/components/RenamePartsPopup';
import useApp, { Tool } from 'stores/app';
import useBlueprint from 'stores/blueprint';
import useSettings from 'stores/settings';
import useVersionControl from 'stores/versionControl';

function Toolbar() {
  const { t, translate } = useTranslator();
  const selectMultiple = useSettings((state) => state.editor.selectMultiple);
  const selectDeep = useSettings((state) => state.editor.selectDeep);
  const focusMode = useApp((state) => state.interface.focusMode);
  const tool = useApp((state) => (state.editor.isSpacePanning || state.editor.isTouchPanning
    ? Tool.Pan
    : state.editor.tool));
  const isOneHidden = useBlueprint(({ selections, parts }) => selections.some((selection) => {
    const part = parts[selection];
    return part.hidden;
  }));
  const isOneLocked = useBlueprint(({ selections, parts }) => selections.some((selection) => {
    const part = parts[selection];
    return part.locked;
  }));
  const hasNoSelections = useBlueprint(
    (state) => state.selections.length === 0,
  );
  const hasParts = useBlueprint((state) => Object.keys(state.parts).length > 0);
  const hasUndos = useVersionControl((state) => state.index > -1);
  const hasRedos = useVersionControl(
    (state) => state.history.length - 1 > state.index,
  );
  const hasNoItemInClipboard = useApp(
    (state) => state.editor.clipboard === undefined,
  );
  const link = (url: string) => () => window.open(url, '_blank');

  return (
    <ToolbarPrimitive.Container>
      <ToolbarPrimitive.Group>
        <ToolbarPrimitive.Button disabled>
          <StellarIcon />
        </ToolbarPrimitive.Button>

        <ToolbarPrimitive.DropdownMenu icon={<FileIcon />}>
          <ToolbarPrimitive.DropdownMenuItem
            icon={<FilePlusIcon />}
            keybind="Ctrl + N"
            onClick={() => loadBlueprint()}
          >
            {t`tabs.layout.toolbar.file.new`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<UploadIcon />}
            keybind="Ctrl + O"
            onClick={() => openFile()}
          >
            {t`tabs.layout.toolbar.file.open`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<DownloadIcon />}
            keybind="Ctrl + S"
            onClick={() => saveFile()}
          >
            {t`tabs.layout.toolbar.file.save`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<DownloadIcon />}
            keybind="Ctrl + Shift + S"
            onClick={() => saveFileAs()}
          >
            {t`tabs.layout.toolbar.file.save_as`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<EnterIcon />}
            keybind="Ctrl + I"
            onClick={() => importFile()}
          >
            {t`tabs.layout.toolbar.file.import`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<ExitIcon />}
            keybind="Ctrl + E"
            onClick={() => exportFile()}
          >
            {t`tabs.layout.toolbar.file.export`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.DropdownMenu
          icon={tool === Tool.Pan ? <HandIcon /> : <CursorArrowIcon />}
        >
          <ToolbarPrimitive.DropdownMenuItem
            icon={<CursorArrowIcon />}
            onClick={() => mutateApp((draft) => {
              draft.editor.tool = Tool.Move;
            })}
          >
            {t`tabs.layout.toolbar.tool.move`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<HandIcon />}
            keybind="Space"
            onClick={() => mutateApp((draft) => {
              draft.editor.tool = Tool.Pan;
            })}
          >
            {t`tabs.layout.toolbar.tool.pan`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.Button onClick={() => prompt(InsertPartPopup)}>
          <PlusIcon />
        </ToolbarPrimitive.Button>
      </ToolbarPrimitive.Group>

      <ToolbarPrimitive.Group>
        <ToolbarPrimitive.DropdownMenu
          disabled={hasNoItemInClipboard && hasNoSelections}
          icon={<ClipboardIcon />}
        >
          <ToolbarPrimitive.DropdownMenuItem
            icon={<ClipboardCopyIcon />}
            onClick={() => copyPartsBySelection()}
            keybind="Ctrl + C"
            disabled={hasNoSelections}
          >
            {t`tabs.layout.toolbar.clipboard.copy`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<ScissorsIcon />}
            onClick={() => cutPartsBySelection()}
            keybind="Ctrl + X"
            disabled={hasNoSelections}
          >
            {t`tabs.layout.toolbar.clipboard.cut`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<ClipboardIcon />}
            onClick={() => pasteParts()}
            keybind="Ctrl + V"
            disabled={hasNoItemInClipboard}
          >
            {t`tabs.layout.toolbar.clipboard.paste`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<StackIcon />}
            onClick={() => duplicatePartsBySelection()}
            keybind="Ctrl + D"
            disabled={hasNoSelections}
          >
            {t`tabs.layout.toolbar.clipboard.duplicate`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<Component1Icon />}
            keybind="Ctrl + M"
            disabled
          >
            {t`tabs.layout.toolbar.clipboard.create_snippet`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.DropdownMenu
          disabled={!hasParts && hasNoSelections}
          icon={<GroupIcon />}
        >
          <ToolbarPrimitive.DropdownMenuItem
            disabled={!hasParts}
            icon={<CardStackPlusIcon />}
            onClick={() => selectAllPartsAtRoot()}
            keybind="Ctrl + A"
          >
            {t`tabs.layout.toolbar.selection.select_all`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            disabled={hasNoSelections}
            icon={<CardStackMinusIcon />}
            onClick={() => unselectAllParts()}
            keybind="Esc"
          >
            {t`tabs.layout.toolbar.selection.unselect_all`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            disabled={hasNoSelections}
            icon={<GroupIcon />}
            onClick={() => groupPartsBySelection()}
            keybind="Ctrl + G"
          >
            {t`tabs.layout.toolbar.selection.group`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            disabled={hasNoSelections}
            icon={<StackIcon />}
            onClick={() => ungroupGroupsBySelection()}
            keybind="Ctrl + Shift + G"
          >
            {t`tabs.layout.toolbar.selection.ungroup`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.DropdownMenu
          disabled={hasNoSelections}
          icon={<Pencil1Icon />}
        >
          <ToolbarPrimitive.DropdownMenuItem
            icon={<Pencil1Icon />}
            onClick={() => prompt(RenamePartsPopup)}
            keybind="Ctrl + R"
          >
            {t`tabs.layout.toolbar.edit.rename`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={isOneHidden ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onClick={() => togglePartsVisibilityBySelection()}
          >
            {translate(
              `tabs.layout.toolbar.edit.${isOneHidden ? 'hidden' : 'unhidden'}`,
            )}
          </ToolbarPrimitive.DropdownMenuItem>
          <ToolbarPrimitive.DropdownMenuItem
            icon={isOneLocked ? <LockOpen2Icon /> : <LockClosedIcon />}
            onClick={() => togglePartsLockBySelection()}
          >
            {translate(
              `tabs.layout.toolbar.edit.${isOneLocked ? 'locked' : 'unlocked'}`,
            )}
          </ToolbarPrimitive.DropdownMenuItem>
          <ToolbarPrimitive.DropdownMenuItem
            icon={<TrashIcon />}
            onClick={() => deletePartsBySelection()}
            keybind="Del"
          >
            {t`tabs.layout.toolbar.edit.delete`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.DropdownMenu icon={<CursorArrowIcon />}>
          <ToolbarPrimitive.DropdownMenuItem
            onClick={() => mutateSettings((draft) => {
              draft.editor.selectDeep = !draft.editor.selectDeep;
            })}
            icon={selectDeep ? <ChevronDownIcon /> : <DoubleArrowDownIcon />}
            keybind="Ctrl"
          >
            {translate(
              `tabs.layout.toolbar.cursor.${
                selectDeep ? 'select_cascade' : 'select_deep'
              }`,
            )}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            onClick={() => mutateSettings((draft) => {
              draft.editor.selectMultiple = !draft.editor.selectMultiple;
            })}
            icon={selectMultiple ? <CircleIcon /> : <PlusCircledIcon />}
            keybind="Shift"
          >
            {translate(
              `tabs.layout.toolbar.cursor.${
                selectMultiple ? 'select_concurrent' : 'select_multiple'
              }`,
            )}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            onClick={() => mutateApp((draft) => {
              draft.interface.focusMode = !draft.interface.focusMode;
            })}
            icon={focusMode ? <RulerSquareIcon /> : <LightningBoltIcon />}
            keybind="Alt + F"
          >
            {translate(
              `tabs.layout.toolbar.cursor.${
                focusMode ? 'normal_mode' : 'focus_mode'
              }`,
            )}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>
      </ToolbarPrimitive.Group>

      <ToolbarPrimitive.Group>
        <ToolbarPrimitive.Button
          onClick={() => undoVersion()}
          disabled={!hasUndos}
        >
          <ResetIcon />
        </ToolbarPrimitive.Button>

        <ToolbarPrimitive.Button
          onClick={() => redoVersion()}
          disabled={!hasRedos}
        >
          <ResetIcon style={{ transform: 'scaleX(-1)' }} />
        </ToolbarPrimitive.Button>

        <ToolbarPrimitive.DropdownMenu icon={<InfoCircledIcon />}>
          <ToolbarPrimitive.DropdownMenuItem
            icon={<InfoCircledIcon />}
            keybind="F1"
            onClick={link(WEBSITE)}
          >
            {t`tabs.layout.toolbar.help.about`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<ExclamationTriangleIcon />}
            keybind="F4"
            onClick={link(`${GH_REPO_URL}issues/new/choose`)}
          >
            {t`tabs.layout.toolbar.help.report`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<DiscordLogoIcon />}
            onClick={link(DISCORD)}
          >
            {t`tabs.layout.toolbar.help.discord`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            icon={<GitHubLogoIcon />}
            onClick={link(GH_REPO_URL)}
          >
            {t`tabs.layout.toolbar.help.github`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>

        <ToolbarPrimitive.DropdownMenu disabled icon={<GearIcon />}>
          <ToolbarPrimitive.DropdownMenuItem
            icon={<GearIcon />}
            keybind="Ctrl + ,"
          >
            {t`tabs.layout.toolbar.preferences.settings`}
          </ToolbarPrimitive.DropdownMenuItem>

          <ToolbarPrimitive.DropdownMenuItem
            keybind="Ctrl + K"
            icon={<KeyboardIcon />}
          >
            {t`tabs.layout.toolbar.preferences.keybinds`}
          </ToolbarPrimitive.DropdownMenuItem>
        </ToolbarPrimitive.DropdownMenu>
      </ToolbarPrimitive.Group>
    </ToolbarPrimitive.Container>
  );
}
export default Toolbar;
