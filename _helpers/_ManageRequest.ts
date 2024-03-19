export class _ManageRequest {

    getParams = (request: any): any[] => {
        let queryString = new URL(request.url).searchParams;
        let body = queryString.get('body');
        let parsedBody = JSON.parse(body)
        return parsedBody;
    }
}