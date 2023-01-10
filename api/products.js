import fs from 'fs'

const dataJSON = fs.readFileSync('./api/data/products.txt', 'utf-8')
const prodsTxt = dataJSON ? JSON.parse(dataJSON) : {error: "no se encontraron productos"}

class ApiProducts {

    constructor() {
        this.products = prodsTxt
    }

    productsAll(){

        if( this.products.length > 0 ) {

            return this.products
    
        } else {

            return {error: 'no se encontraron productos'} 

        }

    }

    prodById( id ){

        let exists = this.products.some( p => p.id == id )

        if( exists ) {
            
            return this.products.find( p => p.id == id )
    
        } else {
    
            return {error : 'producto no encontrado'}
    
        }

    }

    // AL CREAR UN PRODUCTO NUEVO, EL ID, CODE Y TIMESTAMP, SE CREARAN EN AUTOMATICO. EL RESTO LOS INGRESARA EL ADMIN.
    saveProd( newProd ){

        function random(min, max) {
            return Math.floor((Math.random() * (max - min + 1)) + min);
        }

        let lastElement = this.products.length -1;

        let id = this.products.length > 0 ? this.products[lastElement].id + 1 : 1; 
        
        let date = new Date().toLocaleString()
    
        let prod = {id: id, ...newProd, timestamp: date, code: random(1, 9999)}

        this.products.push( prod )

        let prodToAdd = this.products
    
        async function save_prod()  {

            try{

                await fs.promises.writeFile('./api/data/products.txt', JSON.stringify( prodToAdd, null, '\t'))

                console.log(`producto guardado! id: ${id}`);

            }catch (err) {

                console.log(`Se ha producido un error: ${err}`);

            } 
            
        }
        
        save_prod()

    }

    updateProd( prod, id ){

        prod.id = Number(id)

        let index = this.products.findIndex( prod => prod.id == id)

        this.products.splice(index,1,prod)

        let updatedData = this.products

        async function update_Prod()  {
    
            try{

                await fs.promises.writeFile('./api/data/products.txt', JSON.stringify( updatedData, null, '\t'))

                console.log(`el producto con el id: ${id}, ha sido actualizado`);

            }catch (err) {

                console.log(`Se ha producido un error: ${err}`);

            } 
            
        }

        update_Prod()

    }

    deleteProdById( id ){

        let exists = this.products.some( p => p.id == id )
    
        if( exists ) {

            let item = this.products.find( p => p.id == id );
    
            let indice = this.products.indexOf( item );
            
            this.products.splice( indice, 1 )

            let updatedData = this.products
            
            async function deleteProdBy_Id()  {
    
                try{
    
                    await fs.promises.writeFile('./api/data/products.txt', JSON.stringify( updatedData, null, '\t'))
    
                    console.log(`el producto con el id: ${id}, ha sido eliminado`);
    
                }catch (err) {
    
                    console.log(`Se ha producido un error: ${err}`);
    
                } 
                
            }
    
            deleteProdBy_Id()
        
        } else {
    
            console.log('el producto que desea eliminar no existe');

        }

    }

}


export default ApiProducts