import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useAuth } from '../../use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const Cart = () => {
    const classes = useStyles();
    const auth = useAuth()
    const history = useHistory()

    useEffect(() => {
        if(auth.checkUser()) {
          //do nothing
        } else {      
          history.push('/')
        }
      }, [auth,history])  


    const [total, setTotal] = useState(0)
    useEffect(() => {
        if(auth?.cart.length > 0) {
            let cartTotal = 0
            auth.cart.forEach(v => {
                let subTotal = v.price * parseInt(v.qty)
                cartTotal += subTotal                
            })
            setTotal(cartTotal)
        }

    }, [auth])

    const onDelete = (id, qty, price) => {
        auth.deleteCart(id, qty)
        let subTotal = qty * price
        setTotal(total - subTotal)
    }

    return(
        <div style={{padding:'20px 40px'}}>
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>ITEM</TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right">PRICE</TableCell>
                    <TableCell align="right">QTY</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">TOTAL</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        auth?.cart.length > 0 ?
                        auth.cart.map(data => (
                        <TableRow key={data.id}>
                            <TableCell component="th" scope="row">
                                {data.title}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <img alt="" width="100px" height="100px" src={data.image} />
                            </TableCell>                        
                            <TableCell align="right">${data.price}</TableCell>
                            <TableCell align="right">{data.qty}</TableCell>
                            <TableCell align="right">
                                <Button onClick={()=>onDelete(data.id, data.qty, data.price)}>delete</Button>
                            </TableCell>                               
                            <TableCell align="right">${data.price * data.qty}</TableCell>
                        </TableRow>
                        ))
                    : 
                    <TableRow>
                        <TableCell>No Item</TableCell>
                        </TableRow>
                    }


                    <TableRow>
                        <TableCell component="th" scope="row" >TOTAL</TableCell>
                        <TableCell component="th" scope="row" align="left"></TableCell>                        
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>

                        <TableCell align="right">${total}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            <div style={{textAlign:'right', marginTop:'20px'}}>
                {
                    total > 0 ?
                    <Link to="/checkout" style={{textDecoration:'underline'}}>Proceed to checkout</Link>
                    : <Link to="/" style={{textDecoration:'underline'}}>Please add items first</Link>
                }
            </div>

        </div>
    )
}
export default Cart