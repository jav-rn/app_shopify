import { _DropiModelProduct } from "~/resources/_models/_DropiModelProduct";

export class _DropiControllerProduct {
    dropiModelProduct: any;

    constructor() {
        this.dropiModelProduct = new _DropiModelProduct;
    }


    async create(product: any, request: any, variable : any) {
        console.log("llego a creacion de producto");
        console.log("controller products", product);

        let variables = {};
        variables.input = {};
        variables.input.title = `ttttt111`;
        variables.input.variants = [];
        variables.input.variants = [{ price: 2222}];
/*
        let variable = {};
      
        product.map(product  => {
            variable = {};
            console.log(product, "product desde controller")
            variable.input = {};
            variable.input.title     = product.title;
            variable.input.vendor    = 'Dropi-v1';
            variable.input.variants  = [
                {
                    price : product.price,
                    sku :   product.sku
                }
            ];
        });
  */      
  

        //console.log('variable--->>',variable);
        let resp = await this.dropiModelProduct.queryCreateProduct(request,variables,'product');
        console.log("resp->>",resp);




        //this.dropiModelProduct.queryCreateProduct(product, request, variable)
        /*
        let variables: {
            input: {
                title: product.title,
                vendor: "Dropi-v1", // ojo cambiar
                variants: [
                    {
                        price: product.price,
                        sku: product.sku,
                        stock: Product.stock
                    }
                ],
            },
        }
        */

       // console.log(variables)


       // const newProduct = this.dropiModelProduct.queryCreateProduct(product, request, variables)
    }



}