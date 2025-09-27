import type { Provider, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"

function WishlistPopup() {
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

  return (
    <div style={{ width: '300px' }}>
      <div>
        <div>[LOGO]</div>
        <div>[MENU]</div>
      </div>

      <div>
        <div>[INPUT ITEM TITLE]</div>
        <div>[INPUT ITEM URL]</div>
        <div>[INPUT ITEM PRICE]</div>
        <div>[INPUT ITEM NOTES]</div>
      </div>

      <div>[ADD TO WISHLIST BUTTON]</div>
    </div>
  )
}

export default WishlistPopup