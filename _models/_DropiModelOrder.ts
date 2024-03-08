import { _DadModel } from "./_DadModel";
/* By: Javier Reyes */

export class _DropiModelOrder extends _DadModel {

  async queryProductByOrder(admin: any, variables: any, extractName: string = '') {
    let query = `
        query OrderQuery($orderId: ID!) {
          order(id: $orderId) {
            id
            name
            createdAt
            displayFinancialStatus
            note
            tags
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            billingAddress {
              id
              name
              address1
              address2
              company
              city
              zip
              province
              country
              phone
            }
            app {
              id
            },
             customer {
              id
              firstName
              lastName
              email
              phone
               defaultAddress {
                id
                firstName
                lastName
                company
                address1
                address2
                city
                province
                country
                zip
                phone
                latitude
                longitude
              }
            }
            lineItems(first: 250) {
              edges {
                node {
                  title
                  name
                  id
                  sku
                  quantity
                  variant {
                    id
                    price
                    product {
                      id
                      productType,
                      publishedAt,
                      title,
                    }
                  }
                }
              }
            }
          }
        }
        `;
    //console.log("query--->>>");
    return await this.executeGraphQLAdminV2(admin, query, variables, extractName)
  }

  async queryAllOrders(request: any, variables: any, extractName: any) {
    let query = `
      query AllOrders(
        $first: Int
        $last: Int
        $startCursor: String
        $endCursor: String
      ) {
        orders(first: $first, last: $last, before: $startCursor, after: $endCursor) {
          edges {
            node {
              id
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              createdAt
              customer {
                id
                displayName
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

  async queryOneOrders(request: any, variables: any, extractName: any) {
    let query = `
      query AllOrders {
        orders(first: 1) {
          edges {
            node {
              id
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              createdAt
              customer {
                id
                displayName
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
}