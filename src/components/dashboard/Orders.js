import React,{useEffect, useState} from 'react';
// import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { useAuth } from '../../use-auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom'

// Generate Order Data

const Orders = () => {
  const auth = useAuth()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      let isSubscribed = true
      const fetch = async(email) => {
        let result = await axios.post(`${process.env.REACT_APP_BACKEND}/get_payments`, {email: email})     
        if(isSubscribed) {
          let final = []
          result.data.forEach(v => {
            if(v.description && v.description.length > 20) {
              let meme = JSON.parse(v.description)
              final = [...final, ...meme]
            }
          })
          setData(final)
          setIsLoading(false)
        }
      }
      if(auth.user) fetch(auth.user.email)
      return () => isSubscribed = false
    }, [auth])


    return(
        <>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Orders
        </Typography>


        {
          isLoading ? <div style={{width:'100%', textAlign:'center'}}><CircularProgress size={20} /></div> :
        
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">QTY</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
            data?.map((row, i) => (
              <TableRow key={i}>
                <TableCell><Link to={`/product/${row.id}`}>{row.title}</Link></TableCell>
                <TableCell align="right">${row.price}</TableCell>
                <TableCell align="right">{row.qty}</TableCell>
                <TableCell align="right">${row.qty * row.price}</TableCell>
                {/* <TableCell>{row.paymentMethod}</TableCell> */}
                {/* <TableCell align="right">{row.amount}</TableCell> */}
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
        }
        {/* <div className={classes.seeMore}>
          <Link color="primary" href="#" onClick={preventDefault}>
            See more orders
          </Link>
        </div> */}
      </>
    )
}

export default Orders