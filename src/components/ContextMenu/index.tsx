import { ReactComponent as NextIcon } from 'assets/icons/next.svg';
import { FC, useRef } from 'react';
import './index.scss';
import { type as extendButtonType } from './types/extendButton';
import {
  contextMenuListing,
  contextMenuListing as listingType,
} from './types/root';
import { type as textButtonType } from './types/textButton';

// TODO: SIMPLIFY ALL CLASS NAMES
type TextButtonProps = { data: textButtonType; extended?: boolean };
export const TextButton: FC<TextButtonProps> = ({ data, extended = false }) => {
  const Icon = data?.icon;

  return (
    <button className="text-button" onClick={() => data.onClick()}>
      <div className="icon-container">{Icon ? <Icon /> : undefined}</div>
      <span className="text">{data.text}</span>
      <div className="icon-container right">
        {extended ? <NextIcon /> : undefined}
      </div>
    </button>
  );
};

const Separator = () => {
  return <div className="separator" />;
};

type ExtendButtonProps = { data: extendButtonType };
const ExtendButton: FC<ExtendButtonProps> = ({ data }) => {
  return (
    <TextButton
      data={{
        ...data,
        onClick: () => alert(`fine, i'll extend it`),
      }}
      extended={true}
    />
  );
};

const typeToComponent: any = {
  text_button: TextButton,
  separator: Separator,
  extend_button: ExtendButton,
};
type ContextContainerProps = {
  data: listingType;
  toolbar?: boolean;
  onActionTaken?: Function;
};
export const ContextContainer: FC<ContextContainerProps> = ({
  data,
  toolbar = false,
  onActionTaken,
}) => {
  let listingComponents;

  listingComponents = data.listing.map((listing, index) => {
    const Component = typeToComponent[listing.type];
    return (
      <Component
        key={`listing-${index}`}
        data={{
          ...listing,
          onClick: () => {
            // if it has it, run it
            (listing as any)?.onClick();
            if (onActionTaken) onActionTaken();
          },
        }}
      />
    );
  });

  return (
    <div
      className={`
        context-container
        ${toolbar ? 'toolbar' : 'generic'}
      `}
      style={
        toolbar
          ? {}
          : {
              position: 'fixed',
              left: data.x,
              top: data.y,
            }
      }
    >
      {listingComponents}
    </div>
  );
};

type ContainerProps = { contexts: Array<contextMenuListing>; onBlur: Function };
export const Container: FC<ContainerProps> = ({ contexts, onBlur }) => {
  const contextMenus = contexts.map((contextMenu, index) => {
    return (
      <ContextContainer
        key={`context-menu-${index}`}
        data={contextMenu}
        onActionTaken={onBlur}
      />
    );
  });

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={componentRef}
      onClick={(event) => {
        if (event.target === componentRef.current) onBlur();
      }}
      className={`
    contexts-container
    ${contexts.length > 0 ? 'active' : 'inactive'}
  `}
    >
      {contextMenus}
    </div>
  );
};
