import ApiProducts from "./api/products.js";
import ApiCart from "./api/cart.js";
import express from "express";

const apiProds = new ApiProducts()

const apiCart = new ApiCart()

const app = express()

const router = express.Router()

router.use(express.json());

router.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use('/api', router)

let admin = true


//FUNCIONALIDADES PRODUCTOS
// ----------------------------------------------|


//devuelve todos los productos
router.get('/products', (req, res) => {   
    
    res.json( apiProds.productsAll() )
    
})


// devuelve un producto según su id
router.get('/products/:id', (req, res) => {
    
    let { id } = req.params

    res.json( apiProds.prodById( id ) )

})

    
//recibe y agrega un producto, y lo devuelve con su id asignado. ( POR MEDIO DEL FORM ( "http://localhost:8080/" ) )
router.post('/products', (req, res) => {
    
    let newProd = req.body
    
    res.json( apiProds.saveProd( newProd ) )
    
})


//recibe y actualiza un producto según su id.
router.put('/products/:id', (req, res) => {

    let { id } = req.params

    let prod = req.body

    res.json( apiProds.updateProd( prod, id ) )

})


//elimina un producto según su id.
router.delete('/products/:id', (req, res) =>{
    
    let { id } = req.params
    
    res.json( apiProds.deleteProdById( id ) )

})


//FUNCIONALIDADES CARRITO
// ----------------------------------------------|

//Crea un carrito y devuelve su id.
router.post('/cart', (req, res) => {
        
    res.json( apiCart.createCart() )
    
})

//Vacía un carrito y lo elimina.
router.delete('/cart/:id', (req, res) =>{
    
    let { id } = req.params
    
    res.json( apiCart.deleteCart( id ) )

})

//Me permite listar todos los productos guardados en el carrito.
router.get('/cart/:id/products', (req, res) => {   
    
    let { id } = req.params

    res.json( apiCart.getProdOfCartById( id ) )
    
})

//Para incorporar productos al carrito por su id de producto
router.post('/cart/:id/products', (req, res) =>{
    
    let { id } = req.params
    
    res.json( apiCart.addProdToCart( id ) )

})

//Eliminar un producto del carrito por su id de carrito y de producto
router.delete('cart/:id/products/:id_prod', (req, res) =>{

    let { id } = req.params
    let { id_prod } = req.params

    res.json( apiCart.deleteProdFromCart( id, id_prod) )

})





//INICIAMOS EL SERVIDOR
// ----------------------------------------------|

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ server.address().port }` );
})

server.on( 'error', ( error ) => {
    console.log( `Error en servidor: ${error}` );
} )