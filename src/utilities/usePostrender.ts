import { useGLTF } from '@react-three/drei';
import useKeybinds from 'hooks/useKeybinds';
import { PART_MODEL_PATH } from 'hooks/usePartModel';
import useStellarContext from 'hooks/useStellarContext';
import useTranslator from 'hooks/useTranslator';
import { isMobile } from 'react-device-detect';
import { globalStyles, themeDark } from 'stitches.config';
import useApp from 'stores/useApp';
import usePartRegistry from 'stores/usePartRegistry';

const usePostrender = () => {
  const stellarContext = useStellarContext();
  useTranslator();
  globalStyles();
  useKeybinds();

  // Temporarily enforce dark mode
  document.getElementById('root')?.classList.add(themeDark);

  if (stellarContext.codeName !== 'dev') {
    console.log(
      '%cWARNING!',
      `
        background-color: red;
        color: white;
        font-size: 32px;
        font-weight: bold;
      `,
    );
    console.log(
      `%cDo not paste in anything here unless you know what you are doing!Malicious code can harm ${stellarContext.title} and your data (blueprints, snippets, etc.) permanently`,
      `
        background-color: orange;
        color: white;
        font-weight: bold;
        font-size: 16px;
      `,
    );
  }

  if (window.location.pathname === '/') {
    window.location.pathname = isMobile ? '/mobile' : '/desktop';
  }

  const version = stellarContext.version.split('.');
  document.title = `${stellarContext.title} ${version[0]}.${version[1]}`;

  const rerenderDocumentTitle = () => {
    const { fileHandle } = useApp.getState();
    const { hasUnsavedChanges } = useApp.getState();

    document.title = `${stellarContext.title} ${
      fileHandle ? `- ${fileHandle.name}` : `${version[0]}.${version[1]}`
    }${hasUnsavedChanges ? '*' : ''}`;
  };

  useApp.subscribe((state) => state.hasUnsavedChanges, rerenderDocumentTitle);
  useApp.subscribe((state) => state.fileHandle, rerenderDocumentTitle);

  usePartRegistry.getState().forEach(({ preload }) => {
    if (preload) {
      const preloads = typeof preload === 'string' ? [preload] : preload;

      preloads.forEach((fileName) => {
        useGLTF.preload(`${PART_MODEL_PATH}${fileName}.gltf`);
      });
    }
  });
};
export default usePostrender;