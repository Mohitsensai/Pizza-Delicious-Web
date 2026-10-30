import logo from './logoimg.png'
import app_store from './app_store.png'
import play_store from './play_store.png'

import menu1 from './menu1.png'
import menu2 from './menu2.png'
import menu3 from './menu3.png'
import menu4 from './menu4.png'
import menu5 from './menu5.png'
import menu6 from './menu6.png'

import food1 from './food1_veg-pizza.png'
import food2 from './food2_nonveg.png'
import food3 from './food3_marg.png'
import food4 from './food4_farmhouse.png'
import food5 from './food5_peppypaneer.png'
import food6 from './food6_pizzamania.png'
import food7 from './food7_customized.png'

import rating_starts from './rating_starts.png'
import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import add_icon from './add_icon.png'
import add_to_cart2 from './add_to_cart2.png'
import Login from './Login.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import logo_search from './logo_search.png'
import facebook_icon from './facebook_icon.png'
import instagram_icon from './instagram_icon.gif'
import twitter_icon from './twitter_icon.png'
import linkedin_icon from './linkedin_icon.png'

export const assets = {
    rating_starts,
    add_icon_white,
    add_icon_green,
    remove_icon_red,
    logo,
    app_store,
    play_store,
    add_icon,
    add_to_cart2,
    food1,
    food2,
    food3,
    food4,
    food5,
    food6,
    food7,
    Login,
    bag_icon,
    logout_icon,
    parcel_icon,
    logo_search,
    facebook_icon,
    instagram_icon,
    twitter_icon,
    linkedin_icon
}

export const menu_list = [
    {
        menu_name: "Veg-Pizza",
        menu_image: menu1
    },
    {
        menu_name: "Non-Veg Pizza",
        menu_image: menu2
    },
    {
        menu_name: "Volcano Pizza",
        menu_image: menu3
    },
    {
        menu_name: "Chicken Burst",
        menu_image: menu4
    },
    {
        menu_name: "cheesy",
        menu_image: menu5
    },
    {
        menu_name: "Combo Feast",
        menu_image: menu6
    }
]

export const pizzas = [
    {
        _id: "pz001",
        name: "Custom Veg Pizza",
        description: "Fresh garden vegetables with your choice of crust, sauce, and cheese.",
        bases: {
            name: ["Thin Crust", "Thick Crust", "Cheese Burst", "Whole Wheat", "Stuffed Crust"],
            price: [50, 60, 80, 70, 90],
        },
        sauces: {
            name: ["Classic Tomato", "Spicy Red Chili", "Pesto Sauce", "Garlic White Sauce", "Barbecue Sauce"],
            price: [20, 25, 30, 25, 30],
        },
        cheeses: {
            name: ["Mozzarella", "Cheddar", "Parmesan"],
            price: [40, 50, 60],
        },
        veggies: {
            name: ["Olives", "Onions", "Mushrooms"],
            price: [15, 10, 20],
        }
    },
    {
        _id: "pz002",
        name: "Custom Non-Veg Pizza",
        description: "Delicious meat toppings with customizable base and savory sauces.",
        bases: {
            name: ["Thin Crust", "Cheese Burst"],
            price: [50, 80],
        },
        sauces: {
            name: ["Barbecue Sauce", "Garlic White Sauce"],
            price: [30, 25],
        },
        cheeses: {
            name: ["Mozzarella", "Cheddar"],
            price: [40, 50],
        },
        veggies: {
            name: ["Onions", "Capsicum"],
            price: [10, 12],
        }
    },
    {
        _id: "pz003",
        name: "Custom Margherita",
        description: "Classic Italian style custom crafted to your perfection.",
        bases: {
            name: ["Whole Wheat", "Thick Crust"],
            price: [70, 60],
        },
        sauces: {
            name: ["Pesto Sauce", "Classic Tomato"],
            price: [30, 20],
        },
        cheeses: {
            name: ["Parmesan", "Mozzarella"],
            price: [60, 40],
        },
        veggies: {
            name: ["Corn", "Paneer"],
            price: [15, 25],
        }
    },
    {
        _id: "pz004",
        name: "Custom Farmhouse",
        description: "Loaded with earthy mushrooms, veggies, and rich cheese.",
        bases: {
            name: ["Stuffed Crust", "Cheese Burst"],
            price: [90, 80],
        },
        sauces: {
            name: ["Spicy Red Chili", "Classic Tomato"],
            price: [25, 20],
        },
        cheeses: {
            name: ["Cheddar", "Mozzarella"],
            price: [50, 40],
        },
        veggies: {
            name: ["Jalapeno", "Mushrooms"],
            price: [20, 20],
        }
    },
    {
        _id: "pz005",
        name: "Custom Gourmet Pizza",
        description: "Crispy crust infused with garlic sauce and gourmet toppings.",
        bases: {
            name: ["Thin Crust"],
            price: [50],
        },
        sauces: {
            name: ["Garlic White Sauce"],
            price: [25],
        },
        cheeses: {
            name: ["Parmesan"],
            price: [60],
        },
        veggies: {
            name: ["Olives", "Spinach"],
            price: [15, 18],
        }
    }
];

export const food_list = [
    {
        _id: "1",
        name: "Veg Pizza",
        image: food1,
        price: 149,
        description: "Veg pizza is a delightful combination of fresh vegetables layered over a crispy crust.",
        category: "Veg-Pizza"
    },
    {
        _id: "2",
        name: "Non Veg",
        image: food2,
        price: 270,
        description: "The base starts with freshly kneaded dough, hand-stretched and baked to a golden crust.",
        category: "Non-Veg Pizza"
    },
    {
        _id: "3",
        name: "Margherita",
        image: food3,
        price: 169,
        description: "A thin layer of vibrant tomato sauce is spread evenly on the crust.",
        category: "Volcano Pizza"
    },
    {
        _id: "4",
        name: "Farmhouse",
        image: food4,
        price: 170,
        description: "Generous amounts of mozzarella cheese melt into a creamy, golden layer.",
        category: "Volcano Pizza"
    },
    {
        _id: "5",
        name: "Peppy Paneer",
        image: food5,
        price: 185,
        description: "Peppy Paneer Pizza is a fusion favorite, blending Indian flavors with the classic Italian pizza.",
        category: "Combo Feast"
    },
    {
        _id: "6",
        name: "Pizza Mania",
        image: food6,
        price: 220,
        description: "Smooth, melted mozzarella cheese covers the entire surface, adding creaminess.",
        category: "Combo Feast"
    }
];

export const custom = [
    {
        _id: "7",
        name: 'Customize Your Pizza',
        image: food7,
    }
];

export const pizzaData = {
    _id: ["1", "2", "3", "4", "5"],
    image: [food1, food2, food3, food4, food5],
    bases: [
        { name: "Thin Crust", price: 50 },
        { name: "Thick Crust", price: 60 },
        { name: "Cheese Burst", price: 80 },
        { name: "Whole Wheat", price: 70 },
        { name: "Stuffed Crust", price: 90 }
    ],
    sauces: [
        { name: "Classic Tomato", price: 20 },
        { name: "Spicy Red Chili", price: 25 },
        { name: "Pesto Sauce", price: 30 },
        { name: "Garlic White Sauce", price: 25 },
        { name: "Barbecue Sauce", price: 30 }
    ],
    cheeses: [
        { name: "Mozzarella", price: 40 },
        { name: "Cheddar", price: 50 },
        { name: "Parmesan", price: 60 },
    ],
    veggies: [
        { name: "Olives", price: 15 },
        { name: "Onions", price: 10 },
        { name: "Mushrooms", price: 20 },
    ]
};
