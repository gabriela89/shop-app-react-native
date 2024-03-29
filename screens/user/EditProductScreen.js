import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';
import Input from '../../components/UI/Input';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }
    return state;
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''

        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    // const [titleIsValid, setTitleIsValid] = useState(false);
    // const [imageUrl, setImageUrl] = useState(
    //     editedProduct ? editedProduct.imageUrl : ''
    // );
    // const [price, setPrice] = useState('');
    // const [description, setDescription] = useState(
    //     editedProduct ? editedProduct.description : ''
    // );

    useEffect(()=>{
        if(error){
            Alert.alert('An error occured!', error, [{text: 'Okay'}])
        }
    },[error]);

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input', "Please check the errors in the form.", [{text: 'Okay'}]);
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl)
                );
            } else {
                await dispatch(
                    productsActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price)
                );
            }
        } catch (err) {
            setError(err.message)
        }

        setIsLoading(false);
        props.navigation.goBack();
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({submit: submitHandler});
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboradVerticlaOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='title'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect={false}
                        returnKeyType='next'
                        errorText='Please enter a valid title!'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='imageUrl'
                        keyboardType='default'
                        returnKeyType='next'
                        errorText='Please enter a valid image url!'
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        onInputChange={inputChangeHandler}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                        <Input
                            id='price'
                            label='Price'
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            errorText='Please enter a valid price!'
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        id='description'
                        label='Description'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect={false}
                        multiline
                        numberOfLines={3}
                        errorText='Please enter a valid description!'
                        initialValue={editedProduct ? editedProduct.description : ''}
                        onInputChange={inputChangeHandler}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={
                        Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
                    }
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;
