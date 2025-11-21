import type { Provider, User } from "@supabase/supabase-js"
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
import LoadingSpinner from "./components/LoadingSpinner";
import {
  StyledTextInput,
  StyledTextArea,
  StyledSelect,
  StyledPriceInput,
  StyledPopupWrapper,
  StyledItemNameURLPriceRegion,
  StyledListItemNameH1,
  StyledListItemNameTextArea,
  StyledListItemURL,
  StyledListItemNameToggleBtn
} from "./components/Styles";
import Toggle from "~components/Toggle";

import './styles/index.scss';
import "./components/index"; //layout components

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
  const [itemNameHeight, setItemNameHeight] = useState<number>(0);
  const [itemUrl, setItemUrl] = useState<string>();
  const [itemPrice, setItemPrice] = useState<number>();
  const [itemNotes, setItemNotes] = useState<string>();
  const [itemIsPriority, setItemIsPriority] = useState<boolean>(false);

  const [listItemNameEditMode, setListItemNameEditMode] = useState<boolean>(false);
  const [listItem, setListItem] = useState<ListItem | {}>({});
  const [loadingTimer, setLoadingTimer] = useState<number>(0);
  const [loadingTimerEnabled, setLoadingTimerEnabled] = useState<boolean>(false);

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

          const loadingTimerInit = loadingTimerHandler();

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

          if (!listItemNameEditMode && listItemNameh1Ref.current !== null) {
            window.setTimeout(() => {
              if (listItemNameh1Ref.current !== null) {

                const rect = listItemNameh1Ref.current.getBoundingClientRect();

                setItemNameHeight(rect.height);
              }
            }, 1000);
          }
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
  }, [listItemNameEditMode])

  function selectListHandler(selectedOption: ReactSelectOption | null) {
    if (selectedOption) {
      setSelectedList(selectedOption.value);
    }
  }

  function loadingTimerHandler() {
    let counter = 0;
    let loadingSpinner: number;

    const start = () => {
      setLoadingTimerEnabled(true);

      loadingSpinner = window.setInterval(() => {
        counter = counter + LOADING_SPINNER_INTERVAL;

        console.log(counter);

        setLoadingTimer(counter);
      }, LOADING_SPINNER_INTERVAL);
    }

    const end = () => {
      window.setTimeout(() => {
        setLoadingTimer(0);
        setLoadingTimerEnabled(false);
        clearInterval(loadingSpinner);
      }, LOADING_SPINNER_MINTIME);
    }

    return {
      start,
      end
    }
  }

  async function addToWishlist() {
    const loadingTimerInit = loadingTimerHandler();

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
        console.log('Item added:', addedItem);
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
          const { url, title, price } = response;

          if (url) {
            const urlObject = new URL(url);

            setItemUrl(urlObject.host);
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
    <div style={{ position: 'relative' }}>
      {(loadingTimerEnabled && loadingTimer < (LOADING_SPINNER_MINTIME + LOADING_SPINNER_FADEOUT)) && <LoadingSpinner showWhen={loadingTimer < LOADING_SPINNER_MINTIME} duration={LOADING_SPINNER_FADEOUT} />}
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
              })
            }} />

            <Toggle handler={priorityToggleHandler} />

            <StyledItemNameURLPriceRegion>
              <div style={{ minWidth: 0 }}>
                <stack-l>
                  <StyledListItemNameToggleBtn onClick={enterListItemNameEditMode} onKeyDown={exitListItemNameEditMode} style={{ textBox: 'normal' } as {}}>
                    {listItemNameEditMode ? <StyledListItemNameTextArea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItemName(e.target.value)} $height={itemNameHeight} defaultValue={itemName} ref={listItemNameTextAreaRef} /> : <StyledListItemNameH1 ref={listItemNameh1Ref}>{itemName}</StyledListItemNameH1>}
                  </StyledListItemNameToggleBtn>
                  <StyledListItemURL>{itemUrl}</StyledListItemURL>
                </stack-l>
              </div>

              <StyledPriceInput>
                <StyledTextInput type="number" placeholder="14.99" min={1.00} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemPrice(Number(e.target.value))} />
              </StyledPriceInput>
            </StyledItemNameURLPriceRegion>

            <StyledTextArea placeholder="Description" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItemNotes(e.target.value)}></StyledTextArea>
          </stack-l>

          <Button callback={addToWishlist} disabled={listItem === null}>Save</Button>
        </stack-l>
      </StyledPopupWrapper>
    </div>
  )
}

export default WishlistPopup