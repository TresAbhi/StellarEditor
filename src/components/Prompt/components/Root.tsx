import { VariantProps } from '@stitches/react';
import { HTMLAttributes, MouseEvent } from 'react';
import { styled, theme } from 'stitches.config';

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof StyledDiv> {}

const StyledDiv = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.gapUnrelated,
  borderRadius: theme.radii[4],
  border: theme.borderStyles.componentNonInteractive,
  backgroundColor: theme.colors.appBackground2,

  variants: {
    width: {
      regular: {
        width: theme.sizes.popupWidth,
      },
    },

    padding: {
      regular: { padding: theme.space.paddingMajor },
      thin: { padding: theme.space.padding },
    },
  },

  defaultVariants: {
    width: 'regular',
    padding: 'regular',
  },
});

// TODO: rename ALL CONTAINERS to Root
export function Root({ onClick, ...props }: ContainerProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  };

  return <StyledDiv {...props} onClick={handleClick} />;
}