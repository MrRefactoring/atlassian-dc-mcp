/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestSshCredentials = {
    /**
     * The key algorithm, if passing in a legacy X.509 encoded key. Do not specify for OpenSSH encoded keys
     */
    algorithm?: string;
    /**
     * The public key text in the OpenSSH format. The algorithm must be specified in case of the legacy X.509 keys
     */
    publicKey: string;
    username?: string;
};

