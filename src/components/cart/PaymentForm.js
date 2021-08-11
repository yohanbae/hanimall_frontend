import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useElements, useStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useAuth } from '../../use-auth';
import {useHistory} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

const CARD_OPTIONS = {
	style: {
		base: {
			color: "black",
			fontWeight: 300,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "gray" }
		},
		invalid: {
			color: "red"
		}
	}
}

export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const auth = useAuth()
  const history = useHistory()

  const [msgError, setMsgError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const onSubmit = async() => {
    setProcessing(true)
    // Need to get Total
    let cartTotal = 0
    let description = []
    if(auth?.cart.length > 0) {
      auth.cart.forEach(v => {
          let subTotal = v.price * parseInt(v.qty)
          cartTotal += subTotal                
          description.push(v)
      })
    } else { return false }
    description = JSON.stringify(description)

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)
    })

    if(!error) {
      let customerId
      const checkUser = await axios.post(`${process.env.REACT_APP_BACKEND}/check`, {email: auth.user.email})
      if(checkUser.data.exist){
          customerId = checkUser.data.id
      } else {
        const name = auth.userMore.firstname + " " + auth.userMore.lastname
        const createUser = await axios.post(`${process.env.REACT_APP_BACKEND}/create`, {name, email: auth.user.email, description: description})
        if(createUser.data.success) {
            customerId = createUser.data.id
        } else {
            console.log("network error")
            setProcessing(false)
            return false
        }
      }      

      try {
          const {id} = paymentMethod
          const response = await axios.post(`${process.env.REACT_APP_BACKEND}/payment`, {
              amount: cartTotal * 100,
              id,
              customerId: customerId,
              description
          })

          if(response.data.success) {
              console.log("Successful payment")
              auth.completeOrder()
              alert("Order Completed. You can check order history at dashboard.")
              history.push('/')
          }

      } catch (error) {
          setMsgError(error.message)
          setProcessing(false)
      }
    } else {
      setMsgError(error.message)
      setProcessing(false)
    }
  }

  return (
    <>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <div style={{border:'1px solid lightgray', padding:'15px', borderRadius:'5px'}}>
            Card number 
            <CardNumberElement options={CARD_OPTIONS} />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{border:'1px solid lightgray', padding:'15px', borderRadius:'5px'}}>
            Expiracy date 
            <CardExpiryElement options={CARD_OPTIONS} />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{border:'1px solid lightgray', padding:'15px', borderRadius:'5px'}}>
            <CardCvcElement options={CARD_OPTIONS} />
          </div>
        </Grid>
      </Grid>
      <Box marginTop="50px" textAlign="center">
        <Box fontSize="12px" marginBottom="20px" marginTop="10px">Test card number is '4242 4242 4242 4242'</Box>
        <Button fullWidth onClick={()=>onSubmit()} variant="contained" color="primary" disabled={processing}>
          { processing ? <CircularProgress size={20} /> : 'Place order' }
        </Button>      
        <Box fontSize="12px" color="red" marginTop="10px">{msgError}</Box>
      </Box>

    </>
  );
}