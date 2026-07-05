export interface AddSshKey {
  user?: any;
  requestBody?: {
    algorithmType?: string;
    bitLength?: number;
    readonly createdDate?: string;
    expiryDays?: number;
    readonly fingerprint?: string;
    readonly id?: number;
    label?: string;
    readonly lastAuthenticated?: string;
    text?: string;
    /**
             * Contains a warning about the key, for example that it's deprecated
             */
    readonly warning?: string;
  };
}
