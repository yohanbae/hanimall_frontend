import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const ProductList = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isSubscribed = true

        const getProduct = async() => {
            const result = await axios('https://fakestoreapi.com/products')
            if (isSubscribed) {
                setData(result.data)
                setIsLoading(false)
            }
        }        
        getProduct()
        return () => isSubscribed = false
    }, [data])

    return(
        <Box paddingX={3} paddingY={5}>
        <div className="product-wrap">
            {
                isLoading ? 
                <div style={{textAlign:'center', width:'100vw'}}>
                    <CircularProgress />
                </div>
                :
                data?.map(item => (
                    <div key={item.id} className="product">
                        <Link style={{color:'black', textDecoration:"none"}} to={`/product/${item.id}`}>
                            <img alt="" width="80%" height="150px" style={{objectFit:'contain'}} src={item.image} />
                            <Box mt={4}>{item.title}</Box>
                            <Box mt={2}>${item.price}</Box>
                        </Link>
                    </div>
                ))
            }
        </div>
        </Box>
    )


}

export default ProductList