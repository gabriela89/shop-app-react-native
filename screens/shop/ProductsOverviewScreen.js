import React, {useState,useEffect, useCallback} from 'react';
import {FlatList, Button, Platform, ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products'
import Colors from '../../constants/Colors';
import ShoppingCartIcon from '../../containers/ShoppingCartIcon'
import { Ionicons } from '@expo/vector-icons';



const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async ()=> {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(productsActions.fetchProducts());

        }catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);


    useEffect(()=>{
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts)
        return()=>{
            willFocusSub.remove();
        }
    }, [loadProducts]);

    useEffect(()=>{
        loadProducts()
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    }
    if(!isLoading && products.length === 0){
        return (
            <View>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh = {loadProducts}
            refreshing={isLoading}
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title="View Details"
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    />
                    <Ionicons
                        title="To Cart"
                        name='ios-add-circle'
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                        size={30}
                    />
                    <Ionicons
                        title="To Cart"
                        name='ios-remove-circle'
                        onPress={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.id));
                        }}
                        size={30}
                    />
                </ProductItem>
            )}
        />
    );
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
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
        ),
        headerRight: (
            <ShoppingCartIcon/>
        )
    };
};
const styles = StyleSheet.create({
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;
