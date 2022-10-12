import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { styled, theme } from 'stitches.config';

export const Thumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  backgroundColor: theme.colors.componentInteractiveBorder,
  borderRadius: theme.radii[4],
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});
