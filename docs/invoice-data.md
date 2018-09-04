# Invoice data

https://www.gov.uk/invoicing-and-taking-payment-from-customers

 * Invoice:
   * unique invoice id
   * date invoice issued

 * contractors company:
   * name
   * address
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

 * customer:
   * name
   * address

 * charge (goods/services):
   * description of charge
   * date provided
   * 1 or more Lines of:
     * time:
       * hours/days
       * rate
       * description
       * line total
     * materials:
       * ?

 * totals
   * amount charged
   * VAT amount
   * total amount owed
