/**
 * A user is the actor primitive, that can belong to many organisations
 *
 * The users Roles are controlled by cognito, along with the parent_org_id.
 *
 * When a user authenticates with an organisation, its org_id is set to that
 * organisations id. The parent_org_id will always be set as well.
 *
 * Child orgs can remove users from their org, but only the parent org can
 * delete the user.
 *
 * @examples require(".").examples
 */
export interface APIUser {
  /**
   * The users unique id
   *
   * @format uuid
   * @maxLength 36
   * @minLength 36
   */
  id: string;
  /**
   * The users name
   *
   * @minLength 3
   * @maxLength 16
   */
  name: string;
  /**
   * The users email
   *
   * @format email
   * @minLength 3
   * @maxLength 16
   */
  email: string;
}

export const examples: APIUser[] = [
  {
    id: '74aedaae-9c58-49f6-8003-e8667becf5a0',
    name: 'Sean Price King IV',
    email: 'sean@lawfirm.example.com',
  },
];
