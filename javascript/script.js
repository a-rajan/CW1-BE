
<script>
    let app = new Vue({
        el: '#app', // LESSON DATA FOR APP STRUCTURE
    data: {
        sitename: 'EHelp', // WEBAPP NAME
    newProduct: '', // CODE FOR ADDING A NEW PRODUCT/SEARCH
    cart: [], // SHOPPING CART ARRAY
    lessons: [ // AVAILABLE LESSONS
    {id: 1, subject: 'English', location: 'room G04', price: 10, spaces: 5, image: '../images/english.svg' }, // lessons + room + price + spaces + image
    {id: 2, subject: 'Math', location: 'room G05', price: 10, spaces: 5, image: '../images/maths.svg' }, // resize images to 100x100px
    {id: 3, subject: 'Science', location: 'room G09', price: 15, spaces: 3, image: '../images/science.svg' }, // image added
    {id: 4, subject: 'IT', location: 'room G08', price: 20, spaces: 8, image: '../images/it.svg' }, // image added
    {id: 5, subject: 'History', location: 'room G10', price: 15, spaces: 8, image: '../images/history.svg' }, // image added
    {id: 6, subject: 'Geography', location: 'room G11', price: 12, spaces: 6, image: '../images/geography.svg' }, // add image for geography-french
    {id: 7, subject: 'Art', location: 'room G12', price: 18, spaces: 4, image: '../images/art.svg' },
    {id: 8, subject: 'Chinese', location: 'room G13', price: 10, spaces: 10, image: '../images/Chinese.svg' },
    {id: 9, subject: 'Music', location: 'room G14', price: 20, spaces: 5, image: '../images/music.svg' },
    {id: 10, subject: 'Law', location: 'room G15', price: 15, spaces: 7, image: '../images/Law.svg' }
    ]
    },// add more lessons as needed
    //1-10 lessons added. images to be added further down
    methods: {
        addProduct: function () {
            if (this.newProduct.trim() !== '') { // check if new product input is not empty
        this.cart.push({ subject: this.newProduct }); // add new product to cart
    this.newProduct = ''; // clear input field
            } else {
        alert("please enter a product name."); // alert if input is empty
            }
        },

    addToCart: function (lesson) {
        let cartItem = this.cart.find(item => item.id === lesson.id);
    if (cartItem) {
        cartItem.quantity++;
            } else {
        this.cart.push({ ...lesson, quantity: 1 }); // made changes to stack multieple quantities of an item instead of making cart length longer.
            } // add lesson to cart
    lesson.spaces--; // delete available spaces
        },
    removeProduct: function (index) { // PLEASE MAKE SURE THIS IS STILL WITHIN METHODS
        this.cart.splice(index, 1); // remove product from cart by index - also removes quantity
            // !IMPORTANT! do not get "SPLICE" and "SLICE" mixed up. "SPLICE" is for adding/removing array items (adding lessons etc.), "SLICE" is for copying array items (displaying lessons etc.)
        }
    }
);
</script>