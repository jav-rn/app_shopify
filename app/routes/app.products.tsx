import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page, DataTable, Pagination, Thumbnail } from "@shopify/polaris";
import { apiVersion, authenticate } from "~/shopify.server";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import './public/css/product.css';


export const query = `
query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        cursor
        node {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                sku
                inventoryQuantity
                price
              }
            }
          }
          collections(first: 1) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    }
  }
`;



export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request)
    const { shop, accessToken } = session;

    
    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken!
            },
            body: JSON.stringify({
                query: query,
                variables: { first: 10, after: null } // Initial request fetches first 10 products
              })
        });

        if (response.ok) {

            const data = await response.json()

        
            const {
                data: {
                    products: { edges }
                }
            } = data;

            return edges
        }

        return null
    } catch (err) {
        console.log(err)
    }
};



const Products = () => {
    const location = useLocation();

      /* Seleccion de items  */
      const [selectedItems, setSelectedItems] = useState([]);
      const handleCheckboxChange = (productId) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(item => item !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
        console.log('products seleccionados',selectedItems )
        
    };
  /******** */

    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page") || "1");
    console.log('page->',page)

    const products: any = useLoaderData();
    //console.log(products);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
   // const currentProducts = products.slice(firstItemIndex, lastItemIndex);
   const currentProducts = products;


    const rows = currentProducts.map((product: any) => {
        const { node } = product;
        const { images, title, description, variants, id, collections } = node;
        const sku      = variants.edges[0]?.node.sku || '';
        const stock    = variants.edges[0]?.node.inventoryQuantity || '';
        const price    = variants.edges[0]?.node.price || '';
        const imageSrc = images.edges[0]?.node.originalSrc || '';
        const category = collections.edges[0]?.node.title || '';



        // Función para limpiar las etiquetas HTML
        /*
        const stripHtmlTags = (html: string) => {
            const cheerio = require('cheerio');
            const $ = cheerio.load(html);
            return $.text();
        };
        */

        //console.log(products,'products')
        return {
            imageSrc,
            title: title || '',
            description,
            sku,
            stock,
            id,
            price,
            category
        };
    
    }
    
    
    );

    const handlePagination = (newPage: number) => {
      //  const baseUrl =  'https://admin.shopify.com/store/dropi-v1/apps/dropi-v01/app';//window.location.origin;
      //  console.log(`${baseUrl}/products?page=${newPage}`,'urll')
      //  window.location.href = `${baseUrl}/products?page=${newPage}`;
    };
/*
    const handlePagination = (newPage: number) => {
        setCurrentPage(newPage);
    };
    */

    return (
        <Page title="Products" fullWidth >
        <Card >
            <DataTable 
                columnContentTypes={['text','text', 'text', 'text','text', 'text', 'text', 'text']}
                headings={['Disponible a venta','Imagen', 'Nombre', 'SKU', 'Stock','price','Categoria','Descripción','ID']}
                rows={rows.map((product: any) => [
                  <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(product.id)}
                  checked={selectedItems.includes(product.id)}
              />,

                    <div>
                        <Thumbnail source={product.imageSrc} alt={product.title} size="large" />
                    </div>,
                    <div>{product.title}</div>,
                    <div>{product.sku}</div>,
                    <div>{product.stock}</div>,
                    <div>{product.price}</div>,
                    <div>{product.category}</div>,
                    <div 
                    style={{ 
                      maxHeight: '100px', 
                      overflow: 'auto', 
                      padding: '5px' ,
                      whiteSpace: 'normal',
                    }}
                    >{product.description}</div>,
                    <div>{product.id}</div>,
       
                ])}
             
            />


            <Pagination
                hasPrevious={currentPage !== 1}
                onPrevious={() => handlePagination(currentPage - 1)}
                hasNext={currentPage * itemsPerPage < products.length}
                onNext={() => handlePagination(currentPage + 1)}
            />

        <button>Guardar seleccionados</button>
        </Card>
    </Page>
    );
};

export default Products;

