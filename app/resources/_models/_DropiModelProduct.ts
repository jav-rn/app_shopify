import { _DadModel } from "./_DadModel";

export class _DropiModelProduct extends _DadModel {
  async queryImportProducts(request: any, variables: any, extractName: string) {
    let query = `
    query AllProducts(
      $first: Int
      $last: Int
      $startCursor: String
      $endCursor: String
      ) {
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
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
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
    `;
    return await this.executeGraphQLAdmin(request, query, variables, extractName)
  }

  async queryImportOneProducts(request: any, variables: any, extractName: string) {
    let query = `
    query AllProducts {
      products(first: 1) {
        nodes {
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
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
    `;
    return await this.executeGraphQLAdmin(request, query, variables, extractName)
  }

  async queryCreateProduct(request: any, variables: any, extractName: any) {
    console.log("llego a modelo");
    let query =
    `#graphql
    mutation populateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 10) {
            edges {
              node {
                id
                price
                barcode
                createdAt
              }
            }
          }
        }
      }
    }`
    /*
    let query =  `#graphql
    mutation populateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 10) {
            edges {
              node {
                id
                price
                barcode
                createdAt
              }
            }
          }
        }
      }
    }`
    */
    /*
    let query =`
    mutation populateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 10) {
            edges {
              node {
                id
                price
                sku
                barcode
                createdAt
              }
            }
          }
        }
      }
    }`
    */
    extractName = 'product';
    let resp = await this.executeGraphQLAdminJson(request, query, variables, extractName)
    console.log("resp mmm", resp)

    /*
    let query = `
    query AllProducts(
      $first: Int
      $last: Int
      $startCursor: String
      $endCursor: String
      ) {
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
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
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
    `;
    this.executeGraphQLAdmin(request, query, variables, extractName)
    */

    //this.executeGraphQLAdmin(request, query, variables, extractName)
   return null; // aca es error
  }
}