import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = ()=> {
  return async (dispatch, getState)=>{
    const userId = getState().auth.userId;
    const response = await fetch(
        `https://rn-app-eb341.firebaseio.com/orders/${userId}.json`
    );
    const resData = await response.json();
    const loadedOrders = [];
    for (const key in resData) {
      loadedOrders.push(new Order(key, 'u1', resData[key].cartItems, resData[key].totalAmount, new Date(resData[key].date)))
    }
    dispatch({type: SET_ORDERS, orders: loadedOrders})
  }
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState)=>{
    const date = new Date();
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(`https://rn-app-eb341.firebaseio.com/orders/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: date.toISOString()
      })
    });

    const resData = await response.json();

    dispatch({
    type: ADD_ORDER,
    orderData: {id:resData.name, items: cartItems, amount: totalAmount, date: date }
    })
  };
};
