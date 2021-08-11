import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Link, useParams } from 'react-router-dom';

const Search = () => {
    const [data, setData] = useState([])
    const {keyword} = useParams()
    
    useEffect(() => {
        let isSubscribed = true

        const getProduct = async() => {
            const result = await axios('https://fakestoreapi.com/products')
            if (isSubscribed) {
                const filtered = result.data.filter(v => v.title.toLowerCase().includes(keyword.toLowerCase()))
                setData(filtered)
            }
        }        
        getProduct()
        return () => isSubscribed = false
    }, [keyword])

    return(
        <Box paddingX={3} paddingY={5}>
        <div className="product-wrap">
            {
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

export default Search