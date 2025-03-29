import React, { FormEvent, useEffect, useState } from 'react';
import LegendDrawer from '../Drawers/LegendDrawer';
import {
  Badge,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import strings from '@/common/strings';
import LoginDrawer from '../Drawers/LoginDrawer';
import { Settings } from '../Drawers/SettingsDrawer';
import SignupDrawer from '../Drawers/SignupDrawer';
import { useUserContext } from '@/contexts/UserContext';

interface Props {
  isConnected?: boolean;
  handleOpenAi?: (e: FormEvent<HTMLFormElement>) => void;
  handleFirecrawl?: (e: FormEvent<HTMLFormElement>) => void;
  handleSignup?: (e: FormEvent<HTMLFormElement>) => void;
  handleEmailChange?: (e: FormEvent<HTMLFormElement>) => void;
  handlePasswordChange?: (e: FormEvent<HTMLFormElement>) => void;
}

const Nav = (props: Props) => {
  const {
    isConnected,
    handleFirecrawl,
    handleOpenAi,
    handleEmailChange,
    handlePasswordChange,
  } = props;
  const { user_id, firecrawl_key, openai_key, logout, login, signup } =
    useUserContext();
  const [showSignupForm, setShowSignupForm] = useState<boolean>();
  const [showLoginForm, setShowLoginForm] = useState<boolean>();
  const [showLegend, setShowLegend] = useState<boolean>();
  const [showSettings, setShowSettings] = useState<boolean>();
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const hasOpenAiKey = !!openai_key;
  const hasFirecrawlKey = !!firecrawl_key;

  useEffect(
    function getSettingsBadgeCount() {
      const array = [isConnected, hasFirecrawlKey, hasOpenAiKey];
      let count = 0;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element === false) count++;
      }
      setBadgeCount(count);
    },
    [isConnected, hasFirecrawlKey, hasOpenAiKey]
  );

  return (
    <Navbar className='w-full text-center justify-center p-3'>
      <NavbarBrand>
        <p className='font-bold text-white'>{strings.siteTitle}</p>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button
            color='primary'
            variant='flat'
            onPress={() => setShowLegend(true)}
          >
            Legend
          </Button>
        </NavbarItem>
        {!user_id ? (
          <>
            {signup && (
              <NavbarItem>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={() => setShowSignupForm(true)}
                >
                  Signup
                </Button>
              </NavbarItem>
            )}
            {login && (
              <NavbarItem>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={() => setShowLoginForm(true)}
                >
                  Login
                </Button>
              </NavbarItem>
            )}
          </>
        ) : (
          <>
            <NavbarItem>
              <Badge
                color='danger'
                content={badgeCount}
                shape='circle'
                isInvisible={badgeCount === 0}
              >
                <Button
                  color='primary'
                  variant='flat'
                  onPress={() => setShowSettings(true)}
                >
                  Settings
                </Button>
              </Badge>
            </NavbarItem>
            <NavbarItem>
              <Button color='primary' variant='flat' onPress={logout}>
                Logout
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      {showSignupForm && signup && (
        <SignupDrawer
          isOpen={showSignupForm}
          onClose={() => setShowSignupForm(false)}
          handleSubmit={signup}
        />
      )}
      {!user_id && showLoginForm && login && (
        <LoginDrawer
          isOpen={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          handleSubmit={login}
        />
      )}
      {showLegend && (
        <LegendDrawer
          isOpen={showLegend}
          onClose={() => setShowLegend(false)}
        />
      )}
      {showSettings && (
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          isConnected={isConnected}
          handleOpenAi={handleOpenAi}
          handleFirecrawl={handleFirecrawl}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
        />
      )}
    </Navbar>
  );
};
export default Nav;
