import type { MouseEventHandler, MouseEvent } from "~node_modules/@types/react";
import styled from "styled-components";
import { useState } from "react";

type PriorityTextOptions = 'low' | 'high';

const StyledLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledButton = styled.button`
  position:relative;
  width: 43px;
  height: 26px;
  border-radius: 52px;
  border:none;
  cursor: pointer;
  transition: all 600ms ease;
  
  &:before {
    content: "";
    width: 18px;
    height: 18px;
    border-radius: 24px;
    background-color: var(--white);
    position: absolute;
    top: 50%;
    right: 0;
    transition: all 600ms ease;
  }

  &[aria-checked="true"] {
    background-color: var(--lime-green);
  }

  &[aria-checked="false"] {
    background-color: var(--gray-15);
  }

  &[aria-checked="true"]:before {
    transform: translate(-20px, -50%);
  }

  &[aria-checked="false"]:before {
    transform: translate(-5px, -50%);
  }
`



export default function Toggle({ handler }: { handler: Function }) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [priorityText, setPriorityText] = useState<PriorityTextOptions>('low');

  const toggleHandler: MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
    const isCheckedUpdated = !isChecked;
    const priorityTextUpdated = isCheckedUpdated ? 'high' : 'low';

    setIsChecked(isCheckedUpdated);
    setPriorityText(priorityTextUpdated);

    handler(isCheckedUpdated);
  };

  return (
    <StyledLabel>
      <span>Priority is <b>{priorityText}</b></span>

      <StyledButton
        role="switch"
        aria-checked={isChecked}
        type="button"
        onClick={toggleHandler}>
      </StyledButton>
    </StyledLabel>
  )
}