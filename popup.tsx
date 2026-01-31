import type { Provider, User } from "@supabase/supabase-js"
import * as React from "react";
import { Dialog } from "radix-ui";
import { useEffect, useState, useRef } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"
import type { Session } from "@supabase/gotrue-js/src/lib/types";
import type { QueryData } from '@supabase/supabase-js';

import Select from 'react-select';
import TopBar from "./components/TopBar";
import Button from "./components/Button";
import LoadingScreen from "./components/LoadingScreen";
import LoadingSpinner from "~components/LoadingSpinner";
import Toggle from "~components/Toggle";
import DialogUpdateItemName from "./components/DialogUpdateItemName";
import { SaveText } from "~components/SaveText";

import {
  StyledPriceInput,
  StyledItemNameURLPriceRegion,
  StyledListItemNameH1,
  StyledListItemURL,
  StyledListItemNameToggleBtn
} from "./components/ListItemElements";

import {
  StyledTextInput,
  StyledTextArea,
  StyledSelect
} from "./components/FormElements";


import {
  StyledPopupWrapper,
} from "./components/Popup";

import './styles/index.scss';
import "./components/index"; //layout components
import type { UrlObject } from "url";

interface ListItem {
  list_id: number;
  list_item_name: string;
  list_item_url: string;
  list_item_price: number;
  list_item_description?: string;
  list_item_is_purchased: false;
  list_item_is_priority: boolean;
}

interface ReactSelectOption {
  value: number;
  label: string;
}

function WishlistPopup() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const [lists, setLists] = useState<ReactSelectOption[]>([]);
  const [selectedList, setSelectedList] = useState<number>();
  const [itemName, setItemName] = useState<string>();
  const [itemUrl, setItemUrl] = useState<string | undefined>("");
  const [itemUrlHost, setItemUrlHost] = useState<string | undefined>("");
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemNotes, setItemNotes] = useState<string>();
  const [itemIsPriority, setItemIsPriority] = useState<boolean>(false);
  const [listItemDataComplete, setListItemDataComplete] = useState<boolean>(false);
  const [listItemNameEditMode, setListItemNameEditMode] = useState<boolean>(false);
  const [loadingTimer, setLoadingTimer] = useState<number>(0);
  const [loadingScreenTimerEnabled, setLoadingScreenTimerEnabled] = useState<boolean>(false);
  const [submitTimerEnabled, setSubmitTimerEnabled] = useState<boolean>(false);
  const [itemSuccessfullyAdded, setItemSuccessfullyAdded] = useState<boolean>(false);

  const listItemNameh1Ref = useRef<HTMLHeadingElement>(null);
  const listItemNameTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const LOADING_SPINNER_INTERVAL = 250;
  const LOADING_SPINNER_MINTIME = 1000;
  const LOADING_SPINNER_FADEOUT = 150;

  useEffect(() => {
    async function init(): Promise<void> {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }

      const userIsLoggedIn: boolean = !!data.session;

      //Checking is user is logged in
      if (userIsLoggedIn) {
        const session: Session | null = data.session;

        if (session !== null) {
          setUser(session.user)
          sendToBackground({
            name: "init-session",
            body: {
              refresh_token: session.refresh_token as string,
              access_token: session.access_token as string
            }
          } as any)

          const listQuery = supabase.from("lists").select("*");

          type listQueryType = QueryData<typeof listQuery>;

          const loadingTimerInit = loadingTimerHandler(setLoadingScreenTimerEnabled);

          loadingTimerInit.start();

          const { data, error } = await listQuery;

          if (error) throw error;

          const listResult: listQueryType = data;

          const reactSelectOptions: ReactSelectOption[] = listResult.map(list => {
            const option: ReactSelectOption = {
              value: list.id,
              label: list.list_name
            };

            return option;
          });

          setLists(reactSelectOptions);

          loadingTimerInit.end();

          const tabInfo = await retrieveTabInfo();
        } else {
          console.log("user session data is null");
        }
      } else {
        chrome.runtime.openOptionsPage();
      }
    }

    init()
  }, []);

  useEffect(() => {
    if (listItemNameEditMode && listItemNameTextAreaRef.current) {
      const value = listItemNameTextAreaRef.current.value;
      listItemNameTextAreaRef.current.value = "";
      listItemNameTextAreaRef.current.focus();
      listItemNameTextAreaRef.current.value = value;

    }
  }, [listItemNameEditMode]);


  useEffect(() => {
    setListItemDataComplete(selectedList !== undefined && itemName !== undefined && itemUrl !== undefined && itemPrice > 0);
  }, [selectedList, itemName, itemUrl, itemPrice]);

  function selectListHandler(selectedOption: ReactSelectOption | null) {
    if (selectedOption) {
      setSelectedList(selectedOption.value);
    }
  }

  function loadingTimerHandler(stateHandler: React.Dispatch<React.SetStateAction<boolean>>) {
    let counter = 0;
    let loadingSpinner: number;

    const start = () => {
      stateHandler(true);

      loadingSpinner = window.setInterval(() => {
        counter = counter + LOADING_SPINNER_INTERVAL;

        setLoadingTimer(counter);
      }, LOADING_SPINNER_INTERVAL);
    }

    const end = () => {
      window.setTimeout(() => {
        setLoadingTimer(0);
        stateHandler(false);
        clearInterval(loadingSpinner);
      }, LOADING_SPINNER_MINTIME);
    }

    return {
      start,
      end
    }
  }

  async function addToWishlist() {
    const loadingTimerInit = loadingTimerHandler(setSubmitTimerEnabled);

    loadingTimerInit.start();

    const listItemDataComplete = selectedList !== undefined && itemName !== undefined && itemUrl !== undefined && itemPrice !== undefined;

    if (listItemDataComplete) {
      const listItemToAdd: ListItem = {
        list_id: selectedList,
        list_item_name: itemName,
        list_item_url: itemUrl,
        list_item_price: itemPrice,
        list_item_description: itemNotes,
        list_item_is_purchased: false,
        list_item_is_priority: itemIsPriority
      }

      const insertingItem = supabase.from("list_items").insert(listItemToAdd).select();

      type insertingItemType = QueryData<typeof insertingItem>;

      const { data, error } = await insertingItem;

      if (error) throw error;

      const addedItem: insertingItemType = data;

      loadingTimerInit.end();

      if (!error) {
        setItemSuccessfullyAdded(true);
      } else {
        console.log(error);
      }
    }
  }

  const retrieveTabInfo = async () => {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.url || !tab.id) {
        console.log('Unable to access current tab');
        return;
      }

      // Check if we can inject scripts into this tab
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://')) {
        console.log('Cannot access browser internal pages');
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'retrieveTabInfo' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Unable to communicate with page. Please refresh the page and try again.');
          return;
        }

        if (response) {
          const { url, title, price, schema } = response;

          console.log(schema);

          if (url) {
            const urlObject = new URL(url);

            if (urlObject.href && urlObject.host) {
              setItemUrl(urlObject.href);
              setItemUrlHost(urlObject.host);
            }
          }

          if (title) {
            setItemName(title);
          }

          return response;
        } else {
          console.log('No response from page');
        }
      });

    } catch (error) {
      console.error('Error getting H1 content:', error);
      console.log('An error occurred while fetching H1 content');
    }
  }

  const priorityToggleHandler = (isPriority: boolean) => {
    setItemIsPriority(isPriority);
  }

  const enterListItemNameEditMode = () => {
    if (!listItemNameEditMode) setListItemNameEditMode(true);
  };

  const exitListItemNameEditMode = (e: React.KeyboardEvent<HTMLElement>) => {
    if (listItemNameEditMode && e.key === "Enter") setListItemNameEditMode(false);
  }

  return (
    <div style={{ position: 'relative', height: '450px', overflow: 'hidden' }}>
      {(loadingScreenTimerEnabled && loadingTimer < (LOADING_SPINNER_MINTIME + LOADING_SPINNER_FADEOUT)) && <LoadingScreen showWhen={loadingTimer < LOADING_SPINNER_MINTIME} duration={LOADING_SPINNER_FADEOUT} />}
      <Dialog.Root>
        <StyledPopupWrapper>

          <stack-l>
            <TopBar />

            <stack-l space="var(--s3)">
              <Select options={lists} onChange={selectListHandler} styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...StyledSelect,
                }),
                indicatorSeparator: () => ({
                  display: 'none'
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  overflow: 'visible',
                })
              }} />

              <Toggle handler={priorityToggleHandler} />

              <StyledItemNameURLPriceRegion>
                <div style={{ minWidth: 0 }}>
                  <stack-l>
                    <Dialog.Trigger asChild>
                      <StyledListItemNameToggleBtn onClick={enterListItemNameEditMode} onKeyDown={exitListItemNameEditMode} style={{ textBox: 'normal' } as {}}>
                        <StyledListItemNameH1 ref={listItemNameh1Ref}>{itemName}</StyledListItemNameH1>
                      </StyledListItemNameToggleBtn>
                    </Dialog.Trigger>
                    <StyledListItemURL>{itemUrlHost}</StyledListItemURL>
                  </stack-l>
                </div>

                <StyledPriceInput>
                  <StyledTextInput type="number" placeholder="14.99" min={1.00} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemPrice(Number(e.target.value))} />
                </StyledPriceInput>
              </StyledItemNameURLPriceRegion>

              <StyledTextArea placeholder="Description" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItemNotes(e.target.value)}></StyledTextArea>
            </stack-l>

            <Button onClick={addToWishlist} $disabled={!listItemDataComplete} $saved={itemSuccessfullyAdded}>
              {(submitTimerEnabled && loadingTimer < (LOADING_SPINNER_MINTIME + LOADING_SPINNER_FADEOUT)) ? <LoadingSpinner size={25} /> : <SaveText saved={itemSuccessfullyAdded} shoudFadeIn={!submitTimerEnabled} />}
            </Button>
          </stack-l>
        </StyledPopupWrapper>

        <Dialog.Portal>
          <DialogUpdateItemName itemName={itemName} setItemName={setItemName} />
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default WishlistPopup