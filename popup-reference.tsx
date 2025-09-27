import type { Provider, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"

function IndexPopup() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

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
        setUser(data.session.user)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token as string,
            access_token: data.session.access_token as string
          }
        } as any)

        const { data: lists, error: error_list } = await supabase.from("lists").select("*");

      } else {
        chrome.runtime.openOptionsPage();
      }
    }

    init()
  }, [])

  const contentScriptTest = async () => {

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab) {
        console.log('Unable to access current tab');
        return;
      }

      // Check if we can inject scripts into this tab
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://')) {
        console.log('Cannot access browser internal pages');
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'contentScriptTest' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Unable to communicate with page. Please refresh the page and try again.');
          return;
        }

        if (response) {
          console.log('Response from page:', response);
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
    <div
      style={{
        padding: 16
      }}>
      {user && (

        <>
          <h3>
            {user.email} - {user.id}
          </h3>
          <button onClick={contentScriptTest}>
            Content Script Test
          </button>
          <button

            onClick={() => {
              supabase.auth.signOut()
              setUser(null)
            }}>
            Logout
          </button>
        </>
      )}
    </div>
  )
}

export default IndexPopup
