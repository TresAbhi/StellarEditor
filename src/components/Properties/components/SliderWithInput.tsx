import { Slider as SliderPrimitive, SliderProps } from 'components/Slider';
import { MIXED_VALUE_PLACEHOLDER } from 'hooks/useNumericalInputProperty';
import {
  FocusEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { styled, theme } from 'stitches.config';
import { evaluateExpression } from 'utilities/evaluateExpression';
import { PropertyWithLabel } from '../types/propertyWithLabel';
import { PropertyWithUnit } from '../types/propertyWithUnit';
import { Input, InputRef } from './Input';
import { Label } from './Label';

export interface SliderWithInputProps
  extends SliderProps,
    PropertyWithLabel,
    PropertyWithUnit {
  indeterminate?: boolean;
}

export interface SliderWithInputRef extends HTMLDivElement {
  setValue: (newValue: number) => void;
  setIndeterminate: (newIndeterminate: boolean) => void;
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: theme.space.gapRelated,
});

const Content = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.gapRelatedMajor,
});

const Slider = styled(SliderPrimitive, {
  flex: 2,
});

// export const SliderWithInput: FC<SliderWithInputProps> = ({
//   label,
//   min = 0,
//   unit,
//   indeterminate,
//   value = min,
//   defaultValue = min,
//   onValueChange,
//   ...props
// }) => {
//   const input = useRef<InputRef>(null!);
//   const handleKeyDown = useInputEscape();
//   const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
//     if (onValueChange) {
//       const evaluatedValue = evaluateExpression(event.target.value);

//       if (evaluatedValue === null) {
//         input.current.value = indeterminate
//           ? MIXED_VALUE_PLACEHOLDER
//           : `${value}`;
//       } else {
//         onValueChange(evaluatedValue);
//       }
//     }
//   };

//   useEffect(() => {
//     input.current.value = indeterminate ? MIXED_VALUE_PLACEHOLDER : `${value}`;
//   }, [value, indeterminate]);

//   return (
//     <Container>
//       {label && <Label>{label}</Label>}

//       <Content>
//         <Slider
//           {...props}
//           value={value}
//           defaultValue={defaultValue}
//           onValueChange={onValueChange}
//           disabled // stop from focusing
//         />
//         <Input
//           ref={input}
//           unit={unit}
//           defaultValue={indeterminate ? MIXED_VALUE_PLACEHOLDER : value}
//           onKeyDown={handleKeyDown}
//           onBlur={handleBlur}
//         />
//       </Content>
//     </Container>
//   );
// };

export const SliderWithInput = forwardRef<
  SliderWithInputRef,
  SliderWithInputProps
>(
  (
    {
      label,
      min = 0,
      max = 100,
      step = 1,
      unit,
      indeterminate: givenIndeterminate = false,
      value: givenValue,
      defaultValue = min,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const container = useRef<HTMLDivElement>(null!);
    const input = useRef<InputRef>(null!);
    const [value, setValue] = useState(defaultValue ?? min);
    const [indeterminate, setIndeterminate] = useState(givenIndeterminate);

    const normalizedValue = (value: number) => {
      return indeterminate ? MIXED_VALUE_PLACEHOLDER : `${value}`;
    };

    const handleSliderValueChange = (newValue: number) => {
      if (givenValue === undefined) {
        input.current.value = normalizedValue(newValue);
        input.current.resize();

        setValue(newValue);
      }

      onValueChange && onValueChange(newValue);
    };
    const handleInputBlur = (event: FocusEvent<InputRef>) => {
      if (givenValue === undefined) {
        let evaluated = evaluateExpression(event.target.value);

        if (isNaN(evaluated)) {
          event.target.value = normalizedValue(givenValue ?? value);
        } else {
          evaluated = Math.round(evaluated / step) * step;
          evaluated = Math.min(max, Math.max(min, evaluated));
          event.target.value = normalizedValue(evaluated);

          onValueChange && onValueChange(evaluated);
          setValue(evaluated);
        }
        event.target.resize();
      }
    };

    // eslint-disable-next-line
    useEffect(() => {
      (container.current as SliderWithInputRef).setValue = (
        newValue: number,
      ) => {
        input.current.value = normalizedValue(newValue);
        input.current.resize();

        setValue(newValue);
      };
      (container.current as SliderWithInputRef).setIndeterminate =
        setIndeterminate;
    });

    useImperativeHandle(ref, () => container.current as SliderWithInputRef);

    return (
      <Container ref={container}>
        {label && <Label>{label}</Label>}

        <Content>
          <Slider
            {...props}
            value={givenValue ?? value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderValueChange}
            disabled // stop from focusing
          />
          <Input
            ref={input}
            defaultValue={normalizedValue(givenValue ?? value)}
            onBlur={handleInputBlur}
          />
        </Content>
      </Container>
    );
  },
);