import type { Provider, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"

import './styles/index.scss';
import "./components/index"; //layout components

import OptionsWrapper from "~components/OptionsWrapper"
import OptionsPane from "~components/OptionsPane"
import Button from "~components/Button"
import Logo from "~components/Logo"

function IndexOptions() {
  const [user, setUser] = useStorage<User | null>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)

        console.log(user);
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        } as any)
      }
    }

    init()
  }, [])

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href
      }
    })
  }

  return (
    <OptionsWrapper>
      <OptionsPane>
        {user && (
          <stack-l justify="center" style={{ textAlign: 'center' }}>
            <Logo width={175} />
            <div style={{ borderTop: '1px solid var(--gray-15)', paddingTop: 'var(--s0)' }}>Signed in as</div>
            <h2>
              {user.user_metadata.full_name}
            </h2>

            <Button
              onClick={() => {
                supabase.auth.signOut()
                setUser(null)
              }}>
              Logout
            </Button>
          </stack-l>
        )}
        {!user && (
          <stack-l>
            <Logo width={175} />
            <Button
              onClick={(e) => {
                handleOAuthLogin("google")
              }}>
              Sign in
            </Button>
          </stack-l>
        )}
      </OptionsPane>
    </OptionsWrapper>
  )
}

export default IndexOptions
