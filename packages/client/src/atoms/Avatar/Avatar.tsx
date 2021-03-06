import React from 'react';
import xss from 'dompurify';
import CircularProgress from '@material-ui/core/CircularProgress';
import AvatarMaterialUI from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import theme from 'styles/theme';
import avatarPlaceholder from 'assets/svg/avatar-placeholder.svg';
import { AvatarProps, AvatarType } from './types';

const useRegularTypeStyles = makeStyles({
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
    marginBottom: 20,
    position: 'relative',
    zIndex: theme.zIndex.base,
  },
  progress: {
    position: 'absolute',
    top: -5,
  },
  grid: {
    position: 'relative',
  },
  position: {
    color: theme.palette.text.secondary,
  },
  cursor: {
    cursor: 'pointer',
  },
});

const useSmallTypeStyles = makeStyles({
  avatar: {
    margin: 10,
    width: 40,
    height: 40,
    marginBottom: 20,
    position: 'relative',
    zIndex: theme.zIndex.base,
  },
  progress: {
    position: 'absolute',
    top: 0,
  },
  grid: {
    position: 'relative',
  },
  position: {
    color: theme.palette.text.secondary,
  },
});

const Avatar: React.FC<AvatarProps> = props => {
  const {
    name,
    position,
    progress,
    type = AvatarType.REGULAR,
    imgSrc,
    onClick,
  } = props;

  const classes = {
    regular: useRegularTypeStyles(),
    small: useSmallTypeStyles(),
  };

  const progressBarProps = {
    regular: {
      size: 90,
      thickness: 2,
    },
    small: {
      size: 60,
      thickness: 1,
    },
  };

  const avatarCursorStyle = onClick ? { cursor: 'pointer' } : undefined;
  const avatarImg = xss.sanitize(imgSrc || '') || avatarPlaceholder;

  return (
    <Grid container justify='center' alignItems='center' direction='column'>
      <Grid
        container
        justify='center'
        alignItems='center'
        direction='column'
        className={classes[type].grid}>
        <AvatarMaterialUI
          alt='Avatar'
          src={avatarImg}
          className={classes[type].avatar}
          onClick={onClick}
          style={avatarCursorStyle}
        />
        <CircularProgress
          variant='static'
          value={progress}
          className={classes[type].progress}
          {...progressBarProps[type]}
        />
        <Typography
          component='h4'
          variant={type === AvatarType.REGULAR ? 'subtitle1' : 'subtitle2'}>
          {progress !== undefined && progress !== null && `${progress}%`}
        </Typography>
      </Grid>
      {name && (
        <Typography
          align='center'
          component={'h4'}
          variant={type === AvatarType.REGULAR ? 'body1' : 'h5'}>
          <Box fontWeight={theme.typography.fontWeightBold}>{name}</Box>
        </Typography>
      )}
      {position && (
        <Typography
          className={classes[type].position}
          component='h4'
          variant={type === AvatarType.REGULAR ? 'subtitle1' : 'subtitle2'}>
          {position}
        </Typography>
      )}
    </Grid>
  );
};

export default Avatar;
