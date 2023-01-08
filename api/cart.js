import fs from 'fs'
import ApiProducts from "./products.js";

const apiProds = new ApiProducts()

const dataJSON = fs.readFileSync('./api/data/cart.txt', 'utf-8')
const cartTxt = dataJSON ? JSON.parse(dataJSON) : []

class ApiCart {

    constructor() {
        this.carts = cartTxt
    }

    //POST
    //Crea un carrito y devuelve su id.
    createCart () {

        let lastElement = this.carts.length -1;

        let id = this.carts.length > 0 ? this.carts[lastElement].id + 1 : 1; 

        let date = new Date().toLocaleString()
        
        let newCart = {id: id, timestamp: date}

        this.carts.push(newCart)

        let cartToAdd = this.carts

        async function create_Cart()  {

            try{

                await fs.promises.writeFile('./api/data/cart.txt', JSON.stringify( cartToAdd, null, '\t'))

                console.log(`Carrito creado con id: ${id}`);

            }catch (err) {

                console.log(`Se ha producido un error: ${err}`);

            } 
            
        }
        
        create_Cart()

        return cartToAdd

    }

    //DELETE
    //Vacía un carrito y lo elimina
    deleteCart( id ) {

        let exists = this.carts.some( p => p.id == id )
    
        if( exists ) {

            let item = this.carts.find( p => p.id == id );
    
            let indice = this.carts.indexOf( item );
            
            this.carts.splice( indice, 1 )

            let updatedData = this.carts
            
            async function deleteProdBy_Id()  {
    
                try{
    
                    await fs.promises.writeFile('./api/data/cart.txt', JSON.stringify( updatedData, null, '\t'))
    
                    console.log(`el carrito con el id: ${id}, ha sido eliminado`);
    
                }catch (err) {
    
                    console.log(`Se ha producido un error: ${err}`);
    
                } 
                
            }
    
            deleteProdBy_Id()

            return updatedData
        
        } else {
    
            return {error: 'el carrito que desea eliminar no existe'}

        }

    }

    //GET
    //Me permite listar todos los productos guardados en el carrito
    getProdOfCartById( id ) {

        let exist = this.carts.some(c => c.id == id)

        let cartByID = exist ? this.carts.find(c => c.id == id) : {error: 'No existe un carrito con esa id'}

        return cartByID.products

    }

    //POST
    //Para incorporar productos al carrito por su id de producto
    //AGREGA PRODUCTOS AL ULTIMO CARRITO CREADO
    addProdToCart( id ) {

        let prod = apiProds.prodById(id)

        let lastElement = this.carts.length -1;

        if(this.carts[lastElement].products){

            //VER COMO AGREGAR MAS DE 1 PRODUCTO

        } else {

            this.carts[lastElement] = {...this.carts[lastElement], products: [prod]}
        
        }
        

        let updatedData = this.carts

        console.log(prod);

        async function addProdToCart_()  {
    
            try{

                await fs.promises.writeFile('./api/data/cart.txt', JSON.stringify( updatedData, null, '\t'))

                console.log(`producto con id: ${id}, ha sido agergado al carrito`);

            }catch (err) {

                console.log(`Se ha producido un error: ${err}`);

            } 
            
        }

        addProdToCart_()

        return this.carts

    }

    //DELETE
    //Eliminar un producto del carrito por su id de carrito y de producto
    deleteProdFromCart( id, id_prod ) {

        let prod = api.prodById(id_prod)

        let cart = this.carts.filter(c => c.id == id);

        if(cart.length > 0){

            let exist = this.cart.some( p => p.id == id_prod )

            if(exist) {
                
                cart.filter(p => p !== prod)

                let updatedCart = this.carts

                //PROBAR SI SE ELIMINO EL PRODUCTO
                console.log(updatedCart);

                //VER COMO SIGUE

                //SOBREESCRIPBIT ARCHIVO DE TEXTO

            } else {

                console.log('el producto que desea eliminar no existe');

            }



        } else {

            deleteCart( id )

            console.log(`Se elimino el carrito con id: ${id}, ya que el mismo no poseia productos`);

        }




    }

}

export default ApiCart