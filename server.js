import ApiProducts from "./api/products.js";
import ApiCart from "./api/cart.js";
import express from "express";

const apiProds = new ApiProducts()

const apiCart = new ApiCart()

const app = express()

const router = express.Router()

router.use(express.json());

router.use(express.urlencoded({extended: true}));

app.use('/api', router)

//VARIABLE BOOLEANA PARA EL ADMIN
let admin = true


//FUNCIONALIDADES PRODUCTOS
// ----------------------------------------------|


//devuelve todos los productos
router.get('/products', (req, res) => {   

    admin ? res.json( apiProds.productsAll() ) : res.json( {error : -1, description: "ruta 'api/products' método 'GET' no autorizada"} )
    
})


// devuelve un producto según su id
router.get('/products/:id', (req, res) => {
    
    if(admin) {
        
        let { id } = req.params
    
        res.json( apiProds.prodById( id ) )

    }else {

        res.json( {error : -1, description: "ruta '/api/products' método 'GET' no autorizada"} )

    }

})

    
//recibe y agrega un producto, y lo devuelve con su id asignado. ( POR MEDIO DEL FORM ( "http://localhost:8080/" ) )
router.post('/products', (req, res) => {
    
    if(admin) {

        let newProd = req.body
        
        res.json( apiProds.saveProd( newProd ) )

    }else {

        res.json( {error : -1, description: "ruta '/api/products' método 'POST' no autorizada"} )

    }
    
})


//recibe y actualiza un producto según su id.
router.put('/products/:id', (req, res) => {

    if(admin){

        let { id } = req.params
    
        let prod = req.body
    
        res.json( apiProds.updateProd( prod, id ) )

    }else {

        res.json( {error : -1, description: "ruta '/api/products' método 'PUT' no autorizada"} )

    }

})


//elimina un producto según su id.
router.delete('/products/:id', (req, res) => {
    
    if(admin){

        let { id } = req.params
        
        res.json( apiProds.deleteProdById( id ) )

    }else {

        res.json( {error : -1, description: "ruta '/api/products' método 'DELETE' no autorizada"} )

    }

})


//FUNCIONALIDADES CARRITO
// ----------------------------------------------|

//Crea un carrito y devuelve su id.
router.post('/cart', (req, res) => {
        
    res.json( apiCart.createCart() )
    
})


//Vacía un carrito y lo elimina.
router.delete('/cart/:id', (req, res) => {
    
    let { id } = req.params
    
    res.json( apiCart.deleteCart( id ) )

})


//Me permite listar todos los productos que tiene el carrito con dicho id.
router.get('/cart/:id/products', (req, res) => {   
    
    let { id } = req.params

    res.json( apiCart.getProdOfCartById( id ) )
    
})


//Para incorporar productos al carrito.
router.post('/cart/:id_cart/products/:id_prod', (req, res) => {
    
    let { id_cart } = req.params
    let { id_prod } = req.params
    
    res.json( apiCart.addProdToCart( id_cart, id_prod) )

})


//Eliminar un producto del carrito por su id de carrito y de producto.
router.delete('/cart/:id/products/:id_prod', (req, res) => {

    let { id } = req.params
    let { id_prod } = req.params

    res.json( apiCart.deleteProdFromCart( id, id_prod) )

})


//En el caso de requerir una ruta no implementada en el servidor:
app.use("*", (req, res) => {

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    
    res.status(404).send({
        error: -2,
        description: `ruta ${fullUrl} método ${req.method} no implementada`
    });

});


//INICIAMOS EL SERVIDOR
// ----------------------------------------------|

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ server.address().port }` );
})

server.on( 'error', ( error ) => {
    console.log( `Error en servidor: ${error}` );
} )