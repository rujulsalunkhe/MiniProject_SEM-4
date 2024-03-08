const product = [
    {
        id: 0,
        image: 'image1',
        title: 'Boho foldable laptop table',
        price: 1200,
    },
    {
        id: 1,
        image: 'image2',
        title: 'Boho foldable laptop chair',
        price: 12000,
    },
    {
        id: 2,
        image: 'image3',
        title: 'laptop tstand',
        price: 999,
    },

];
const categories = [...new Set(product.map((item) => { return item }))]
let i = 0;
document.getElementById('root').innerHTML = categories.map((item) => {
    var { image, title, price } = item;
    return (
        <div class='box'>
            <div class='img-box'>
                <img class='images' src= $ {Image}></img>
            </div>
            <div class='bottom'>
                <p>${title}</p>
                <h2>$ ${price}.00</h2>+
                "<button onclick='addtocart("+(i++)+")'>Add to cart</button>"+
            </div>
        </div>
    )
}).join('')