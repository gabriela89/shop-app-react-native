import React, {useEffect} from 'react';
import {FlatList, Text, Platform, View} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders'

const OrdersScreen = props => {
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(()=>{
        dispatch(ordersActions.fetchOrders());
  }, [dispatch]);

  if(orders.length === 0){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>No orders found, start ordering some products!</Text>
            </View>
        )
    }
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

export default OrdersScreen;
