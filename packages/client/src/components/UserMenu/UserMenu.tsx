import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { BUDDY_MENU_DETAILS, NEWBIE_MENU_DETAILS } from 'graphql/user-menu.graphql';
import UserMenuNewbies from 'atoms/UserMenuNewbies';
import UserMenuDetails from 'atoms/UserMenuDetails';
import UserMenuSettings from 'atoms/UserMenuSettings';
import UserMenuBuddy from 'atoms/UserMenuBuddy';
import { isBuddy, isNewbie } from 'utils';
import { ROUTES } from 'shared/routes';
import { Buddy, Newbie, UserRole } from '@buddy-app/schema';
import { useAuth } from 'contexts/AuthContext';
import { DocumentNode } from 'graphql';
import { BasicDetailsParams, UserMenuProps, UserBasicDetails } from './types';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
  },
}));

const UserMenu: React.FC<UserMenuProps> = ({ onCloseClick }) => {
  const history = useHistory();
  const { list, loader } = useStyles();
  const {
    data: { userId, role },
    logout,
  } = useAuth();

  const userDetailsRoutes = {
    [UserRole.Buddy]: ROUTES.BUDDY_DETAILS,
    [UserRole.Newbie]: ROUTES.NEWBIE_DETAILS,
  };

  const onLogoutClick = () => {
    logout();
    history.push(ROUTES.BASE);
  };

  const getQueryByRole = (role: UserRole, id: string) => {
    if (isBuddy(role)) {
      return { query: BUDDY_MENU_DETAILS, variables: { buddyId: id } };
    } else if (isNewbie(role)) {
      return { query: NEWBIE_MENU_DETAILS, variables: { newbieId: id } };
    }
  };

  const selectNewbie = (id: string) => {
    history.push(ROUTES.BUDDY_TASKS_LIST.replace(':newbieId', id));
    onCloseClick && onCloseClick();
  };

  const selectBuddy = (id: string) => {
    history.push(ROUTES.NEWBIE_BUDDY_DETAILS.replace(':buddyId', id));
    onCloseClick && onCloseClick();
  };

  const userClickHandler = () => {
    history.push(userDetailsRoutes[role]);
    onCloseClick && onCloseClick();
  };

  const { query, variables } = getQueryByRole(role, userId) || {};
  const { data, loading } = useQuery<UserBasicDetails, BasicDetailsParams>(
    query as DocumentNode,
    {
      variables,
    }
  );
  const user = data && data[role.toLowerCase()];

  return (
    <Box className={list}>
      {user && (
        <Box data-testid='slide-menu-body'>
          <UserMenuDetails user={user} onClick={userClickHandler} />
          <Divider />
          {isBuddy(role) && (
            <UserMenuNewbies
              newbies={(user as Buddy).newbies}
              onSelect={selectNewbie}
            />
          )}
          {isNewbie(role) && (
            <UserMenuBuddy buddy={(user as Newbie).buddy} onSelect={selectBuddy} />
          )}
          <Divider />
          <UserMenuSettings
            allowPushedNotifications={!!user.allowPushedNotifications}
            updatePushNotificationsSettings={() => {}}
            onLogoutClick={onLogoutClick}
          />
        </Box>
      )}
      {loading && (
        <Box className={loader}>
          <CircularProgress data-testid='slide-menu-loader' />
        </Box>
      )}
    </Box>
  );
};

export default UserMenu;
