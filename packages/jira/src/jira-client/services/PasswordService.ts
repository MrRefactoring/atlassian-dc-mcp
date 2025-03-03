/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasswordPolicyCreateUserBean } from '../models/PasswordPolicyCreateUserBean.js';
import type { PasswordPolicyUpdateUserBean } from '../models/PasswordPolicyUpdateUserBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PasswordService {
    /**
     * Get current password policy requirements
     * Returns the list of requirements for the current password policy. For example, "The password must have at least 10 characters.", "The password must not be similar to the user's name or email address.", etc.
     * @param hasOldPassword
     * @returns string Returns a JSON array of the user-facing messages.
     * @throws ApiError
     */
    public static getPasswordPolicy(
        hasOldPassword: boolean = false,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/password/policy',
            query: {
                'hasOldPassword': hasOldPassword,
            },
        });
    }
    /**
     * Get reasons for password policy disallowance on user creation
     * Returns a list of statements explaining why the password policy would disallow a proposed password for a new user.
     * You can use this method to test the password policy validation. This could be done prior to an action
     * where a new user and related password are created, using methods like the ones in
     * <a href="https://docs.atlassian.com/jira/latest/com/atlassian/jira/bc/user/UserService.html">UserService</a>.
     * For example, you could use this to validate a password in a create user form in the user interface, as the user enters it.
     * The username and new password must be not empty to perform the validation.
     * Note, this method will help you validate against the policy only. It won't check any other validations that might be performed
     * when creating a new user, e.g. checking whether a user with the same name already exists.
     *
     * @param requestBody The intended parameters for the user that would be created.
     * The username and new password must be specified.  The old password should be specified for
     * updates where the user would be required to enter it and omitted for those like a password
     * reset or forced change by the administrator where the old password would not be known.
     * @returns string Returns a JSON array of the user-facing messages.
     * @throws ApiError
     */
    public static policyCheckCreateUser(
        requestBody: PasswordPolicyCreateUserBean,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/password/policy/createUser',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid, such as if the username or password is left unspecified.`,
            },
        });
    }
    /**
     * Get reasons for password policy disallowance on user password update
     * Returns a list of statements explaining why the password policy would disallow a proposed new password for a user with an existing password.
     * You can use this method to test the password policy validation. This could be done prior to an action where the password
     * is actually updated, using methods like ChangePassword or ResetPassword.
     * For example, you could use this to validate a password in a change password form in the user interface, as the user enters it.
     * The user must exist and the username and new password must be not empty, to perform the validation.
     * Note, this method will help you validate against the policy only. It won't check any other validations that might be performed
     * when submitting a password change/reset request, e.g. verifying whether the old password is valid.
     *
     * @param requestBody The intended parameters for the update that would be performed.
     * The username and new password must be specified.  The old password should be specified for
     * updates where the user would be required to enter it and omitted for those like a password
     * reset or forced change by the administrator where the old password would not be known.
     * @returns string Returns a JSON array of the user-facing messages. If no policy is set, then his will be an empty list.
     * @throws ApiError
     */
    public static policyCheckUpdateUser(
        requestBody: PasswordPolicyUpdateUserBean,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/password/policy/updateUser',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid, such as if the username or new password is left unspecified.`,
                404: `Returned if the username does not correspond to any existing user.`,
            },
        });
    }
}
