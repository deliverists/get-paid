# Contacts

## Info

The idea is that this can represent anyone - a contractor company, a client whether individual or a company. We will probably need to list a contact as a type (array of to allow a contact to be multiple things.)

## data model

 * id
 * name
 * address
 * type [array]
 * contact information (phone/email?)
 * If LTD company:
   * full company name as shown on certificat of incorporation
   * company number
 * If sole trader:
   * traders name, + any business name used
   * traders address
 * If VAT registered:
   * VAT number
 * payment details:
   * Bank transfer (EFT):
     * sort code
     * account number
     * payment terms
   * Cheque?
