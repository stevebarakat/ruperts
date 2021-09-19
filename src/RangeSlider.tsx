import React, { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

// Styles

const Wrapper = styled.div<{ rotateLabels: boolean, lastLabelLength: any, firstLabelLength: any, labelLength: any }>`
  padding-bottom: ${p => p.rotateLabels && p.labelLength / 2.75 + "ch"};
  padding-left: ${p => p.rotateLabels ? "5px" : p.firstLabelLength / 2.75 + "ch"};
  padding-right: ${p => p.rotateLabels ? p.labelLength / 1.75 + "ch" : p.lastLabelLength / 2.75 + "ch"};
  width: fit-content;
  max-width: 100%;
`;

const RangeWrap = styled.div<{ showTooltip: boolean, showLabels: boolean }>`
  position: relative;
  padding-top: ${p => p.showTooltip ? "3.75em" : "1px"};
  padding-bottom: ${p => p.showLabels ? "1.75em" : 0};
  font-family: inherit;
  width: "var(--slider-width)";
  max-width: 100%;
  user-select: none;
`;

const RangeOutput = styled.output<{ focused: boolean }>`
  margin-top: -3.75em;
  width: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  span {
    border: ${(p) =>
    p.focused ? `1px solid var(--color-primary)` : `1px solid var(--color-dark)`};
    border-radius: 5px;
    font-weight: ${p => p.focused && "bold"};
    color: ${(p) => (p.focused ? "var(--color-light)" : "var(--color-dark)")};
    background: ${(p) => (p.focused ? "var(--color-primary)" : "var(--color-light)")};
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    padding: 0.5em 0.75em;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `14px solid var(--color-primary)` : `14px solid var(--color-dark)`};
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      margin-top: -1px;
    }&::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: ${p => p.focused ? `14px solid var(--color-primary)` : `12px solid var(--color-light)`};
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      margin-top: -1px;
    }
  }
`;

const Progress = styled.div<{ focused: boolean, wideTrack: boolean }>`
  position: absolute;
  border-radius: 100px;
  height: ${p => p.wideTrack ? "12px" : "7px"};
  width: 100%;
  z-index: 0;
  border-bottom: ${p => p.wideTrack ? "1px solid var(--color-transparent-gray)" : "none"};
  box-shadow: ${p => p.wideTrack ? "inset 1px 1px 1px 0.5px var(--color-transparent-gray)" : "none"};
`;

const StyledRangeSlider = styled.input.attrs({
  type: "range",
  role: "slider",
}) <{ focused: boolean, wideTrack: boolean }>`
  cursor: pointer;
  appearance: none;
  position: absolute;
  width: 100%;
  height: ${p => p.wideTrack ? "12px" : "9px"};
  border-radius: 15px;
  background: transparent;
  margin: 0;
  &:focus {
    outline: none;
  }


  &::-webkit-slider-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    /* top: ${p => p.wideTrack ? "-1.5px" : "-1.5px"}; */
    top: -1.5px;
    width: ${p => p.wideTrack ? "32px" : "20px"};
    height: ${p => p.wideTrack ? "32px" : "20px"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? p.focused ? "none" : `1px solid var(--color-transparent-gray)` : "none"};
    border-bottom: none;
    box-shadow: 0 1px 1px 0.5px var(--color-transparent-gray);
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover, var(--color-primary) 0%, var(--color-primary) 35%, var(--color-light) 40%,var(--color-light) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover, var(--color-light) 0%, var(--color-light) 35%, var(--color-primary) 40%, var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover, var(--color-light) 0%, var(--color-light) 20%, var(--color-primary) 25%, var(--color-primary) 100%)`
  }
  }
  
  &:focus::-webkit-slider-thumb {
    cursor: grabbing;
    background: ${p =>
    !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,var(--color-light) 40%,var(--color-light) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-light) 0%,var(--color-light) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`};
  }
  
  &::-moz-range-thumb {
    cursor: grab;
    pointer-events: all;
    position: relative;
    width: ${p => p.wideTrack ? "3em" : "1.5em"};
    height: ${p => p.wideTrack ? "3em" : "1.5em"};
    border-radius: 50%;
    border: ${p => p.wideTrack ? "1px solid var(--color-gray700)" : "none"};
    box-shadow: ${p => p.wideTrack ? "0 1px 5px 0 rgba(0, 0, 0, 0.25)" : "none"};
    -webkit-appearance: none;
    z-index: 50;
    background: ${(p) =>
    p.wideTrack ? !p.focused
      ? `-webkit-radial-gradient(center, ellipse cover,  var(--color-primary) 0%,var(--color-primary) 35%,var(--color-light) 40%,var(--color-light) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-light) 0%,var(--color-light) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
      : `-webkit-radial-gradient(center, ellipse cover,  var(--color-light) 0%,var(--color-light) 35%,var(--color-primary) 40%,var(--color-primary) 100%)`
  }
  }
  
`;

const Ticks = styled.div<{ wideTrack: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${p => p.wideTrack ? "10px 15px" : "5px 10px"};
`
const Tick = styled.div<{
  showTicks?: boolean;
  showLabels?: boolean;
  rotateLabels?: boolean;
}>`
  position: relative;
  width: 1px;
  height: 5px;
  background: ${(p) => (p.showTicks ? "var(--color-dark)" : "transparent")};
  margin-top: 1em;
`;

const Label = styled.label<{ rotateLabels: boolean }>`
  position: absolute;
  transform: translateX(-50%);
  color: var(--color-dark);
  margin-top: 0.5em;
  transform-origin: center;
  white-space: nowrap;
  text-align: center;
  transform: ${p => p.rotateLabels && "rotate(35deg)"};
  width: ${p => p.rotateLabels && "1px"};
`

function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface RangeSliderProps {
  /**
    The initial value.
  */
  initialValue: number;
  /**
    The minimum value.
  */
  min?: number;
  /**
    The maximum value. 
  */
  max?: number;
  /**
    The invterval between ticks.
  */
  step?: number;
  /**
    Snap to values.
   */
  snap?: boolean;
  /**
    Show or hide tick marks.
 */
  showTicks?: boolean;
  /**
    Show or hide labels.
  */
  showLabels?: boolean;
  /**
    Show or hide tooltip.
  */
  showTooltip?: boolean;
  /**
    Rotates labels by 45 degrees allowing for more and / or longer labels.
  */
  rotateLabels?: boolean;
  /**
    Replace default labels.  
  */
  customLabels?: Array<Record<number, string>>;
  /**
    Optional text displayed before value. 
   */
  prefix?: string;
  /**
    Optional text displayed after value.
   */
  suffix?: string;
  /**
    The width of the range track.
   */
  wideTrack?: boolean;
  /**
    The light color var(--color-light).
   */
  lightColor?: string;
  /**
    The dark color var(--color-dark).
   */
  darkColor?: string;
  /**
    The primary color var(--color-primary).
   */
  focusColor?: string;
  /**
    The secondary color var(--color-secondary).
  */
  blurColor?: string;
  /**
    The width of the range slider.
  */
  sliderWidth?: string;
  /**
    Styles
  */
  style?: any;
}

export const RangeSlider = ({
  initialValue = 50,
  min = 0,
  max = 100,
  step = 0,
  showTicks = false,
  snap = true,
  rotateLabels = false,
  customLabels = [],
  showLabels = false,
  prefix = "",
  suffix = "",
  wideTrack = false,
  showTooltip = false,
  focusColor = "",
  blurColor = "",
  sliderWidth = "",
  style,
  ...rest
}: RangeSliderProps) => {
  const rangeEl = useRef<HTMLInputElement | null>(null);
  const ticksEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState(initialValue);
  const [newValue, setNewValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const factor = (max - min) / 10;
  const newPosition = 10 - newValue * 0.2;

  function calcSteps(step: number) {
    if (step <= 0) return 0.1;
    if (step <= 0.1) return 0.01;
    if (step <= 0.01) return 0.001;
    if (step <= 0.001) return 0.0001;
  };

  const steps = calcSteps(step);

  // Make sure min never exceds max
  if (min > max) {
    min = max;
  }
  // Make sure max is never less than min
  if (max < min) {
    max = min;
  }

  const diff = max - min;

  useLayoutEffect(() => {
    setNewValue(Number(((value - min) * 100) / (max - min)));
  }, [value, min, max]);

  // For collecting tick marks
  function createLabels() {
    if (step > 0) {
      if (diff % step !== 0) throw Error("The distance between max and min (aka. max - min) must be divisible by step! \nUsing modulo operator: (max - min % step) must equal 0.\nCurrently (max - min % step) equals: " + (diff % step).toString());
      // creates an array of numbers from 'min' to 'max' with 'step' as interval
      const numbers = Array.from(Array((max - min) / step + 1)).map((_, i) => min + step * i);
      // create tick mark for every element in the numbers array 
      return numbers.map((n) => (
        <Tick
          showLabels={showLabels}
          rotateLabels={rotateLabels}
          showTicks={showTicks}
          key={n}
        >
          { // if there are custom labels, show them
            customLabels?.length > 0
              ? showLabels && customLabels.map((label) => {
                return (
                  n === Number(Object.keys(label)[0]) && (
                    <Label key={n} rotateLabels={rotateLabels} htmlFor={n.toString()}>{Object.values(label)}</Label>
                  )
                )
              })
              // if there are not custom labels, show the default labels (n)
              : showLabels &&
              <Label key={n} rotateLabels={rotateLabels} htmlFor={n.toString()}>
                {prefix + numberWithCommas(n.toString()) + suffix}
              </Label>
          }
        </Tick>
      ));
    }
  };

  const labels = createLabels();

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    const cmd = e.metaKey;
    const ctrl = e.ctrlKey;

    switch (e.code) {
      case "ArrowLeft": //Left
        (cmd || ctrl) && setValue(value - factor);
        return;
      case "ArrowDown": //Down
        (cmd || ctrl) && setValue(value - factor);
        return;
      case "ArrowUp": //Up
        (cmd || ctrl) && setValue(value >= max ? max : value + factor);
        return;
      case "ArrowRight": //Right
        (cmd || ctrl) && setValue(value >= max ? max : value + factor);
        return;
      default:
        return;
    }
  }

  const firstLabelLength = showLabels && (step > 0) && ticksEl?.current?.firstChild?.firstChild?.textContent?.length;
  const lastLabelLength = showLabels && (step > 0) && ticksEl?.current?.lastChild?.firstChild?.textContent?.length;

  function calcLabels() {
    if (lastLabelLength === undefined || firstLabelLength === undefined) return;
    if (firstLabelLength >= lastLabelLength) {
      return firstLabelLength;
    } else {
      return lastLabelLength;
    }
  }
  const labelLength = calcLabels();

  return (
    <Wrapper
      rotateLabels={rotateLabels}
      firstLabelLength={firstLabelLength}
      lastLabelLength={lastLabelLength}
      labelLength={labelLength}
    >
      <RangeWrap showTooltip={showTooltip} showLabels={showLabels} style={{ width: "var(--slider-width)", ...style }} {...rest}>
        <Progress
          wideTrack={wideTrack}
          focused={isFocused}
          style={
            !isFocused && wideTrack ? {
              background: `-webkit-linear-gradient(left, var(--color-secondary) 0%, var(--color-secondary) calc(${newValue}% + ${newPosition * 2
                }px), var(--color-light) calc(${newValue}% + ${newPosition * 1.65
                }px), var(--color-light) 100%)`, ...style
            } :
              {
                background: `-webkit-linear-gradient(left, var(--color-primary) 0%, var(--color-primary) calc(${newValue}% + ${newPosition * 2
                  }px), var(--color-secondary) calc(${newValue}% + ${newPosition * 1.65
                  }px), var(--color-secondary) 100%)`, ...style
              }
          }
          {...rest}
        />

        {showTooltip &&
          <RangeOutput
            focused={isFocused}
            style={{ left: wideTrack ? `calc(${newValue}% + ${newPosition * 1.65}px)` : `calc(${newValue}% + ${newPosition}px)`, ...style } as React.CSSProperties}
            {...rest}
          >
            <span>
              {prefix + numberWithCommas(value?.toString()) + suffix}
            </span>
          </RangeOutput>}
        <StyledRangeSlider
          aria-label="Basic Example"
          aria-orientation="horizontal"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          ref={rangeEl}
          min={min}
          max={max}
          step={snap ? step : steps}
          value={value > max ? max : value}
          onInput={(e) => {
            const { valueAsNumber } = e.target as HTMLInputElement;
            rangeEl.current?.focus();
            setValue(valueAsNumber);
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          focused={isFocused}
          wideTrack={wideTrack}
          style={{ ...style }}
          {...rest}
        />
        <Ticks ref={ticksEl} wideTrack={wideTrack}>{labels}</Ticks>
      </RangeWrap>
    </Wrapper>
  );
};
