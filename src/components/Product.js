import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {Formik, Form, useFormik} from 'formik'
import { useAuth } from "../use-auth";
import * as yup from 'yup';

const Product = () => {
    const {id} = useParams()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const auth = useAuth()
    const history = useHistory()
    
    const validationSchema = yup.object({
        qty: yup
            .number('Number')
          .required('!!'),
      });

    const formik = useFormik({
        initialValues: {
          qty: 1,
        },
        validationSchema: validationSchema,
        onSubmit: async(values) => {
            if(!auth.user) {
                alert('Please login first')
                history.push('/login')
                return false
            } else {
                if(auth.cart.find(v => v.id === data.id)) {
                    console.log('Item already in the cart')
                } else {
                    auth.addCart(data, values.qty)
                }
            }
        },
    });


    useEffect(() => {
        let isSubscribed = true

        const getProduct = async() => {
            const result = await axios(`https://fakestoreapi.com/products/${id}`)
            if (isSubscribed) {
                setData(result.data)
                setIsLoading(false)
            }
        }        
        getProduct()
        return () => isSubscribed = false
    }, [id])

    return (
        <>
        {
            isLoading ?
            <div className="loading-wrap"><CircularProgress /></div>
            :
            <div className="item-wrap">
                <Box textAlign="center">
                    <img alt="" src={`${data.image}`} height="400px" style={{objectFit:'contain'}} />
                </Box>
                <div>
                    <Box>{data.category}</Box>
                    <Box mt={2} fontSize="20px">{data.title}</Box>
                    <Box mt={2} fontSize="15px">{data.description}</Box>
                    <Box mt={3} mb={2} fontSize="24px">${data.price}</Box>
                    <Formik>
                    <Form onSubmit={formik.handleSubmit}>
                        <label style={{fontSize:'14px', marginRight:'10px'}} htmlFor="qty">QTY</label>
                        <TextField className="qty-input" id="qty" name="qty" type="text" placeholder="QTY" height="30px"
                            required
                            value={formik.values.qty}
                            onChange={formik.handleChange}
                            error={formik.touched.qty && Boolean(formik.errors.qty)}
                            helperText={formik.touched.qty && formik.errors.qty}                                                
                        />
                        <Button variant="outlined" size="small" type="submit" style={{marginLeft:'20px'}}>ADD CART</Button>
                    </Form>
                    </Formik>
                </div>
            </div>
        }

        </>
    )
}
export default Product