import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Typography from '@material-ui/core/Typography';
import { Link, useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import Badge from '@material-ui/core/Badge';
import { useAuth } from '../use-auth';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '0 40px'
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { title } = props;
  const history = useHistory()
  const auth = useAuth()

  const [keyword, setKeyword] = useState("")
  const handleKeyword = e => setKeyword(e.target.value)
  const onKeyword = (e) => {
    if(e.keyCode === 13) {
      history.push(`/search/${keyword}`)
    }
  }

  const onSearchEnter = () => {
    if(keyword !== "") history.push(`/search/${keyword}`)
  }

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          className={classes.toolbarTitle}
        >
          <Link style={{color:'black', textDecoration:"none"}} to={`/`}>{title}</Link>
        </Typography>

                <input className="search-input" name="qty" type="text" onChange={handleKeyword} value={keyword} onKeyDown={onKeyword} placeholder="search" height="30px" />
                <IconButton onClick={()=>onSearchEnter()}>
                    <SearchIcon />
                </IconButton>

        <IconButton onClick={()=>history.push('/cart')} style={{marginRight:'10px'}}>
            <Badge badgeContent={ auth?.total > 0 ? auth?.total : null} color="secondary">
                <ShoppingCartIcon />
            </Badge>            
        </IconButton>
        { auth?.user ? null : <Button variant="outlined" size="small" onClick={()=>history.push('/login')}>Sign in</Button> }

        { auth.user ?
          <>
          <Button variant="outlined" size="small" onClick={()=>history.push('/dashboard')} style={{marginRight:'10px'}}>
            Dashboard
          </Button>      
          <Button variant="outlined" size="small" onClick={()=>auth.signout()}>Sign out</Button>
          </>
        : null }        
      </Toolbar>
      {
        auth?.user ? auth?.user.email === 'mock_customer@gmail.com' ?
        <Box style={{padding:'10px 40px', fontSize:'12px', background:'lightblue'}}>
        You are automatically logged In as 'mock_customer'
        </Box> : null : null
      }
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};