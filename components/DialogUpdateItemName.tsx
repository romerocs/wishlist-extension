import { Dialog } from "radix-ui";
import { useState, useRef } from "react";
import styled, { css } from 'styled-components';
import Button from "./Button";
import ButtonClose from "./ButtonClose";
import {
  StyledTextArea,
} from "./FormElements";

const StyledDialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.25);
  backdrop-filter: blur(4px);
`;

const StyledDialogContent = styled(Dialog.Content)`
	background-color: white;
	border-radius: 6px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 250px;
	max-height: 85vh;
	padding: 25px;
`;

interface DialogUpdateItemName {
  itemName?: String,
  setItemName: Function
}

export default function DialogUpdateItemName({ itemName, setItemName }: DialogUpdateItemName) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const textAreaChangeHandler = () => {
    if (textAreaRef.current) {
      setItemName(textAreaRef.current.value);
    }
  };



  return (
    <>
      <StyledDialogOverlay />
      <StyledDialogContent>
        <stack-l>
          <h3>Update Item Name</h3>
          <StyledTextArea onChange={textAreaChangeHandler} ref={textAreaRef}>{itemName}</StyledTextArea>

          <Dialog.Close asChild>
            <Button>Save</Button>
          </Dialog.Close>
        </stack-l>

        <Dialog.Close asChild>
          <ButtonClose />
        </Dialog.Close>
      </StyledDialogContent>
    </>
  )
}