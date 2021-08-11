import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
  };

firebase.initializeApp(firebaseConfig);

const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [userMore, setUserMore] = useState(null);

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0)
 
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.

  const checkUser = () => {
    let theuser = localStorage.getItem('user')
    return theuser && theuser.length ===28 ? true : false
  }

  const addCart = (item, qty) => {
    const itemRow = {
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: qty
    }
    setCart([...cart, itemRow])
    setTotal(parseInt(total) + parseInt(qty))
  }

  const deleteCart = (id, qty) => {
    const meme = cart.filter(v => v.id !== id)
    setCart(meme)
    setTotal(parseInt(total) - parseInt(qty))
  }
  const completeOrder = () => {
    setCart([])
    setTotal(0)
  }

  const signin = async(email, password) => {
    // return firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then((response) => {
    //     setUser(response.user);
    //     return response.user;
    //   });
    let theuser = await firebase.auth().signInWithEmailAndPassword(email, password)
    if(theuser) {
        setUser(theuser.user)
        const db = firebase.firestore()
        const userRef = db.collection('users').doc(theuser.user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
          console.log("Something wrong")
        } else {
          let data = doc.data()
          setUserMore(data)
          localStorage.setItem('user', theuser.user.uid)
        }
        return theuser.user;      
    }

  };
  const signup = async(email, password, firstname, lastname) => {
    // return firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((response) => {
    //     setUser(response.user);
    //     return response.user;
    //   });
    let meme = await firebase.auth().createUserWithEmailAndPassword(email, password)
    if(meme) {
      const db = firebase.firestore()
      const userRef = db.collection('users').doc(meme.user.uid);
      const newData = {
        firstname,
        lastname,
        stripe_id: null,
        uid: meme.user.uid
      }
      const res = await userRef.set(newData);
      localStorage.setItem('user', meme.user.uid)
      if(res) {
        console.log(meme.user.uid)
        setUser(meme.user)
        setUserMore(newData)
        return meme.user
      } else {
        return false
      }

    }
  };
  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
        localStorage.removeItem('user')
      });
  };
  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };
  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const getUserMore = async() => {
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          const doc = await userRef.get();
          let data = doc.data()
          setUserMore(data)
        }
        getUserMore()
      } else {
        setUser(false);
        setUserMore(false)
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  // Return the user object and auth methods
  return {
    user,
    userMore,
    cart,
    total,
    addCart,
    deleteCart,
    completeOrder,
    signin,
    signup,
    signout,
    checkUser,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}