import fs from 'fs'
import ApiProducts from "./products.js";

const apiProds = new ApiProducts()

const dataJSON = fs.readFileSync('./api/data/cart.txt', 'utf-8')
const cartTxt = dataJSON ? JSON.parse(dataJSON) : []

class ApiCart {

    constructor() {
        this.carts = cartTxt
    }

    //Crea un carrito y devuelve su id.
    createCart () {

        let lastElement = this.carts.length -1;

        let id = this.carts.length > 0 ? this.carts[lastElement].id + 1 : 1; 

        let date = new Date().toLocaleString()
        
        let newCart = {id: id, timestamp: date, products: []}

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

    //Me permite listar todos los productos que tiene el carrito con dicho id.
    getProdOfCartById( id ) {

        let exist = this.carts.some(c => c.id == id)

        let cartByID = exist ? this.carts.find(c => c.id == id) : {error: 'No existe un carrito con esa id'}

        return cartByID.products

    }

    //Para incorporar productos al carrito.
    addProdToCart( id_cart, id_prod ) {

        let prodById = apiProds.prodById(id_prod)

        let cartById = this.carts.find(c => c.id == id_cart)

        let indexOfCart = this.carts.indexOf( cartById )

        this.carts[indexOfCart].products.push(prodById)
        
        let updatedData = this.carts

        async function addProdToCart_()  {
    
            try{

                await fs.promises.writeFile('./api/data/cart.txt', JSON.stringify( updatedData, null, '\t'))

                console.log(`producto con id ${id_prod}, ha sido agregado al carrito con id ${id_cart}`);

            }catch (err) {

                console.log(`Se ha producido un error: ${err}`);

            } 
            
        }

        addProdToCart_()

        return this.carts

    }

    //Eliminar un producto del carrito por su id de carrito y de producto
    deleteProdFromCart( id, id_prod ) {

        let prod = apiProds.prodById(id_prod)
        
        let cartById = this.carts.find(c => c.id == id);

        if(cartById) {

            if(cartById.products.length > 0){

                let exist = cartById.products.some( p => p.id == id_prod )

                if(exist) {
    
                    let indexOfProd = cartById.products.indexOf( prod );

                    let indexOfCart = this.carts.indexOf( cartById )
                    
                    this.carts[indexOfCart].products.splice( indexOfProd, 1 )

                    let updatedData = this.carts

                    async function deleteProdFromCart_()  {
    
                        try{
            
                            await fs.promises.writeFile('./api/data/cart.txt', JSON.stringify( updatedData, null, '\t'))
            
                            console.log(`producto con id: ${id_prod}, ha sido eliminado del carrito con id ${id}`);
            
                        }catch (err) {
            
                            console.log(`Se ha producido un error: ${err}`);
            
                        } 
                        
                    }
            
                    deleteProdFromCart_()

                    return this.carts

                } else {

                    console.log({error: 'el producto que desea eliminar no existe'});

                }

            } else {

                console.log({error: `El carrito con id: ${id}, se encuentra vacío`});

            }

        }else {

            console.log({error: 'El carrito del cual desea eliminar un producto, no existe'});

        }

    }

}

export default ApiCart