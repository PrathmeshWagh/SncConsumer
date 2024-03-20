import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Appbar from '../../components/Appbar';
import Colors from '../style/colors';
import { Searchbar } from 'react-native-paper';
import { getMethod } from '../../utils/helper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);

    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            // Fetch all products when search query is empty
            fetchData('products');
        } else {
            // Fetch products based on search query
            fetchData(`search-product?search=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery]);

    const fetchData = async (endpoint: string) => {
        try {
            const api: any = await getMethod(endpoint);
            if (api.status === 200) {
                setProducts(api.data.data);
            } else {
                console.log('API Error:', api.data.message);
            }
        } catch (e) {
            console.log('Error while fetching:', e);
        }
    };
    return (
        <View style={styles.container}>
            < Appbar />
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.search}
            />


            <View style={styles.imageContainer_1} >
                {
                    products.map(item => (
                        <View style={styles.box} key={item.id}>
                            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails',
                                {
                                    productId: item.id,
                                    categoryId: item.category_id
                                }
                                // {categoryId: item.category_id}
                            )}>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.thumbnail_img }} style={styles.img_8} />
                                </View>
                                <View style={styles.price}>
                                    <Text style={styles.cost}>{item.main_price} </Text>
                                    <View style={styles.item}>
                                        <Text style={styles.item_1}> {item.new_num_of_sale} </Text>
                                        <Text style={styles.item_2}>Sold</Text>
                                    </View>
                                </View>
                                <Text style={styles.title}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    search: {
        backgroundColor: '#E3E3E3',
        margin: 24,
        borderRadius: 8,
    },
    price: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: windowHeight * 0.01,
        width: windowWidth * 0.4,
    },
    title: {
        fontFamily: 'Poppins_Bold',
        fontSize: 15,
        fontWeight: '800',
        color: 'black',
        lineHeight: 20,
        // backgroundColor:'red',
        width: 225,
    },
    item_1: {
        color: 'red',
        fontFamily: "Poppins-Bold",
        marginTop: 3,
        fontSize: windowWidth * 0.025
        // backgroundColor:'plum',
    },
    img_8: {
        width: windowWidth * 0.42,
        height: windowWidth * 0.32,
        marginLeft: 5,
        borderRadius: 6,
      },
    item_2: {
        color: 'black',
        fontFamily: "Poppins",
        fontSize: windowWidth * 0.025
    },

    cost: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: windowWidth * 0.03,
        // lineHeight: 20,
        fontWeight: '700',
        /* identical to box height */
        color: 'black',
    },

    item: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: -5,
    },
    box: {
        width: '48%',
        height: windowWidth * 0.55,
    },
    imageContainer_1: {
        width: '100%',
        zIndex: -5,
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 12,
        flex: 1,
    },
    imageContainer: {
        width: windowWidth * 0.43,
        height: windowWidth * 0.33,
        backgroundColor: '#FEFBF6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#D9D9D9',
        borderWidth: 2,
        paddingRight: 5,
        zIndex: -5,

    },
});

export default SearchScreen;