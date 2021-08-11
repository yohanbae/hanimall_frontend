
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Product from "./components/Product"
import ProductList from './components/ProductList';
import Search from "./components/Search"

import Header from './components/Header'
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import Forgot from "./components/auth/Forgot";
import Dashboard from './components/dashboard/Dashboard'
import Cart from "./components/cart/Cart";
import Checkout from "./components/cart/Checkout";
import { useAuth } from "./use-auth";
import {useEffect, useState} from 'react'

const Routes = () => {
    const sections = [
        { title: 'Technology', url: '#' },
        { title: 'Design', url: '#' },
        { title: 'Culture', url: '#' },
      ];  

    const [isLogin, setIsLogin] = useState(false)
    const auth = useAuth()
    useEffect(() => {
        if(!isLogin) {
            // localStorage.removeItem('user')
            // console.log("Removed")
            auth.signin('mock_customer@gmail.com', 'password')            
            setIsLogin(true)
        }
    }, [auth, isLogin])

    return(
    <Router>
        <Switch>
        <Route path="/dashboard">
            <Dashboard />
        </Route>                        
        <Route path="/dashboard/:category">
            <Dashboard />
        </Route>            
        <Route path="/search/:keyword">
            <Header title="Hanimall" sections={sections} />
            <Search />
        </Route>            
        <Route path="/cart">
            <Header title="Hanimall" sections={sections} />
            <Cart />
        </Route>
        <Route path="/checkout">
            <Header title="Hanimall" sections={sections} />
            <Checkout />
        </Route>        
        <Route path="/login">
            <Header title="Hanimall" sections={sections} />
            <Login />
        </Route>                    
        <Route path="/signup">
            <Header title="Hanimall" sections={sections} />
            <SignUp />
        </Route>                    
        <Route path="/forgot">
            <Header title="Hanimall" sections={sections} />
            <Forgot />
        </Route>                    
        <Route path="/product/:id">
            <Header title="Hanimall" sections={sections} />
            <Product />
        </Route>          
        <Route path="/">
            <Header title="Hanimall" sections={sections} />
            <ProductList />
        </Route>

        </Switch>
    </Router>
    )
}

export default Routes