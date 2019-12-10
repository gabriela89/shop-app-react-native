import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform
} from "react-native";

import {withNavigation} from 'react-navigation'

import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

const ShoppingCartIcon = (props) => {

    if (typeof (props.cartItems) === 'undefined') {
        console.log('wrong')
    } else {
        const objectValues = Object.values(props.cartItems);
        const elem = objectValues.map(function (objectValue) {
            const quantity = [objectValue.quantity];
            var merged = [].concat(...quantity);
            var count = 0;
            merged.forEach((x) => {
                count += x;
            });
             return count
        });
        var sum = elem.reduce(function(a, b){
            return a + b;
        }, 0);
        return (
            <View style={[{padding: 5}, Platform.OS == 'android' ? styles.iconContainer : null]}>
                <View style={{
                    position: 'absolute',
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: 'rgba(255,193,7,0.8)',
                    right: 15,
                    bottom: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,

                }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{sum}</Text>
                </View>
                <Icon onPress={() => props.navigation.navigate('Cart')} name="ios-cart" size={30}/>
            </View>
        )
    }


};

const mapStateToProps = (state) => {
    const obj = state.cart.items;
    return {
        cartItems: obj
    }
};

export default connect(mapStateToProps)(withNavigation(ShoppingCartIcon));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        paddingLeft: 20, paddingTop: 10, marginRight: 5
    }
});
