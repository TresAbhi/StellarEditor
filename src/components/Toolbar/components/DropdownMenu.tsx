import { CaretDownIcon } from '@radix-ui/react-icons';
import * as DropdownMenuPrimitive from 'components/DropdownMenu';
import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { styled, theme } from 'stitches.config';
import useSettings from 'stores/useSettings';

export interface DropdownMenuProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
  icon: ReactNode;
  disabled?: boolean;
}

const Root = styled(DropdownMenuPrimitive.Root, {});

const Trigger = styled(DropdownMenuPrimitive.Trigger, {
  listStyle: 'none',
  width: theme.sizes[40],
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.sizes[4],

  '&::-webkit-details-marker': {
    display: 'none',
  },

  '& > svg': {
    width: theme.sizes[16],
    height: theme.sizes[16],
  },

  variants: {
    disabled: {
      true: {
        color: theme.colors.textLowContrast,
      },

      false: {
        cursor: 'pointer',
        color: theme.colors.textHighContrast,

        '&:hover': {
          backgroundColor: theme.colors.componentBackgroundHover,
        },
        '&:active': {
          backgroundColor: theme.colors.componentBackgroundActive,
        },
        '&:focus': {
          outline: theme.borderStyles.componentInteractiveActive,
        },
      },
    },
  },

  defaultVariants: {
    disabled: false,
  },
});

const Caret = styled(CaretDownIcon, {
  width: `${theme.sizes[8]} !important`,
  height: `${theme.sizes[8]} !important`,

  [`${Trigger}[data-state="open"] &`]: {
    transform: 'rotate(180deg)',
  },
});

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  icon,
  disabled,
  ...props
}) => (
  <Root {...props}>
    <Trigger disabled={disabled}>
      {icon}
      <Caret />
    </Trigger>

    <DropdownMenuPrimitive.Content
      className={useSettings((state) => state.interface.theme)}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  </Root>
);