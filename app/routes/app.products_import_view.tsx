import React, { useState, useEffect } from 'react';
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Card, Page, DataTable, Thumbnail, Spinner } from "@shopify/polaris";
import { _DropiServices } from "_services/dropi.services";
import { NavDropi } from "./body_components/NavDropi";
import { json } from "@remix-run/node";
import { _ManageArray } from '_helpers/_ManageArray';
import { _ManageRequest } from '_helpers/_ManageRequest';
//import { _DropiModelProduct } from '_models/_DropiModelProduct';
import { _DropiControllerProduct } from '_controllers/_DropiControllerProduct';


const dropiServices = new _DropiServices();
const helperArray = new _ManageArray();
const helperRequest = new _ManageRequest();
//const dropiModelProduct = new _DropiModelProduct();
const dropiControllerProduct = new _DropiControllerProduct();


export const loader = async ({ request }) => {
  let paramsRequest = helperRequest.getParams(request);

  if (paramsRequest && paramsRequest.case && paramsRequest.case === "create_product") {
    if (paramsRequest.selectedItems.length > 0) {
      console.log("es mayor--->>")


      /*
      const { admin } = await authenticate.admin(request);
      const color = ["Red", "Orange", "Yellow", "Green"][
        Math.floor(Math.random() * 4)
      ];
      */
      let  variables = {};
      variables.input = {};
      variables.input.title = `ttteeesss33`;
      variables.input.variants = [];
      variables.input.variants = [{ price: 2222}];

      dropiControllerProduct.create(paramsRequest.selectedItems, request, variables)
    }
  }

  try {
    let resp = await dropiServices.getproductsStockAgo();
    if (resp.data.products) {
      if (resp.data.products.length < 0) {

      }
      return { "products": resp.data.products };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

export const action = async ({ request }) => {
  let d = 0;
  return {};
};


const Products = () => {

  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (product: any) => {
    helperArray.updateArray(product, selectedItems);
    console.log(selectedItems, 'selectedItems--->');
  };

  const [isLoading, setIsLoading] = useState(true);
  const loaderData = useLoaderData();



  const submit = useSubmit();

  useEffect(() => {
    if (loaderData) {
      setIsLoading(false);
    }
  }, [loaderData]);

  const handleCreateProduct = async () => {
    console.log("entro a handleCreateProduct");
    console.log("select items", selectedItems);
    submit({
      body: JSON.stringify({ selectedItems, "case": "create_product" }), // Aquí selectedItems es tu array
      replace: true,
      method: "POST"
    });
    try {
      //await submit({}); 
    } catch (error) {
      console.error('Failed to create product:', error.message);
    }
  };

  let rows = loaderData.products;

  if (isLoading) {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Page fullWidth>
      <NavDropi />
      <Card>
        <h1>Productos importados</h1>
        <button variant="primary" onClick={handleCreateProduct}>
          Generate a product
        </button>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text']}
          headings={['Disponible a venta', 'Nombre', 'SKU', 'Stock', 'price', 'Categoria', 'Descripción', 'ID']}
          rows={rows.map((product) => [
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(product)}
              checked={selectedItems.find(item => item.id === product.id)}
            />,

            <div>{product.title}</div>,
            <div>{product.sku}</div>,
            <div>{product.stock}</div>,
            <div>{product.price}</div>,
            <div>{product.category}</div>,
            <div
              style={{
                maxHeight: '100px',
                overflow: 'auto',
                padding: '5px',
                whiteSpace: 'normal',
              }}
            >{product.description}</div>,
            <div>{product.id}</div>,
          ])}
        />
      </Card>
    </Page>
  );
}

export default Products;
