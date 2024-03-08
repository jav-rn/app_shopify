/* 
npm run shopify app deploy
*/
import { apiVersion, authenticate } from "~/shopify.server";

export class _DadModel {

  protected async executeGraphQL(session: any, variables: any, query: any, extractName: string): Promise<any> {
    const { shop, accessToken } = session;
    const query_base_url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

    const response = await fetch(query_base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken!
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });
    return await this.cleanResult(response, extractName)
  }

  protected async executeGraphQLAdmin(request: any, query: any, variables: any, extractName: string) {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      query,
      {
        variables: variables
      },
    );
    let resp = await this.cleanResult(response, extractName)
    //console.log('respons------>', resp);
    return resp;
  }

  protected async executeGraphQLAdminV2(admin: any, query: any, variables: any, extractName: string) {
    const response = await admin.graphql(
      query,
      {
        variables: variables
      },
    );
    return await this.cleanResult(response, extractName)
  }

  protected parseIntId(data: any, key: string) {
    return data[key].id.split('/').pop();
  }

  private async cleanResult(response: any, extractName: any) {
    const responseJson = await response.json();
    if (!response) return null;
    if (response.ok) {
      const { data: { [extractName]: dynamicData } } = responseJson;
      let resp: { [key: string]: any } = {};
      resp[extractName] = dynamicData;
      return resp;
    } else {
      return null;
    }
  }

}

