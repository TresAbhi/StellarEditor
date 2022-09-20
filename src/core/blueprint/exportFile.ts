import { fileSave } from 'browser-fs-access';
import useApp from 'stores/useApp';
import useBlueprint from 'stores/useBlueprint';
import { exportifyBlueprint } from './exportifyBlueprint';
import {
  FILE_EXTENSION_REGEX,
  UNNAMED_BLUEPRINT_FILE_NAME,
} from './saveFileAs';
import { WATERMARK_KEY, WATERMARK_VALUE } from './importifyBlueprint';

export const exportFile = async () => {
  const {
    file: { handle },
  } = useApp.getState();
  const fileName =
    handle?.name.replace(FILE_EXTENSION_REGEX, '') ??
    UNNAMED_BLUEPRINT_FILE_NAME.replace(FILE_EXTENSION_REGEX, '');
  const data = exportifyBlueprint(useBlueprint.getState());
  const blob = new Blob(
    [
      `{\n"${WATERMARK_KEY}": "${WATERMARK_VALUE}"\n\n,${JSON.stringify(
        data,
      ).slice(1)}`,
    ],
    {
      // TODO: formatting the JSON must be a settings option
      type: 'application/json',
    },
  );

  await fileSave(blob, {
    fileName: `${fileName}.txt`, // TODO: make this a settings option
    description: 'SFS blueprint file',
    mimeTypes: ['application/json'],
    extensions: ['.json', '.txt'],
  });
};