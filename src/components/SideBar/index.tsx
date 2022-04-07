import ScrollableComponent from 'components/Scrollable';
import { FC, InputHTMLAttributes } from 'react';
import styles from './index.module.scss';

interface ContainerProps extends InputHTMLAttributes<HTMLDivElement> {
  width?: 'major' | 'minor';
}
export const Container: FC<ContainerProps> = ({
  children,
  width = 'major',
  ...props
}) => (
  <div
    {...props}
    className={`${props.className ?? ''} ${styles['side-bar']} ${
      width === 'major' ? styles.major : styles.minor
    }`}
  >
    {children}
  </div>
);

export const Scrollable: FC<InputHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <ScrollableComponent
    {...props}
    className={`${styles.scrollable} ${className ?? ''}`}
  >
    {children}
  </ScrollableComponent>
);
