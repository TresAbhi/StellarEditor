import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { forwardRef, InputHTMLAttributes } from 'react';
import { styled, theme } from 'stitches.config';

export interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {}

const Container = styled('div', {
  display: 'flex',
  padding: `0 ${theme.space.padding}`,
  gap: theme.space.gapRelatedMajor,
  borderRadius: theme.radii[4],
  height: theme.sizes.inputHeightMajor,
  justifyContent: 'center',
  alignItems: 'center',
  border: theme.borderStyles.componentInteractive,

  '&:hover': {
    border: theme.borderStyles.componentInteractiveHover,
  },
  '&:active, &:focus-within': {
    border: theme.borderStyles.componentInteractiveActive,
  },
});

const Input = styled('input', {
  fontSize: theme.fontSizes[12],
  color: theme.colors.textHighContrast,
  flex: 1,
  height: '100%',
  padding: 'none',

  '&::placeholder': {
    color: theme.colors.textLowContrast,
  },
});

const Icon = styled(MagnifyingGlassIcon, {
  width: theme.sizes[16],
  height: theme.sizes[16],
  color: theme.colors.textLowContrast,
});

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (props, ref) => {
    return (
      <Container>
        <Input {...props} ref={ref} />
        <Icon />
      </Container>
    );
  },
);
