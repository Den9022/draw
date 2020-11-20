export class DataResponse {

    public static withData(data: any): DataResponse {
        const dataResponse = new DataResponse();
        dataResponse.data = data;
        dataResponse.hasError = false;
        dataResponse.errorMessage = null;
        return dataResponse;
    }

    public static withError(errorMessage: string): DataResponse {
        const dataResponse = new DataResponse();
        dataResponse.hasError = true;
        dataResponse.errorMessage = errorMessage;
        dataResponse.data = null;
        return dataResponse;
    }

    public hasError: boolean;
    public errorMessage: string;
    public data: any;

}