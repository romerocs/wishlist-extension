import type { Provider, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"
import type { Session } from "@supabase/gotrue-js/src/lib/types";
import type { QueryData } from '@supabase/supabase-js';

import TopBar from "./components/TopBar";
import Button from "./components/Button";

import './styles/index.scss';
import "./components/index";

interface List {
  id: number;
  created_at: string;
  list_name: string;
}

interface ListItem {
  list_id: number;
  list_item_name: string;
  list_item_url: string;
  list_item_price: number;
  list_item_description?: string;
  list_item_is_purchased: false;
  list_item_is_priority: boolean;
}

function WishlistPopup() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const [lists, setLists] = useState<List[]>([]);

  const [selectedList, setSelectedList] = useState<number>();
  const [itemName, setItemName] = useState<string>();
  const [itemUrl, setItemUrl] = useState<string>();
  const [itemPrice, setItemPrice] = useState<number>();
  const [itemNotes, setItemNotes] = useState<string>();

  const [listItem, setListItem] = useState<ListItem | {}>({});

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

          type listQueryType = QueryData<typeof listQuery>

          const { data, error } = await listQuery;

          if (error) throw error;

          const listResult: listQueryType = data;

          setLists(listResult);

          const tabInfo = await retrieveTabInfo();
        } else {
          console.log("user session data is null");
        }
      } else {
        chrome.runtime.openOptionsPage();
      }
    }

    init()
  }, [])

  function selectListHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedList(Number(e.target.value));
  }

  async function addToWishlist() {
    const listItemDataComplete = selectedList !== undefined && itemName !== undefined && itemUrl !== undefined && itemPrice !== undefined;

    if (listItemDataComplete) {
      const listItemToAdd: ListItem = {
        list_id: selectedList,
        list_item_name: itemName,
        list_item_url: itemUrl,
        list_item_price: itemPrice,
        list_item_description: itemNotes,
        list_item_is_purchased: false,
        list_item_is_priority: false
      }

      const insertingItem = supabase.from("list_items").insert(listItemToAdd).select();

      type insertingItemType = QueryData<typeof insertingItem>;

      const { data, error } = await insertingItem;

      if (error) throw error;

      const addedItem: insertingItemType = data;

      if (!error) {
        //loading animation here.
        console.log('Item added:', addedItem);
      } else {
        //output message to alert bar maybe?
        //or log it somehow
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
          console.log('Response from page:', response);

          const { url, title, price } = response;

          console.log(price);

          if (url) {
            setItemUrl(url);
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

  return (
    <div style={{ width: '300px' }}>
      <stack-l>
        <TopBar />

        <stack-l>
          <input type="text" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
          <input type="url" placeholder="[INPUT ITEM URL]" value={itemUrl} onChange={e => setItemUrl(e.target.value)} />
          <input type="number" min={1.00} onChange={e => setItemPrice(Number(e.target.value))} />
          <textarea placeholder="[INPUT ITEM NOTES]" onChange={e => setItemNotes(e.target.value)}></textarea>

          <select name="item_priority" id="item_priority">
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>

          {lists.length > 0
            &&
            <select onChange={selectListHandler}>
              <option>Select List</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>{list.list_name}</option>
              ))}
            </select>
          }
        </stack-l>

        <button onClick={addToWishlist} disabled={listItem === null}>[ADD TO WISHLIST BUTTON]</button>
      </stack-l>
    </div >
  )
}

export default WishlistPopup