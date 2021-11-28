/**
 * An organisation is the authentication primitive. Users can belong to many
 * organisations, but they always have one parent.
 *
 * @examples require(".").examples
 */
export interface APIOrganisation {
  /**
   * The organisations unique identifier
   *
   * @format uuid
   * @maxLength 36
   * @minLength 36
   */
  id: string;
  /**
   * The organisations name
   *
   * @minLength 3
   * @maxLength 16
   */
  name: string;
  /**
   * The organisation owners email
   *
   * @format email
   */
  adminEmail: string;
}

export const examples: APIOrganisation[] = [
  {
    id: '74aedaae-9c58-49f6-8003-e8667becf5a0',
    name: 'Pauls scooters',
    adminEmail: 'paul@pauls-scooters.example.com',
  },
];
