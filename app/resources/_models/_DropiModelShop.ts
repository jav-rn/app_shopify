
import { _DadModel } from "./_DadModel";

export class _DropiModelShop extends _DadModel {

  async queryGetShop(session: any, variables: any, extractName: string = '') {
    let query = `{
            shop {
               id
              name
              contactEmail
            }
          }`;
    return await this.executeGraphQL(session, variables, query, extractName)
  }

}